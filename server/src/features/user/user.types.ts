// FILE: src/features/user/user.types.ts

import { SystemRole } from "@/prisma-client";

// Represents a user object with sensitive data (like password) removed.
// Includes the new follower/following counts.
export type SanitizedUserDto = {
  id: string;
  name: string;
  username: string;
  email: string;
  emailVerified: boolean;
  bio: string | null;
  title: string | null;
  location: string | null;
  profileImage: string | null;
  bannerImage: string | null;
  joinedAt: Date;
  updatedAt: Date;
  systemRole: SystemRole;
  twitterUrl: string | null;
  githubUrl: string | null;
  websiteUrl: string | null;
  followersCount: number;
  followingCount: number;
};

// Represents the data needed for a public user profile page.
// It includes all the sanitized data plus a flag to show if the current user is following them.
export type UserProfile = SanitizedUserDto & {
  isFollowing: boolean;
};
