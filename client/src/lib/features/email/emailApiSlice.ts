// FILE: src/lib/features/email/emailApiSlice.ts (Corrected)

import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../../api/baseQueryWithReauth";
import type {
  ForgotPasswordDto,
  ResetPasswordDto,
  VerifyEmailDto,
} from "./emailTypes";

export const emailApiSlice = createApi({
  reducerPath: "emailApi",
  baseQuery: baseQueryWithReauth,
  // This slice can invalidate tags provided by other slices (like userApiSlice)
  tagTypes: ["Me"],
  endpoints: (builder) => ({
    forgotPassword: builder.mutation<{ message: string }, ForgotPasswordDto>({
      query: (credentials) => ({
        url: "/email/forgot-password",
        method: "POST",
        body: credentials,
      }),
    }),
    resetPassword: builder.mutation<{ message: string }, ResetPasswordDto>({
      query: (credentials) => ({
        url: "/email/reset-password",
        method: "POST",
        body: credentials,
      }),
    }),
    verifyEmail: builder.mutation<{ message: string }, VerifyEmailDto>({
      query: (credentials) => ({
        url: "/email/verify-email",
        method: "POST",
        body: credentials,
      }),

      invalidatesTags: ["Me"],
    }),
    resendVerificationEmail: builder.mutation<{ message: string }, void>({
      query: () => ({
        url: "/email/resend-verification",
        method: "POST",
      }),
    }),
  }),
});

export const {
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useVerifyEmailMutation,
  useResendVerificationEmailMutation,
} = emailApiSlice;
