//src/components/pages/notification/Notifications.tsx

"use client";

import React from "react";
import { Notification } from "@/lib/features/notifications/notificationsTypes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Bell, AlertCircle } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";

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

interface NotificationsProps {
  notifications: Notification[];
  isLoading: boolean;
  isError: boolean;
  onMarkAllAsRead: () => void;
  isMarking: boolean;
}

export default function Notifications({
  notifications,
  isLoading,
  isError,
  onMarkAllAsRead,
  isMarking,
}: NotificationsProps) {
  const unreadCount = notifications?.filter((n) => !n.isRead).length || 0;

  return (
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
            onClick={onMarkAllAsRead}
            disabled={isMarking}
          >
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
  );
}
