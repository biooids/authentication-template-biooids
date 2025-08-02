// FILE: src/lib/features/settings/settingsTypes.ts

// This enum must match the one in your Prisma schema.
export enum ThemePreference {
  LIGHT = "LIGHT",
  DARK = "DARK",
  SYSTEM = "SYSTEM",
}

// This is the main shape of the settings object.
export interface UserSettings {
  id: string;
  theme: ThemePreference;
  notificationsEnabled: boolean;
  emailMarketing: boolean;
  emailSocial: boolean;
  updatedAt: string;
  userId: string;
}

// This type defines the data that can be sent when updating settings.
// All fields are optional.
export type UpdateUserSettingsDto = Partial<
  Omit<UserSettings, "id" | "updatedAt" | "userId">
>;

// --- API Response Shapes ---

export interface GetSettingsApiResponse {
  status: string;
  data: {
    settings: UserSettings;
  };
}

export interface UpdateSettingsApiResponse {
  status: string;
  message: string;
  data: {
    settings: UserSettings;
  };
}
