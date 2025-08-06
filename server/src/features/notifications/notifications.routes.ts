import { Router } from "express";
import { notificationController } from "./notifications.controller.js";
import { authenticate } from "../../middleware/authenticate.js";

const router: Router = Router();

// All notification routes require an authenticated user
router.use(authenticate({ required: true }));

router.get("/", notificationController.getNotifications);
router.post("/read", notificationController.markAsRead);

export default router;
