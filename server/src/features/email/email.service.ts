// FILE: server/src/features/email/email.service.ts

import crypto from "crypto";
import bcrypt from "bcryptjs";
import formData from "form-data";
import Mailgun from "mailgun.js";
import { User } from "@/prisma-client";
import { config } from "../../config/index.js";
import { logger } from "../../config/logger.js";
import prisma from "../../db/prisma.js";
import { createHttpError } from "../../utils/error.factory.js";
import { userService } from "../user/user.service.js";
import { ResetPasswordInputDto } from "./email.types.js";
import { generateEmailHtml } from "./email-templates.js";

const mailgun = new Mailgun(formData);
const mg = mailgun.client({
  username: "api",
  key: config.mailgun.apiKey,
});

class EmailService {
  /**
   * A private helper to send emails to avoid repeating the try/catch block.
   */
  private async sendEmail(
    to: string,
    subject: string,
    html: string,
    from: string
  ) {
    const messageData = { from, to, subject, html };
    try {
      await mg.messages.create(config.mailgun.domain, messageData);
      logger.info({ to, subject }, "Email sent successfully.");
    } catch (error) {
      logger.error({ err: error, to, subject }, "Failed to send email.");
    }
  }

  // ===============================================
  // ===           WELCOME & VERIFICATION        ===
  // ===============================================

  public async sendWelcomeVerificationEmail(
    user: User,
    callbackUrl?: string
  ): Promise<void> {
    await prisma.emailVerificationToken.deleteMany({
      where: { userId: user.id },
    });

    const verificationToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(verificationToken)
      .digest("hex");
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    await prisma.emailVerificationToken.create({
      data: { userId: user.id, token: hashedToken, expiresAt },
    });

    let verificationUrl = `${config.frontendUrl}/auth/verify-email?token=${verificationToken}`;
    if (callbackUrl) {
      verificationUrl += `&callbackUrl=${encodeURIComponent(callbackUrl)}`;
    }

    const emailHtml = generateEmailHtml({
      title: `Welcome, ${user.name}!`,
      body: `<p>Thanks for signing up! Please click the button below to verify your email address and activate your account.</p><p>This link will expire in 24 hours. If you did not sign up for a Biooids account, you can safely ignore this email.</p>`,
      button: {
        text: "Verify Email Address",
        url: verificationUrl,
      },
    });

    await this.sendEmail(
      user.email,
      "Welcome! Please Verify Your Email Address",
      emailHtml,
      `Biooids <welcome@${config.mailgun.domain}>`
    );
  }

  // ===============================================
  // ===           EMAIL VERIFICATION            ===
  // ===============================================

  public async verifyEmail(token: string): Promise<void> {
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const storedToken = await prisma.emailVerificationToken.findUnique({
      where: { token: hashedToken },
    });

    if (!storedToken) {
      throw createHttpError(
        400,
        "This verification link is invalid or has already been used."
      );
    }

    if (new Date() > storedToken.expiresAt) {
      await prisma.emailVerificationToken.delete({
        where: { id: storedToken.id },
      });
      throw createHttpError(400, "Verification token has expired.");
    }

    const user = await userService.findUserById(storedToken.userId);

    if (user?.emailVerified) {
      await prisma.emailVerificationToken.delete({
        where: { id: storedToken.id },
      });
      logger.info(
        { userId: storedToken.userId },
        "User is already verified. Token removed."
      );
      return;
    }

    await prisma.$transaction([
      prisma.user.update({
        where: { id: storedToken.userId },
        data: { emailVerified: true },
      }),
      prisma.emailVerificationToken.delete({
        where: { id: storedToken.id },
      }),
    ]);

    logger.info({ userId: storedToken.userId }, "Email verified successfully.");
  }

  // ===============================================
  // ===           PASSWORD MANAGEMENT           ===
  // ===============================================

