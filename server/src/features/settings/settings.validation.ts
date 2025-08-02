// FILE: src/features/settings/settings.validation.ts

import { z } from "zod";
import { ThemePreference } from "@/prisma-client";

// This schema validates the body of the PATCH request for updating settings.
export const updateSettingsSchema = z.object({
  body: z.object({
    // The theme must be one of the values from our Prisma enum.
    theme: z.nativeEnum(ThemePreference).optional(),
    // The other settings are simple booleans.
    notificationsEnabled: z.boolean().optional(),
    emailMarketing: z.boolean().optional(),
    emailSocial: z.boolean().optional(),
  }),
});
