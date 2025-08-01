import { Router } from "express";
import { emailController } from "./email.controller.js";
import { validate } from "../../middleware/validate.js";
import {
  forgotPasswordSchema,
  resetPasswordSchema,
  verifyEmailSchema,
} from "./email.validation.js";
import { authLimiter } from "../../middleware/rateLimiter.js";
import { authenticate } from "@/middleware/authenticate.js";

const router: Router = Router();

// Public routes with rate limiting
router.post(
  "/forgot-password",
  authLimiter,
  validate(forgotPasswordSchema),
  emailController.forgotPassword
);
router.post(
  "/reset-password",
  authLimiter,
  validate(resetPasswordSchema),
  emailController.resetPassword
);
router.post(
  "/verify-email",
  authLimiter,
  validate(verifyEmailSchema),
  emailController.verifyEmail
);

// Protected route
router.post(
  "/resend-verification",
  authenticate({ required: true }),
  emailController.resendVerificationEmail
);

export default router;
