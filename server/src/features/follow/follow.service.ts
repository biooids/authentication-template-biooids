//src/features/follow/follow.service.ts
import prisma from "../../db/prisma.js";
import { createHttpError } from "../../utils/error.factory.js";
import { userService } from "../user/user.service.js";
import { notificationService } from "../notifications/notifications.service.js";

class FollowService {
  /**
   * Creates a follow relationship between two users.
   * @param followerId - The ID of the user initiating the follow.
   * @param usernameToFollow - The username of the user to be followed.
   */
  public async followUser(followerId: string, usernameToFollow: string) {
    const userToFollow = await userService.findUserByUsername(usernameToFollow);
    if (!userToFollow) {
      throw createHttpError(404, "User to follow not found.");
    }
    if (followerId === userToFollow.id) {
      throw createHttpError(400, "You cannot follow yourself.");
    }

    const existingFollow = await prisma.follows.findUnique({
      where: {
        followerId_followingId: { followerId, followingId: userToFollow.id },
      },
    });

    if (existingFollow) {
      return;
    }

    await prisma.follows.create({
      data: { followerId, followingId: userToFollow.id },
    });

    const follower = await userService.findUserById(followerId);
    if (follower) {
      // This call correctly triggers the notification creation and the real-time event
      await notificationService.createNotification(
        userToFollow.id,
        `@${follower.username} started following you.`,
        `/profile/${follower.username}`
      );
    }
  }
  /**
   * Deletes a follow relationship between two users.
   * @param followerId - The ID of the user initiating the unfollow.
   * @param usernameToUnfollow - The username of the user to be unfollowed.
   */
  public async unfollowUser(followerId: string, usernameToUnfollow: string) {
    const userToUnfollow = await userService.findUserByUsername(
      usernameToUnfollow
    );
    if (!userToUnfollow) {
      throw createHttpError(404, "User to unfollow not found.");
    }

    await prisma.follows
      .delete({
        where: {
          followerId_followingId: {
            followerId: followerId,
            followingId: userToUnfollow.id,
          },
        },
      })
      .catch(() => {
        // If the record doesn't exist, prisma throws an error.
        // We can catch it and treat it as a success, as the end state is the same.
        return;
      });
  }

  /**
   * Gets the list of users that a specific user is following.
   * @param username - The username of the user whose following list we want.
   */
  public async getFollowing(username: string) {
    return prisma.user.findUnique({
      where: { username },
      select: {
        following: {
          select: {
            following: {
              // This gets the profile of the user being followed
              select: {
                id: true,
                name: true,
                username: true,
                profileImage: true,
                bio: true,
              },
            },
          },
        },
      },
    });
  }

  /**
   * Gets the list of users who are following a specific user.
   * @param username - The username of the user whose followers we want.
   */
  public async getFollowers(username: string) {
    return prisma.user.findUnique({
      where: { username },
      select: {
        followers: {
          select: {
            follower: {
              // This gets the profile of the user who is following
              select: {
                id: true,
                name: true,
                username: true,
                profileImage: true,
                bio: true,
              },
            },
          },
        },
      },
    });
  }
}

export const followService = new FollowService();
