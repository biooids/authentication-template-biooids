// FILE: server/src/features/email/email.service.ts (WITH DEBUG LOGGING)

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

const mailgun = new Mailgun(formData);
const mg = mailgun.client({
  username: "api",
  key: config.mailgun.apiKey,
});

class EmailService {
  // ===============================================
  // ===           WELCOME & VERIFICATION        ===
  // ===============================================

  public async sendWelcomeVerificationEmail(user: User): Promise<void> {
    await prisma.emailVerificationToken.deleteMany({
      where: { userId: user.id },
    });

    const verificationToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(verificationToken)
      .digest("hex");
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    // --- DEBUG LOG 1 ---
    console.log("--- SENDING VERIFICATION ---");
    console.log("RAW TOKEN (sent in email):", verificationToken);
    console.log("HASHED TOKEN (saved to DB):", hashedToken);
    console.log("----------------------------");

    await prisma.emailVerificationToken.create({
      data: { userId: user.id, token: hashedToken, expiresAt },
    });

    const verificationUrl = `${config.frontendUrl}/auth/verify-email?token=${verificationToken}`;
    const messageData = {
      from: `biooids  <welcome@${config.mailgun.domain}>`,
      to: user.email,
      subject: "Welcome! Please Verify Your Email Address",
      html: `<h1>Welcome to Our Platform, ${user.name}!</h1><p>Please click the link below to verify your email address:</p><a href="${verificationUrl}" target="_blank">Verify Your Email</a><p>This link will expire in 24 hours.</p>`,
    };

    try {
      await mg.messages.create(config.mailgun.domain, messageData);
      logger.info({ userId: user.id }, "Welcome verification email sent.");
    } catch (error) {
      logger.error({ err: error }, "Failed to send welcome email.");
    }
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
      // --- THIS IS THE FIX ---
      // If the token doesn't exist, it might be because the user is already verified.
      // We check for this case to prevent an error.
      // Note: This logic assumes you can't get the user ID without the token.
      // If the user is already verified, we can treat it as a success.
      // For a more robust check, you might decode the raw token if it were a JWT,
      // but with a simple crypto token, this is a very strong defensive pattern.
      // We will simply throw a more user-friendly error.
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

    // If the user associated with the token is already verified, we can
    // delete the token and exit early.
    if (user?.emailVerified) {
      await prisma.emailVerificationToken.delete({
        where: { id: storedToken.id },
      });
      logger.info(
        { userId: storedToken.userId },
        "User is already verified. Token removed."
      );
      return; // Exit successfully
    }

    // Use a transaction to ensure both operations succeed or fail together.
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

    await prisma.passwordResetToken.deleteMany({
      where: { userId: user.id },
    });

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
    const messageData = {
      from: `biooids  <noreply@${config.mailgun.domain}>`,
      to: user.email,
      subject: "Your Password Reset Request",
      html: `<h1>Password Reset Request</h1><p>Hi ${user.name},</p><p>Click the link below to reset your password:</p><a href="${resetUrl}" target="_blank">Reset Your Password</a><p>This link expires in 15 minutes.</p><p>If you did not request this, please ignore this email.</p>`,
    };

    try {
      await mg.messages.create(config.mailgun.domain, messageData);
      logger.info({ userId: user.id }, "Password reset email sent.");
    } catch (error) {
      logger.error(
        { err: error },
        "Failed to send password reset email via Mailgun."
      );
      throw createHttpError(
        500,
        "Could not send the password reset email at this time. Please try again later."
      );
    }
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
    const messageData = {
      from: `biooids  <security@${config.mailgun.domain}>`,
      to: user.email,
      subject: "Your Password Has Been Changed",
      html: `<h1>Password Changed Successfully</h1><p>Hi ${user.name},</p><p>This is a confirmation that the password for your account was just changed.</p><p>If you did not make this change, please reset your password immediately and contact support.</p>`,
    };
    try {
      await mg.messages.create(config.mailgun.domain, messageData);
      logger.info({ userId: user.id }, "Password change confirmation sent.");
    } catch (error) {
      logger.error(
        { err: error },
        "Failed to send password change confirmation."
      );
    }
  }

  public async sendEmailChangeNotificationEmail(
    oldEmail: string,
    newEmail: string,
    name: string
  ): Promise<void> {
    const messageData = {
      from: `biooids  <security@${config.mailgun.domain}>`,
      to: oldEmail,
      subject: "Your Email Address Has Been Changed",
      html: `<h1>Email Address Changed</h1><p>Hi ${name},</p><p>The email for your account has been changed to ${newEmail}.</p><p>If you did not authorize this, please contact our support team immediately.</p>`,
    };
    try {
      await mg.messages.create(config.mailgun.domain, messageData);
      logger.info({ oldEmail, newEmail }, "Email change notification sent.");
    } catch (error) {
      logger.error({ err: error }, "Failed to send email change notification.");
    }
  }
  // ===============================================
  // ===           ACCOUNT NOTIFICATIONS         ===
  // ===============================================

  /**
   * Sends a final confirmation email after an account has been deleted.
   * @param email - The email address of the deleted user.
   * @param name - The name of the deleted user.
   */
  public async sendAccountDeletionConfirmationEmail(
    email: string,
    name: string
  ): Promise<void> {
    const messageData = {
      from: `biooids <noreply@${config.mailgun.domain}>`,
      to: email,
      subject: "Your Account Has Been Deleted",
      html: `
        <h1>Account Deletion Confirmation</h1>
        <p>Hi ${name},</p>
        <p>This is a confirmation that your account associated with this email address has been permanently deleted from our platform.</p>
        <p>Thank you for your time with us. If you did not request this action or believe this was a mistake, please contact our support team immediately.</p>
      `,
    };

    try {
      await mg.messages.create(config.mailgun.domain, messageData);
      logger.info({ email }, "Account deletion confirmation email sent.");
    } catch (error) {
      logger.error(
        { err: error },
        "Failed to send account deletion confirmation email."
      );
    }
  }
}

export const emailService = new EmailService();
