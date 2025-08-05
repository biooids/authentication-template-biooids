import prisma from "../../db/prisma.js";
import { createHttpError } from "../../utils/error.factory.js";
import { userService } from "../user/user.service.js";

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
        followerId_followingId: {
          followerId: followerId,
          followingId: userToFollow.id,
        },
      },
    });

    if (existingFollow) {
      // The user is already followed, so we can just return successfully.
      return;
    }

    await prisma.follows.create({
      data: {
        followerId: followerId,
        followingId: userToFollow.id,
      },
    });
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
}

export const followService = new FollowService();
