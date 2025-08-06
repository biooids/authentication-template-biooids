//src/lib/features/notifications/notificationsTypes.ts
// This interface must match the Notification model in your Prisma schema.
export interface Notification {
  id: string;
  content: string;
  isRead: boolean;
  url: string | null;
  createdAt: string;
}

// This defines the shape of the API response when fetching notifications.
export interface GetNotificationsApiResponse {
  status: string;
  data: {
    notifications: Notification[];
  };
}
