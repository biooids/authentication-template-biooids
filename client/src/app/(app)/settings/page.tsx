// FILE: src/app/(app)/settings/page.tsx

"use client";

import React from "react";
import Link from "next/link";
import { useSession } from "next-auth/react"; // 1. Import useSession
import { useGetSettingsQuery } from "@/lib/features/settings/settingsApiSlice";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, Loader2, LogIn } from "lucide-react";
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
  const { status } = useSession(); // 2. Get the authentication status
  const isAuthenticated = status === "authenticated";

  // Only run the query if the user is authenticated
  const {
    data: settings,
    isLoading,
    isError,
  } = useGetSettingsQuery(undefined, { skip: !isAuthenticated });

  // --- 3. Handle all authentication and data states ---

  // State 1: Session is being checked
  if (status === "loading") {
    return (
      <div className="container mx-auto max-w-2xl py-10">
        <SettingsPageSkeleton />
      </div>
    );
  }

  // State 2: User is not logged in
  if (status === "unauthenticated") {
    return (
      <div className="container mx-auto max-w-md py-20">
        <Card className="text-center">
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>
              You need to be logged in to manage your settings.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/auth/login?callbackUrl=/settings">
                <LogIn className="mr-2 h-4 w-4" />
                Proceed to Login
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // State 3: User is logged in, but data is still loading
  if (isLoading) {
    return (
      <div className="container mx-auto max-w-2xl py-10">
        <SettingsPageSkeleton />
      </div>
    );
  }

  // State 4: User is logged in, but there was an error fetching data
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

  // State 5: User is logged in and data is loaded successfully
  return (
    <div className="container mx-auto max-w-2xl py-10 space-y-12">
      <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
      <ThemeSettings currentSettings={settings} />
      <NotificationSettings currentSettings={settings} />
    </div>
  );
}