  public async sendPasswordResetEmail(email: string): Promise<void> {
    const user = await userService.findUserByEmail(email);
    if (!user) {
      logger.warn({ email }, "Password reset requested for non-existent user.");
      return;
    }

    await prisma.passwordResetToken.deleteMany({ where: { userId: user.id } });
    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    await prisma.passwordResetToken.create({
      data: { userId: user.id, token: hashedToken, expiresAt },
    });

    const resetUrl = `${config.frontendUrl}/auth/reset-password?token=${resetToken}`;

    const emailHtml = generateEmailHtml({
      title: "Password Reset Request",
      body: `<p>Hi ${user.name},</p><p>You requested to reset your password. Click the button below to set a new one. This link expires in 15 minutes.</p><p>If you did not request this, please ignore this email.</p>`,
      button: {
        text: "Reset Your Password",
        url: resetUrl,
      },
    });

    await this.sendEmail(
      user.email,
      "Your Password Reset Request",
      emailHtml,
      `Biooids <noreply@${config.mailgun.domain}>`
    );
  }

  public async resetPassword(input: ResetPasswordInputDto): Promise<void> {
    const { token, newPassword } = input;
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const storedToken = await prisma.passwordResetToken.findUnique({
      where: { token: hashedToken },
    });

    if (!storedToken) {
      throw createHttpError(400, "Invalid or expired password reset token.");
    }
    if (new Date() > storedToken.expiresAt) {
      await prisma.passwordResetToken.delete({ where: { id: storedToken.id } });
      throw createHttpError(400, "Password reset token has expired.");
    }

    const newHashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.$transaction([
      prisma.user.update({
        where: { id: storedToken.userId },
        data: { hashedPassword: newHashedPassword },
      }),
      prisma.passwordResetToken.delete({ where: { id: storedToken.id } }),
    ]);

    logger.info({ userId: storedToken.userId }, "Password reset successful.");
  }

  // ===============================================
  // ===           SECURITY NOTIFICATIONS        ===
  // ===============================================

  public async sendPasswordChangeConfirmationEmail(user: User): Promise<void> {
    const emailHtml = generateEmailHtml({
      title: "Your Password Has Been Changed",
      body: `<p>Hi ${user.name},</p><p>This is a confirmation that the password for your account was just changed.</p><p>If you did not make this change, please reset your password immediately and contact our support team.</p>`,
    });

    await this.sendEmail(
      user.email,
      "Your Password Has Been Changed",
      emailHtml,
      `Biooids <security@${config.mailgun.domain}>`
    );
  }

  public async sendEmailChangeNotificationEmail(
    oldEmail: string,
    newEmail: string,
    name: string
  ): Promise<void> {
    const emailHtml = generateEmailHtml({
      title: "Your Email Address Has Been Changed",
      body: `<p>Hi ${name},</p><p>The email for your account has been changed from ${oldEmail} to ${newEmail}.</p><p>If you did not authorize this, please contact our support team immediately.</p>`,
    });

    await this.sendEmail(
      oldEmail,
      "Your Email Address Has Been Changed",
      emailHtml,
      `Biooids <security@${config.mailgun.domain}>`
    );
  }

  // ===============================================
  // ===           ACCOUNT NOTIFICATIONS         ===
  // ===============================================

  public async sendAccountDeletionConfirmationEmail(
    email: string,
    name: string
  ): Promise<void> {
    const emailHtml = generateEmailHtml({
      title: "Account Deletion Confirmation",
      body: `<p>Hi ${name},</p><p>This is a confirmation that your account associated with this email address has been permanently deleted from our platform.</p><p>Thank you for your time with us. If you did not request this action or believe this was a mistake, please contact our support team immediately.</p>`,
    });

    await this.sendEmail(
      email,
      "Your Account Has Been Deleted",
      emailHtml,
      `Biooids <noreply@${config.mailgun.domain}>`
    );
  }
}

export const emailService = new EmailService();
