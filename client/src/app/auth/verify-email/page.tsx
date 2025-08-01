// FILE: src/app/(auth)/verify-email/page.tsx (NEW FILE)

import VerifyEmail from "@/components/pages/auth/VerifyEmail";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Verify Your Email",
  description: "Confirm your email address to complete registration.",
};

export default function VerifyEmailPage() {
  return <VerifyEmail />;
}
