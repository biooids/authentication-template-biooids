// FILE: src/components/layouts/ThemeSync.tsx

"use client";

import { useEffect } from "react";
import { useTheme } from "next-themes";
import { useAppSelector } from "@/lib/hooks/hooks";
import { selectCurrentSettings } from "@/lib/features/settings/settingsSlice";

/**
 * A non-rendering component that synchronizes the theme from the database (via Redux)
 * with the local theme provider (next-themes).
 */
export default function ThemeSync() {
  const { theme, setTheme } = useTheme();
  const settings = useAppSelector(selectCurrentSettings);

  useEffect(() => {
    // Check if settings have been loaded from the backend
    if (settings) {
      const savedTheme = settings.theme.toLowerCase();
      // If the local theme is different from the saved theme, update it.
      if (theme !== savedTheme) {
        setTheme(savedTheme);
      }
    }
  }, [settings, theme, setTheme]); // Rerun whenever settings or local theme change

  // This component renders nothing.
  return null;
}
