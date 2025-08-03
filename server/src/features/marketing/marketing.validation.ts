// FILE: src/features/marketing/marketing.validation.ts

import { z } from "zod";

// Schema for creating a new email draft.
export const createEmailSchema = z.object({
  body: z.object({
    subject: z.string().min(1, "Subject is required."),
    htmlContent: z.string().min(1, "Email content is required."),
    appVersion: z.string().optional(),
  }),
});

// Schema for updating an existing email draft. All fields are optional.
export const updateEmailSchema = z.object({
  body: z.object({
    subject: z.string().min(1).optional(),
    htmlContent: z.string().min(1).optional(),
    appVersion: z.string().optional(),
  }),
});
