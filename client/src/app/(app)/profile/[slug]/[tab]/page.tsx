//src/app/(app)/profile/[slug]/[tab]/page.tsx

"use client";

import React from "react";
import { useParams } from "next/navigation";
import {
  useGetFollowersQuery,
  useGetFollowingQuery,
} from "@/lib/features/user/userApiSlice";
import FollowsPage from "@/components/pages/profile/FollowsPage";
import { Skeleton } from "@/components/ui/skeleton";

export default function UserFollowsPage() {
  const params = useParams();
  // --- THIS IS THE FIX ---
  // The folder is named [slug], so we must use params.slug
  const username = params.slug as string;
  const tab = params.tab as "followers" | "following";

  // Fetch both lists. The hooks will only run if a username exists.
  const { data: followersData, isLoading: isFollowersLoading } =
    useGetFollowersQuery(username, { skip: !username });

  const { data: followingData, isLoading: isFollowingLoading } =
    useGetFollowingQuery(username, { skip: !username });

  // A simple guard to ensure the URL is valid (e.g., not /profile/user/friends)
  if (tab !== "followers" && tab !== "following") {
    return (
      <div className="container mx-auto max-w-md py-8 text-center">
        <p>Invalid page.</p>
      </div>
    );
  }

  // Show a loading skeleton while the initial data for the active tab is fetching
  if (
    (tab === "followers" && isFollowersLoading) ||
    (tab === "following" && isFollowingLoading)
  ) {
    return (
      <div className="container mx-auto max-w-md py-8">
        <Skeleton className="h-8 w-48 mb-4" />
        <Skeleton className="h-12 w-full mb-4" />
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-48" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-md py-8">
      <h1 className="text-2xl font-bold mb-4">@{username}</h1>
      <FollowsPage
        username={username}
        initialTab={tab}
        followersData={followersData}
        followingData={followingData}
        isFollowersLoading={isFollowersLoading}
        isFollowingLoading={isFollowingLoading}
      />
    </div>
  );
}
