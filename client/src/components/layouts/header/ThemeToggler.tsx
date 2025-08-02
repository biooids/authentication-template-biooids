// FILE: src/components/layouts/header/ThemeToggler.tsx

"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUpdateSettingsMutation } from "@/lib/features/settings/settingsApiSlice";
import { ThemePreference } from "@/lib/features/settings/settingsTypes";
import toast from "react-hot-toast";

export default function ThemeToggler() {
  const { setTheme } = useTheme();
  const [updateSettings] = useUpdateSettingsMutation();

  const handleThemeChange = async (newTheme: "light" | "dark" | "system") => {
    try {
      // 1. Instantly update the UI for a snappy user experience
      setTheme(newTheme);
      // 2. Save the preference to the backend in the background
      await updateSettings({
        theme: newTheme.toUpperCase() as ThemePreference,
      }).unwrap();
    } catch (error) {
      toast.error("Could not save theme preference.");
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleThemeChange("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleThemeChange("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleThemeChange("system")}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
