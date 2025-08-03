"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { SystemRole } from "@/lib/features/user/userTypes";
import AdminSidebar from "@/components/pages/admin/layouts/AdminSidebar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PanelLeft, Loader2, ShieldAlert, LogIn } from "lucide-react";
import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Show a loading state while session is being fetched
  if (status === "loading") {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // --- THIS IS THE FIX ---

  // 1. Handle users who are not logged in at all.
  if (status === "unauthenticated") {
    // Instead of an instant redirect, show a clear message and a login button.
    return (
      <div className="flex h-screen items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <LogIn className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="mt-4 text-2xl">
              Authentication Required
            </CardTitle>
            <CardDescription>
              You must be logged in to access the admin panel.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/auth/login?callbackUrl=/admin">
                Proceed to Login
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const userRole = session?.user?.systemRole;
  const isAuthorized = userRole && userRole !== SystemRole.USER;

  // 2. Handle logged-in users who are not authorized.
  if (!isAuthorized) {
    // Show a helpful message for the developer.
    return (
      <div className="flex h-screen items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
              <ShieldAlert className="h-8 w-8 text-destructive" />
            </div>
            <CardTitle className="mt-4 text-2xl">Access Denied</CardTitle>
            <CardDescription>
              Your current role ({userRole}) does not have permission to access
              the admin panel.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border bg-muted p-4 text-sm text-muted-foreground">
              <p className="font-semibold">Developer Instructions:</p>
              <p>
                To gain access, update your user role in the database to
                'DEVELOPER' or 'SUPER_ADMIN' and then log in again.
              </p>
            </div>
            <Button asChild variant="outline">
              <Link href="/">Go to Homepage</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // 3. If the user is authorized, show the admin layout.
  return (
    <div className="flex min-h-screen w-full bg-muted/40">
      <AdminSidebar
        userRole={userRole}
        isMobileOpen={isSidebarOpen}
        setIsMobileOpen={setIsSidebarOpen}
      />
      <div className="flex flex-1 flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <Button
            size="icon"
            variant="outline"
            className="sm:hidden"
            onClick={() => setIsSidebarOpen(true)}
          >
            <PanelLeft className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </header>
        <main className="flex-1 p-4 sm:px-6 sm:py-0">{children}</main>
      </div>
    </div>
  );
}
