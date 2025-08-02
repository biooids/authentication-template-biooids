// FILE: src/app/(app)/settings/page.tsx

"use client";

import React from "react";
import { useGetSettingsQuery } from "@/lib/features/settings/settingsApiSlice";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Loader2 } from "lucide-react";
import ThemeSettings from "@/components/pages/settings/ThemeSettings";
import NotificationSettings from "@/components/pages/settings/NotificationSettings";

// A skeleton loader to show while fetching initial data.
const SettingsPageSkeleton = () => (
  <div className="space-y-8">
    <div className="space-y-4">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-5 w-96" />
      <Skeleton className="h-10 w-full rounded-lg" />
    </div>
    <div className="space-y-4">
      <Skeleton className="h-8 w-64" />
      <Skeleton className="h-5 w-full" />
      <div className="space-y-4 pt-2">
        <Skeleton className="h-12 w-full rounded-lg" />
        <Skeleton className="h-12 w-full rounded-lg" />
      </div>
    </div>
  </div>
);

export default function SettingsPage() {
  const { data: settings, isLoading, isError } = useGetSettingsQuery();

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-2xl py-10">
        <SettingsPageSkeleton />
      </div>
    );
  }

  if (isError || !settings) {
    return (
      <div className="container mx-auto max-w-2xl py-10">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Could not load your settings. Please try refreshing the page.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-2xl py-10 space-y-12">
      <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
      <ThemeSettings currentSettings={settings} />
      <NotificationSettings currentSettings={settings} />
    </div>
  );
}
