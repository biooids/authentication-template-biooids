// FILE: src/components/pages/settings/ThemeSettings.tsx

"use client";

import React from "react";
import { useTheme } from "next-themes";
import { useUpdateSettingsMutation } from "@/lib/features/settings/settingsApiSlice";
import {
  UserSettings,
  ThemePreference,
} from "@/lib/features/settings/settingsTypes";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Sun, Moon, Laptop } from "lucide-react";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

interface ThemeSettingsProps {
  currentSettings: UserSettings;
}

export default function ThemeSettings({ currentSettings }: ThemeSettingsProps) {
  const { setTheme } = useTheme();
  const [updateSettings, { isLoading }] = useUpdateSettingsMutation();

  const handleThemeChange = async (newTheme: ThemePreference) => {
    // Prevent changing to the same theme
    if (newTheme === currentSettings.theme) return;

    try {
      // 1. Update the backend first
      await updateSettings({ theme: newTheme }).unwrap();
      // 2. On success, update the frontend's theme visually
      setTheme(newTheme.toLowerCase());
      toast.success("Theme updated!");
    } catch (error) {
      toast.error("Failed to update theme.");
    }
  };

  const themeOptions = [
    { value: ThemePreference.LIGHT, label: "Light", icon: Sun },
    { value: ThemePreference.DARK, label: "Dark", icon: Moon },
    { value: ThemePreference.SYSTEM, label: "System", icon: Laptop },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Appearance</CardTitle>
        <CardDescription>
          Customize the look and feel of the application. Your preference will
          be synced across your devices.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4">
          {themeOptions.map((option) => (
            <Button
              key={option.value}
              variant="outline"
              onClick={() => handleThemeChange(option.value)}
              disabled={isLoading}
              className={cn(
                "flex flex-col h-24 gap-2",
                currentSettings.theme === option.value &&
                  "ring-2 ring-primary border-primary"
              )}
            >
              <option.icon className="h-6 w-6" />
              <span>{option.label}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
