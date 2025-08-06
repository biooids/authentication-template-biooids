//src/components/layouts/sidebar/Sidebar.tsx

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navLinks, settingsLink } from "@/components/shared/nav-links";
import { cn } from "@/lib/utils";
import { useAppSelector } from "@/lib/hooks/hooks";
import { selectUnreadNotificationsCount } from "@/lib/features/notifications/notificationsSlice";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

export default function Sidebar() {
  const pathname = usePathname();
  const unreadCount = useAppSelector(selectUnreadNotificationsCount);

  return (
    <aside className="hidden h-full w-64 flex-col border-r bg-background md:flex">
      <div className="flex h-14 shrink-0 items-center border-b px-4 lg:h-[60px] lg:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <span className="">Your Logo</span>
        </Link>
      </div>

      <div className="flex-1 overflow-auto py-2">
        <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
          {navLinks.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === link.href
                : pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center justify-between gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                  isActive && "bg-muted text-primary"
                )}
              >
                <div className="flex items-center gap-3">
                  <link.icon className="h-4 w-4" />
                  {link.label}
                </div>
                {link.href === "/notifications" && unreadCount > 0 && (
                  <Badge className="h-5 w-5 justify-center p-0">
                    {unreadCount}
                  </Badge>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto border-t p-4">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href={settingsLink.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                  pathname.startsWith(settingsLink.href) &&
                    "bg-muted text-primary"
                )}
              >
                <settingsLink.icon className="h-4 w-4" />
                <span>{settingsLink.label}</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">{settingsLink.label}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </aside>
  );
}
