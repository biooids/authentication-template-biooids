// FILE: src/routes/apiRoutes.ts (Corrected)

import { Router } from "express";
import authRoutes from "../features/auth/auth.routes.js";
import userRoutes from "../features/user/user.routes.js";
import adminRoutes from "../features/admin/admin.routes.js";
import emailRoutes from "../features/email/email.routes.js";
import { authenticate } from "../middleware/authenticate.js";

const router: Router = Router();

// This middleware runs on all API routes
router.use(authenticate());

router.get("/health", (_req, res) => {
  res
    .status(200)
    .json({ status: "success", message: "API router is healthy." });
});

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/admin", adminRoutes);
router.use("/email", emailRoutes);

export default router;
