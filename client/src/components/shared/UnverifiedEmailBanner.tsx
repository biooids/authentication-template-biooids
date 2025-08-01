// FILE: src/components/shared/UnverifiedEmailBanner.tsx (NEW FILE)

"use client";

import React from "react";
import { useAppSelector } from "@/lib/hooks/hooks";
import { selectCurrentUser } from "@/lib/features/user/userSlice";
import { useResendVerificationEmailMutation } from "@/lib/features/email/emailApiSlice";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export default function UnverifiedEmailBanner() {
  const currentUser = useAppSelector(selectCurrentUser);
  const [resendVerificationEmail, { isLoading }] =
    useResendVerificationEmailMutation();

  const handleResend = async () => {
    try {
      const response = await resendVerificationEmail().unwrap();
      toast.success(response.message);
    } catch (err: any) {
      const errorMessage =
        err?.data?.message || "Failed to resend verification email.";
      toast.error(errorMessage);
    }
  };

  // Only show the banner if the user is logged in but their email is not verified
  if (!currentUser || currentUser.emailVerified) {
    return null;
  }

  return (
    <div className="w-full bg-yellow-500/10 border-b border-yellow-500/20 text-yellow-800 dark:text-yellow-300 p-3">
      <div className="container mx-auto flex items-center justify-center gap-4 text-sm">
        <AlertTriangle className="h-5 w-5" />
        <span className="font-medium">Please verify your email address.</span>
        <Button
          variant="link"
          className="h-auto p-0 text-current underline"
          onClick={handleResend}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : (
            "Resend verification link"
          )}
        </Button>
      </div>
    </div>
  );
}
