// FILE: src/components/pages/auth/VerifyEmail.tsx (NEW FILE)

"use client";

import React, { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useVerifyEmailMutation } from "@/lib/features/email/emailApiSlice";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Loader2, AlertCircle, CheckCircle } from "lucide-react";

// This component contains the actual logic and UI
const VerifyEmailComponent = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [verifyEmail, { isLoading }] = useVerifyEmailMutation();
  const [verificationStatus, setVerificationStatus] = useState<{
    type: "loading" | "error" | "success";
    message: string;
  }>({
    type: "loading",
    message: "Verifying your email, please wait...",
  });

  useEffect(() => {
    const handleVerification = async () => {
      if (!token) {
        setVerificationStatus({
          type: "error",
          message: "No verification token found. Please check your link.",
        });
        return;
      }

      try {
        const response = await verifyEmail({ token }).unwrap();
        setVerificationStatus({ type: "success", message: response.message });
      } catch (err: any) {
        const errorMessage =
          err?.data?.message ||
          "An unknown error occurred during verification.";
        setVerificationStatus({ type: "error", message: errorMessage });
      }
    };

    handleVerification();
  }, [token, verifyEmail]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Email Verification
          </CardTitle>
          <CardDescription>
            Completing the final step to secure your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {verificationStatus.type === "loading" && (
            <div className="flex flex-col items-center gap-4 p-8">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="text-muted-foreground">
                {verificationStatus.message}
              </p>
            </div>
          )}
          {verificationStatus.type === "success" && (
            <div className="flex flex-col items-center gap-4 p-8">
              <CheckCircle className="h-12 w-12 text-green-500" />
              <p className="font-medium">{verificationStatus.message}</p>
              <Button asChild className="mt-4">
                <Link href="/auth/login">Proceed to Login</Link>
              </Button>
            </div>
          )}
          {verificationStatus.type === "error" && (
            <div className="flex flex-col items-center gap-4 p-8">
              <AlertCircle className="h-12 w-12 text-destructive" />
              <p className="font-medium text-destructive">
                Verification Failed
              </p>
              <p className="text-muted-foreground">
                {verificationStatus.message}
              </p>
              <Button asChild variant="secondary" className="mt-4">
                <Link href="/">Go to Homepage</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// We wrap the component in Suspense because useSearchParams requires it.
export default function VerifyEmail() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyEmailComponent />
    </Suspense>
  );
}
