"use client";

import React from "react";
import {
  useGetNotificationsQuery,
  useMarkAllAsReadMutation,
} from "@/lib/features/notifications/notificationsApiSlice";
import { Skeleton } from "@/components/ui/skeleton";
import Notifications from "@/components/pages/notification/Notifications"; // <-- Import your component

export default function NotificationsPage() {
  const {
    data: notifications,
    isLoading,
    isError,
  } = useGetNotificationsQuery();
  const [markAllAsRead, { isLoading: isMarking }] = useMarkAllAsReadMutation();

  // Show a skeleton loader while the initial data is being fetched
  if (isLoading) {
    return (
      <div className="container mx-auto max-w-2xl py-8">
        <div className="space-y-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-2xl py-8">
      <Notifications
        notifications={notifications || []}
        isLoading={isLoading}
        isError={isError}
        onMarkAllAsRead={() => markAllAsRead()}
        isMarking={isMarking}
      />
    </div>
  );
}
