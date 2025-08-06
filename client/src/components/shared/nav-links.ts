// FILE: src/lib/nav-links.ts

import {
  Home,
  Settings,
  User,
  LayoutGrid,
  Bookmark,
  Compass,
  Bell,
} from "lucide-react";

export const navLinks = [
  {
    href: "/",
    label: "Home",
    icon: Home,
  },
  {
    href: "/about",
    label: "About",
    icon: Compass,
  },

  {
    href: "/profile",
    label: "My Profile",
    icon: User,
  },
  {
    href: "/admin",
    label: "Admin",
    icon: LayoutGrid,
  },
  {
    href: "/notifications",
    label: "Notifications",
    icon: Bell,
  },
];

export const settingsLink = {
  href: "/settings",
  label: "Settings",
  icon: Settings,
};
