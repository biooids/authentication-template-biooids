// FILE: src/features/settings/settings.service.ts

import prisma from "../../db/prisma.js";
import { UserSettings } from "@/prisma-client";
import { UpdateUserSettingsDto } from "./settings.types.js";
import { logger } from "../../config/logger.js";

class SettingsService {
  /**
   * Retrieves the settings for a given user.
   * If settings don't exist, it creates a default record for them.
   * @param userId - The ID of the user.
   * @returns The user's settings object.
   */
  public async getUserSettings(userId: string): Promise<UserSettings> {
    let settings = await prisma.userSettings.findUnique({
      where: { userId },
    });

    // If the user has no settings record yet, create one with default values.
    if (!settings) {
      logger.info(
        { userId },
        "No settings found for user, creating default settings."
      );
      settings = await prisma.userSettings.create({
        data: {
          userId: userId,
        },
      });
    }

    return settings;
  }

  /**
   * Updates the settings for a given user.
   * @param userId - The ID of the user.
   * @param data - The settings data to update.
   * @returns The updated user settings object.
   */
  public async updateUserSettings(
    userId: string,
    data: UpdateUserSettingsDto
  ): Promise<UserSettings> {
    // We use `upsert` here as a robust way to handle the update.
    // It will update the settings if they exist, or create them if they don't.
    const updatedSettings = await prisma.userSettings.upsert({
      where: { userId },
      update: data,
      create: {
        userId: userId,
        ...data,
      },
    });

    logger.info({ userId, ...data }, "User settings updated successfully.");
    return updatedSettings;
  }
}

export const settingsService = new SettingsService();
