// FILE: src/lib/nav-links.ts

import {
  Home,
  Settings,
  User,
  LayoutGrid,
  Bookmark,
  Compass,
} from "lucide-react";

export const navLinks = [
  {
    href: "/",
    label: "Home",
    icon: Home,
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
];

export const settingsLink = {
  href: "/settings",
  label: "Settings",
  icon: Settings,
};
