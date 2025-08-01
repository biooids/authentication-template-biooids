// FILE: src/app/(auth)/forgot-password/page.tsx

import ForgotPasswordForm from "@/components/pages/auth/ForgotPassword";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forgot Password",
  description: "Request a password reset for your account.",
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
