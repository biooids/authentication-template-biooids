//src/components/pages/notification/Notifications.tsx
"use client";

import React from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { useAppSelector } from "@/lib/hooks/hooks";
import { selectAllNotifications } from "@/lib/features/notifications/notificationsSlice";
import {
  useGetNotificationsQuery,
  useMarkAllAsReadMutation,
} from "@/lib/features/notifications/notificationsApiSlice";
import { Notification } from "@/lib/features/notifications/notificationsTypes";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Bell, CheckCheck } from "lucide-react";

// A reusable component for a single notification item
const NotificationItem = ({ notification }: { notification: Notification }) => (
  <Link
    href={notification.url || "#"}
    className="block p-4 -mx-4 rounded-lg transition-colors hover:bg-muted"
  >
    <div className="flex items-start gap-4">
      {!notification.isRead && (
        <span className="h-2 w-2 mt-1.5 rounded-full bg-primary shrink-0"></span>
      )}
      <div className={notification.isRead ? "ml-4" : ""}>
        <p className="text-sm text-foreground">{notification.content}</p>
        <p className="text-xs text-muted-foreground mt-1">
          {formatDistanceToNow(new Date(notification.createdAt), {
            addSuffix: true,
          })}
        </p>
      </div>
    </div>
  </Link>
);

export default function NotificationsPage() {
  // This hook is still essential. It triggers the initial fetch of historical notifications.
  const { isLoading, isError } = useGetNotificationsQuery();

  // This hook gets the "Mark all as read" function.
  const [markAllAsRead, { isLoading: isMarking }] = useMarkAllAsReadMutation();

  // --- THIS IS THE FIX ---
  // We get the live, real-time list of notifications directly from the Redux store.
  // This is the same selector the header bell uses, so it will always be up-to-date.
  const notifications = useAppSelector(selectAllNotifications);

  const unreadCount = notifications?.filter((n) => !n.isRead).length || 0;

  // Show a skeleton loader only during the very first data fetch.
  if (isLoading) {
    return (
      <div className="container mx-auto max-w-2xl py-8">
        <div className="space-y-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-2xl py-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-3">
            <Bell className="h-6 w-6" />
            <CardTitle>Notifications</CardTitle>
          </div>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => markAllAsRead()}
              disabled={isMarking}
            >
              <CheckCheck className="mr-2 h-4 w-4" />
              Mark all as read
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {isError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>Could not load notifications.</AlertDescription>
            </Alert>
          )}
          {notifications && notifications.length === 0 && !isLoading && (
            <div className="text-center text-muted-foreground py-16">
              <p>You have no notifications yet.</p>
            </div>
          )}
          {notifications && notifications.length > 0 && (
            <div className="space-y-2">
              {notifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
