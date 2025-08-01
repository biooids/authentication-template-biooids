// FILE: src/lib/features/email/emailApiSlice.ts (FULLY COMPLETE)

import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../../api/baseQueryWithReauth";
import type {
  ForgotPasswordDto,
  ResetPasswordDto,
  VerifyEmailDto,
} from "./emailTypes";

// This slice handles all email-related actions like password resets and verifications.
export const emailApiSlice = createApi({
  reducerPath: "emailApi",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    // Endpoint for the "Forgot Password" form
    forgotPassword: builder.mutation<{ message: string }, ForgotPasswordDto>({
      query: (credentials) => ({
        url: "/email/forgot-password",
        method: "POST",
        body: credentials,
      }),
    }),
    // Endpoint for the "Reset Password" form
    resetPassword: builder.mutation<{ message: string }, ResetPasswordDto>({
      query: (credentials) => ({
        url: "/email/reset-password",
        method: "POST",
        body: credentials,
      }),
    }),
    // Endpoint to verify a user's email with a token
    verifyEmail: builder.mutation<{ message: string }, VerifyEmailDto>({
      query: (credentials) => ({
        url: "/email/verify-email",
        method: "POST",
        body: credentials,
      }),
    }),
    // Endpoint for a logged-in user to request a new verification email
    resendVerificationEmail: builder.mutation<{ message: string }, void>({
      query: () => ({
        url: "/email/resend-verification",
        method: "POST",
      }),
    }),
  }),
});

// Export all the hooks for use in your components
export const {
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useVerifyEmailMutation,
  useResendVerificationEmailMutation,
} = emailApiSlice;
