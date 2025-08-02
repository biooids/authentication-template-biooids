// FILE: src/features/settings/settings.types.ts

import { ThemePreference } from "@/prisma-client";

// This defines the shape of the data allowed when updating settings.
// All fields are optional, so the user can update one setting at a time.
export interface UpdateUserSettingsDto {
  theme?: ThemePreference;
  notificationsEnabled?: boolean;
  emailMarketing?: boolean;
  emailSocial?: boolean;
}
