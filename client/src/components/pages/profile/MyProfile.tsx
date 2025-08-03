// FILE: src/components/pages/profile/MyProfile.tsx

"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react"; // 1. Import useSession
import Link from "next/link";
import { useAppSelector } from "@/lib/hooks/hooks";
import { selectCurrentUser } from "@/lib/features/user/userSlice";
import { Loader2, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ProfileHeader from "./ProfileHeader";
import ProfileForm from "./ProfileForm";
import ChangePasswordForm from "./ChangePasswordForm";
import DangerZone from "./DangerZone";

export default function MyProfilePage() {
  const { status } = useSession(); // 2. Get the authentication status
  const currentUser = useAppSelector(selectCurrentUser);
  const [isEditing, setIsEditing] = useState(false);

  // --- 3. Handle all authentication states explicitly ---

  // State 1: Session is still being checked
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  // State 2: User is not logged in
  if (status === "unauthenticated") {
    return (
      <div className="container mx-auto max-w-md py-20">
        <Card className="text-center">
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>
              You need to be logged in to view your profile page.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/auth/login">
                <LogIn className="mr-2 h-4 w-4" />
                Proceed to Login
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // State 3: User is logged in, but their data might still be fetching
  if (!currentUser) {
    // This loader will now only show for a brief moment for authenticated users
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  // State 4: User is logged in and data is loaded
  return (
    <div className="container mx-auto max-w-4xl py-8 space-y-12">
      {isEditing ? (
        <ProfileForm
          user={currentUser}
          onFinishedEditing={() => setIsEditing(false)}
        />
      ) : (
        <ProfileHeader user={currentUser} onEdit={() => setIsEditing(true)} />
      )}

      <ChangePasswordForm />
      <DangerZone />
    </div>
  );
}
