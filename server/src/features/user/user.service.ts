// FILE: server/src/features/user/user.service.ts (FULL & COMPLETE)

import bcrypt from "bcryptjs";
import { Prisma, User } from "@/prisma-client";
import prisma from "../../db/prisma.js";
import { SignUpInputDto } from "../auth/auth.types.js";
import { createHttpError } from "../../utils/error.factory.js";
import { logger } from "../../config/logger.js";
import { deleteFromCloudinary } from "../../config/cloudinary.js";
import { emailService } from "../email/email.service.js";
import { UserProfile } from "./user.types.js";

interface UserProfileUpdateData {
  name?: string;
  username?: string;
  email?: string;
  bio?: string;
  title?: string;
  location?: string;
  profileImage?: string;
  bannerImage?: string;
}

export class UserService {
  public async findUserByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { email } });
  }

  public async findUserByUsername(
    username: string,
    currentUserId?: string
  ): Promise<UserProfile | null> {
    // <-- Explicit return type
    const user = await prisma.user.findUnique({
      where: { username },
      include: {
        _count: {
          select: {
            followers: true,
            following: true,
          },
        },
        ...(currentUserId && {
          followers: {
            where: {
              followerId: currentUserId,
            },
          },
        }),
      },
    });

    if (!user) return null;

    const { _count, followers, hashedPassword, ...restOfUser } = user;

    const userProfile: UserProfile = {
      ...restOfUser,
      followersCount: _count.followers,
      followingCount: _count.following,
      isFollowing: !!(currentUserId && followers.length > 0),
    };

    return userProfile;
  }
  public async findUserById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      // Add this 'include' block to fetch the counts
      include: {
        _count: {
          select: {
            followers: true,
            following: true,
          },
        },
      },
    });
  }
  public async createUser(input: SignUpInputDto): Promise<User> {
    const { email, username, password, name } = input;

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      const user = await prisma.user.create({
        data: {
          email,
          username,
          hashedPassword: hashedPassword,
          name: name,
        },
      });
      logger.info(
        { userId: user.id, email: user.email },
        "New user created successfully."
      );
      return user;
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === "P2002"
      ) {
        const field = (e.meta?.target as string[])?.[0] || "details";
        logger.warn(
          { field, email, username },
          "Prisma unique constraint violation during user creation."
        );
        throw createHttpError(
          409,
          `An account with this ${field} already exists.`
        );
      }
      logger.error({ err: e }, "Unexpected error during user creation");
      throw createHttpError(500, "Could not create user account.");
    }
  }

  public async deleteUserAccount(userId: string): Promise<void> {
    logger.info({ userId }, "Initiating account deletion process.");

    const user = await this.findUserById(userId);
    if (!user) {
      logger.warn({ userId }, "Account deletion skipped: User not found.");
      return;
    }

    // --- MODIFICATION START ---
    // Store user details before they are deleted from the database.
    const userEmail = user.email;
    const userName = user.name;

    const deletionPromises: Promise<any>[] = [];

    if (user.profileImage) {
      const publicId = `user_assets/profile_${userId}`;
      deletionPromises.push(deleteFromCloudinary(publicId));
    }
    if (user.bannerImage) {
      const publicId = `user_assets/banner_${userId}`;
      deletionPromises.push(deleteFromCloudinary(publicId));
    }

    if (deletionPromises.length > 0) {
      await Promise.allSettled(deletionPromises);
    }

    try {
      await prisma.user.delete({ where: { id: userId } });
      logger.info({ userId }, "User record deleted successfully.");

      await emailService.sendAccountDeletionConfirmationEmail(
        userEmail,
        userName
      );
    } catch (error) {
      logger.error(
        { err: error, userId },
        "Error deleting user record from database"
      );
      throw createHttpError(500, "Could not delete user account at this time.");
    }
  }

  public async updateUserProfile(
    userId: string,
    data: UserProfileUpdateData
  ): Promise<User> {
    const existingUser = await this.findUserById(userId);
    if (!existingUser) {
      throw createHttpError(404, "User profile not found.");
    }

    const updatePayload: Prisma.UserUpdateInput = { ...data };

    // If the user is trying to change their email...
    if (data.email && data.email !== existingUser.email) {
      // Mark the new email as unverified
      updatePayload.emailVerified = false;
    }

    try {
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: updatePayload,
      });

      // FEATURE: If email was changed, send notifications
      if (data.email && data.email !== existingUser.email) {
        // 1. Send a notification to the OLD email address
        await emailService.sendEmailChangeNotificationEmail(
          existingUser.email,
          updatedUser.email,
          updatedUser.name
        );
        // 2. Send a new verification email to the NEW address
        await emailService.sendWelcomeVerificationEmail(updatedUser);
      }

      logger.info({ userId }, "User profile updated successfully.");
      return updatedUser;
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === "P2002"
      ) {
        const field = (e.meta?.target as string[])?.[0] || "field";
        logger.warn(
          { userId, field, value: (data as any)[field] },
          "Unique constraint violation during profile update."
        );
        throw createHttpError(409, `This ${field} is already taken.`);
      }
      logger.error({ err: e, userId }, "Error updating user profile");
      throw createHttpError(500, "Could not update user profile.");
    }
  }
}

export const userService = new UserService();
