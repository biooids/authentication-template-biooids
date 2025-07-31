// FILE: src/components/pages/admin/layouts/AdminLayout.tsx (NEW FILE)
"use-client";

import React, { useState } from "react";
import { useAppSelector } from "@/lib/hooks/hooks";
import { selectCurrentUser } from "@/lib/features/user/userSlice";
import AdminSidebar from "./AdminSidebar";
import { Button } from "@/components/ui/button";
import { PanelLeft } from "lucide-react";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const currentUser = useAppSelector(selectCurrentUser);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (!currentUser?.systemRole) {
    return (
      <div className="p-4">You do not have permission to view this page.</div>
    );
  }

  return (
    <div className="flex min-h-screen w-full bg-muted/40">
      <AdminSidebar
        userRole={currentUser.systemRole}
        isMobileOpen={isSidebarOpen}
        setIsMobileOpen={setIsSidebarOpen}
      />
      <div className="flex flex-col flex-1 sm:gap-4 sm:py-4 sm:pl-14">
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
