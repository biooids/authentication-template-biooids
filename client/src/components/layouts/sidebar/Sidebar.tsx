// FILE: src/components/layouts/sidebar/Sidebar.tsx (Improved Version)

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navLinks, settingsLink } from "@/components/shared/nav-links";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function Sidebar() {
  const pathname = usePathname();

  return (
    // Use flex-col to structure the sidebar vertically
    <aside className="hidden w-64 flex-col border-r bg-background md:flex h-full">
      {/* 1. Header / Logo */}
      <div className="flex h-14 shrink-0 items-center border-b px-4 lg:h-[60px] lg:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <span className="">Your Logo</span>
        </Link>
      </div>

      {/* 2. Main Navigation (this section will grow to fill available space) */}
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
          {navLinks.map((link) => {
            // --- FIX: Home ('/') requires an exact path match, others can be partial ---
            const isActive =
              link.href === "/"
                ? pathname === link.href
                : pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                  isActive && "bg-muted text-primary"
                )}
              >
                <link.icon className="h-4 w-4" />
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* 3. Settings Link (this section is pushed to the bottom) */}
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
