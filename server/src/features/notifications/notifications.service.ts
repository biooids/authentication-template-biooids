//src/features/notifications/notifications.service.ts

import prisma from "../../db/prisma.js";
// FIX: Import the socketManager instance, not a standalone function
import { socketManager } from "../../websockets/socketManager.js";

class NotificationService {
  /**
   * Creates a notification in the database AND emits a real-time event.
   * @param userId - The ID of the user to notify.
   * @param content - The notification message.
   * @param url - The URL to link to.
   */
  public async createNotification(
    userId: string,
    content: string,
    url: string
  ) {
    const notification = await prisma.notification.create({
      data: {
        userId,
        content,
        url,
      },
    });

    // After saving to the DB, use the manager to send the real-time push notification
    socketManager.emitNotification(userId, notification);

    return notification;
  }

  /**
   * Fetches all notifications for a specific user.
   * @param userId - The ID of the user.
   */
  public async getNotificationsForUser(userId: string) {
    return prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  }

  /**
   * Marks all unread notifications for a user as read.
   * @param userId - The ID of the user.
   */
  public async markAllAsRead(userId: string) {
    await prisma.notification.updateMany({
      where: {
        userId,
        isRead: false,
      },
      data: {
        isRead: true,
      },
    });
  }
}

export const notificationService = new NotificationService();
