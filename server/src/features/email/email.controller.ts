//src/features/email/email.controller.ts
import { Request, Response } from "express";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import { emailService } from "./email.service.js";
import { createHttpError } from "@/utils/error.factory.js";
import { userService } from "../user/user.service.js";

class EmailController {
  forgotPassword = asyncHandler(async (req: Request, res: Response) => {
    const { email } = req.body;
    await emailService.sendPasswordResetEmail(email);
    res.status(200).json({
      status: "success",
      message:
        "If an account with that email exists, a password reset link has been sent.",
    });
  });

  resetPassword = asyncHandler(async (req: Request, res: Response) => {
    await emailService.resetPassword(req.body);
    res.status(200).json({
      status: "success",
      message: "Your password has been reset successfully. You can now log in.",
    });
  });

  verifyEmail = asyncHandler(async (req: Request, res: Response) => {
    const { token } = req.body;
    if (!token) {
      throw createHttpError(400, "Verification token is required.");
    }
    await emailService.verifyEmail(token);
    res.status(200).json({
      status: "success",
      message: "Your email has been verified successfully.",
    });
  });

  resendVerificationEmail = asyncHandler(
    async (req: Request, res: Response) => {
      const userId = req.user?.id;
      if (!userId) {
        throw createHttpError(
          401,
          "You must be logged in to resend a verification email."
        );
      }
      const user = await userService.findUserById(userId);
      if (!user) {
        throw createHttpError(404, "User not found.");
      }
      if (user.emailVerified) {
        throw createHttpError(400, "Your email is already verified.");
      }
      await emailService.sendWelcomeVerificationEmail(user);
      res.status(200).json({
        status: "success",
        message: "A new verification email has been sent.",
      });
    }
  );
}

export const emailController = new EmailController();
