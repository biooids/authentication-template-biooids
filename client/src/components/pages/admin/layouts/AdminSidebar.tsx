// FILE: src/components/pages/admin/layouts/AdminSidebar.tsx (Updated)
"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SystemRole } from "@/lib/features/user/userTypes";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Users, ShieldCheck, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const navLinks = [
  {
    href: "/admin",
    label: "Dashboard",
    icon: LayoutDashboard,
    requiredRole: [SystemRole.SUPER_ADMIN, SystemRole.DEVELOPER],
  },
  {
    href: "/admin/users",
    label: "Users",
    icon: Users,
    requiredRole: [SystemRole.SUPER_ADMIN],
  },
];

interface AdminSidebarProps {
  userRole: SystemRole;
  isMobileOpen: boolean;
  setIsMobileOpen: (isOpen: boolean) => void;
}

export default function AdminSidebar({
  userRole,
  isMobileOpen,
  setIsMobileOpen,
}: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        " inset-y-0 left-0 z-40  w-64 flex-col border-r   transition-transform duration-300 ease-in-out sm:relative sm:flex sm:translate-x-0",
        isMobileOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <div className="flex h-16 shrink-0 items-center justify-between border-b px-4">
        <Link
          href="/admin"
          className="flex items-center gap-2 font-semibold text-foreground"
        >
          <ShieldCheck className="h-6 w-6 text-primary" />
          <span>Admin Panel</span>
        </Link>
        <Button
          variant="ghost"
          size="icon"
          className="sm:hidden"
          onClick={() => setIsMobileOpen(false)}
        >
          <X className="h-6 w-6" />
          <span className="sr-only">Close menu</span>
        </Button>
      </div>
      <nav className="flex flex-col gap-1 p-4">
        {navLinks.map((link) => {
          if (!link.requiredRole.includes(userRole)) {
            return null;
          }
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "group flex items-center gap-3 rounded-md px-3 py-2.5 text-muted-foreground transition-all hover:bg-accent hover:text-foreground",
                isActive && "bg-accent font-semibold text-foreground"
              )}
              onClick={() => setIsMobileOpen(false)} // Close sidebar on navigation
            >
              <link.icon className="h-5 w-5" />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
