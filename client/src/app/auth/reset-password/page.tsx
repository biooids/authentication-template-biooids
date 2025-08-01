// FILE: src/app/(auth)/reset-password/page.tsx (NEW FILE)

import ResetPasswordForm from "@/components/pages/auth/ResetPassword";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reset Your Password",
  description: "Create a new password for your account.",
};

export default function ResetPasswordPage() {
  return <ResetPasswordForm />;
}
