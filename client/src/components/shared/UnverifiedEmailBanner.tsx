"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useAppSelector } from "@/lib/hooks/hooks";
import { selectCurrentUser } from "@/lib/features/user/userSlice";
import { useResendVerificationEmailMutation } from "@/lib/features/email/emailApiSlice";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { MailWarning, Loader2 } from "lucide-react";
import { getApiErrorMessage } from "@/lib/utils";

export const COOLDOWN_SECONDS = 120;
export const LOCAL_STORAGE_KEY = "lastVerificationResendTime";

export default function UnverifiedEmailBanner() {
  const pathname = usePathname();
  const currentUser = useAppSelector(selectCurrentUser);
  const [resendEmail, { isLoading }] = useResendVerificationEmailMutation();
  const [secondsLeft, setSecondsLeft] = useState(0);

  useEffect(() => {
    const lastResendTime = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (lastResendTime) {
      const timePassed = (Date.now() - parseInt(lastResendTime, 10)) / 1000;
      const timeLeft = Math.ceil(COOLDOWN_SECONDS - timePassed);
      if (timeLeft > 0) {
        setSecondsLeft(timeLeft);
      }
    }

    if (secondsLeft > 0) {
      const intervalId = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(intervalId);
    }
  }, [secondsLeft]);

  const handleResend = async () => {
    if (isLoading || secondsLeft > 0) return;

    try {
      await resendEmail({ callbackUrl: pathname }).unwrap();
      toast.success("A new verification email has been sent.");
      localStorage.setItem(LOCAL_STORAGE_KEY, Date.now().toString());
      setSecondsLeft(COOLDOWN_SECONDS);
    } catch (err) {
      const errorMessage = getApiErrorMessage(err);
      if (errorMessage.includes("already verified")) {
        toast.success(errorMessage);
      } else {
        toast.error(errorMessage);
      }
    }
  };

  if (!currentUser || currentUser.emailVerified) {
    return null;
  }

  const isButtonDisabled = isLoading || secondsLeft > 0;

  return (
    <div className="p-0 rounded-none border-x-0 border-t-0 border-b border-yellow-500/50 bg-yellow-500/10 text-yellow-800 dark:text-yellow-300">
      <div className="w-full max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-center sm:justify-between text-center sm:text-left gap-2 p-3">
        <div className="flex items-center">
          <MailWarning className="h-5 w-5 mr-3 shrink-0" />
          <p className="text-sm">Please verify your email address.</p>
        </div>
        <Button
          variant="link"
          size="sm"
          onClick={handleResend}
          disabled={isButtonDisabled}
          className="text-yellow-800 dark:text-yellow-300 h-auto p-0 font-bold cursor-pointer disabled:opacity-60 shrink-0"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : secondsLeft > 0 ? (
            `Resend in ${secondsLeft}s`
          ) : (
            "Resend Link"
          )}
        </Button>
      </div>
    </div>
  );
}
