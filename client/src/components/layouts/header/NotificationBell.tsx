"use client";

import React from "react";
import Link from "next/link";
import { useAppSelector } from "@/lib/hooks/hooks";
import {
  selectAllNotifications,
  selectUnreadNotificationsCount,
} from "@/lib/features/notifications/notificationsSlice";
import { useMarkAllAsReadMutation } from "@/lib/features/notifications/notificationsApiSlice";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Bell, CheckCheck } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function NotificationBell() {
  const notifications = useAppSelector(selectAllNotifications);
  const unreadCount = useAppSelector(selectUnreadNotificationsCount);
  const [markAllAsRead] = useMarkAllAsReadMutation();

  // Show only the 5 most recent notifications in the dropdown
  const recentNotifications = notifications.slice(0, 5);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
              {unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notifications</span>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-auto px-2 py-1 text-xs"
              onClick={() => markAllAsRead()}
            >
              <CheckCheck className="mr-1 h-3 w-3" />
              Mark all as read
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {recentNotifications.length === 0 ? (
          <p className="p-4 text-center text-sm text-muted-foreground">
            No new notifications.
          </p>
        ) : (
          recentNotifications.map((notification) => (
            <DropdownMenuItem key={notification.id} asChild>
              <Link
                href={notification.url || "#"}
                className="flex items-start gap-3 p-2"
              >
                {!notification.isRead && (
                  <span className="h-2 w-2 mt-1.5 rounded-full bg-primary shrink-0"></span>
                )}
                <div className={notification.isRead ? "ml-5" : ""}>
                  <p className="text-sm font-medium leading-tight">
                    {notification.content}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatDistanceToNow(new Date(notification.createdAt), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
              </Link>
            </DropdownMenuItem>
          ))
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link
            href="/notifications"
            className="w-full justify-center text-sm font-medium text-primary"
          >
            View all notifications
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
