// FILE: src/app/(app)/admin/layout.tsx (Corrected)
"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { SystemRole } from "@/lib/features/user/userTypes";
import AdminSidebar from "@/components/pages/admin/layouts/AdminSidebar";
import { Button } from "@/components/ui/button";
import { PanelLeft, Loader2 } from "lucide-react";

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

  const userRole = session?.user?.systemRole;
  const isAuthorized = userRole && userRole !== SystemRole.USER;

  if (status === "unauthenticated" || !isAuthorized) {
    redirect("/");
  }

  return (
    <div className="flex min-h-screen w-full bg-muted/40">
      <AdminSidebar
        userRole={userRole as SystemRole}
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
