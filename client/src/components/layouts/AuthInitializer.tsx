// FILE: src/components/layouts/AuthInitializer.tsx

"use client";

import { useSession } from "next-auth/react";
import { useGetMeQuery } from "@/lib/features/user/userApiSlice";
import { useGetSettingsQuery } from "@/lib/features/settings/settingsApiSlice"; // 1. Import settings query
import { Loader2 } from "lucide-react";
import ThemeSync from "./ThemeSync"; // 2. Import the new ThemeSync component

export default function AuthInitializer({
  children,
}: {
  children: React.ReactNode;
}) {
  const { status } = useSession();
  const isAuthenticated = status === "authenticated";

  // Trigger the user query when authenticated
  const { isLoading: isUserLoading } = useGetMeQuery(undefined, {
    skip: !isAuthenticated,
  });

  // Trigger the settings query when authenticated
  const { isLoading: areSettingsLoading } = useGetSettingsQuery(undefined, {
    skip: !isAuthenticated,
  });

  // Show a loading screen while the session is being checked or initial data is being fetched.
  if (status === "loading" || isUserLoading || areSettingsLoading) {
    return (
      <div className="flex items-center justify-center h-screen w-full">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      {/* 3. Add the ThemeSync component here */}
      {/* It will run only after the loading is complete and settings are available */}
      <ThemeSync />
      {children}
    </>
  );
}
