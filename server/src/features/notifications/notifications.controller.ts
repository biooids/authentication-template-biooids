//src/features/notification
import { Request, Response } from "express";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import { notificationService } from "./notifications.service.js";

class NotificationController {
  getNotifications = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const notifications = await notificationService.getNotificationsForUser(
      userId
    );
    res.status(200).json({ status: "success", data: { notifications } });
  });

  markAsRead = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id;
    await notificationService.markAllAsRead(userId);
    res.status(204).send();
  });
}

export const notificationController = new NotificationController();
