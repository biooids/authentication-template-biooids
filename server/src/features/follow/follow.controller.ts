// FILE: src/features/follow/follow.controller.ts

import { Request, Response } from "express";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import { followService } from "./follow.service.js";
import { createHttpError } from "../../utils/error.factory.js";

class FollowController {
  getFollowing = asyncHandler(async (req: Request, res: Response) => {
    const { username } = req.params;
    const result = await followService.getFollowing(username);
    if (!result) {
      throw createHttpError(404, "User not found.");
    }
    // Extract the nested user profiles
    const following = result.following.map((f) => f.following);
    res.status(200).json({ status: "success", data: { following } });
  });

  getFollowers = asyncHandler(async (req: Request, res: Response) => {
    const { username } = req.params;
    const result = await followService.getFollowers(username);
    if (!result) {
      throw createHttpError(404, "User not found.");
    }
    // Extract the nested user profiles
    const followers = result.followers.map((f) => f.follower);
    res.status(200).json({ status: "success", data: { followers } });
  });
}

export const followController = new FollowController();
