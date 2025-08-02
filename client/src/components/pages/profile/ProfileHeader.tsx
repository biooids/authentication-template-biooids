"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import {
  Twitter,
  Github,
  Link as LinkIcon,
  MapPin,
  Calendar,
  Edit,
  ImageIcon,
} from "lucide-react";
import { SanitizedUserDto } from "@/lib/features/user/userTypes";

// --- Helper Components ---

/**
 * Safely gets initials from a name string.
 * @param name - The user's full name.
 * @returns A 1 or 2-letter initial string, or "?" if the name is invalid.
 */
const getInitials = (name: string | null | undefined): string => {
  if (!name || typeof name !== "string") return "?";
  const words = name.split(" ").filter(Boolean);
  if (words.length === 0) return "?";
  return (
    (words[0]?.charAt(0) ?? "") +
    (words.length > 1 ? words[words.length - 1]?.charAt(0) ?? "" : "")
  ).toUpperCase();
};

/**
 * Safely formats a date string, preventing crashes.
 * @param dateString - The date string from the API.
 * @returns A formatted date string, or a fallback message if formatting fails.
 */
const FormattedJoinDate = ({ dateString }: { dateString?: string | null }) => {
  if (!dateString || typeof dateString !== "string") {
    return null;
  }
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return <>Invalid date</>;
    }
    return <>{format(date, "MMMM d, yyyy")}</>;
  } catch (error) {
    console.error("Error formatting date:", dateString, error);
    return <>Invalid date</>;
  }
};

// --- Main Component ---

interface ProfileHeaderProps {
  user: SanitizedUserDto | null;
  onEdit: () => void;
}

export default function ProfileHeader({ user, onEdit }: ProfileHeaderProps) {
  // If the user object is not available, don't render anything.
  if (!user) {
    return null;
  }

  return (
    <Card className="overflow-hidden border shadow-sm">
      {/* Banner Section */}
      <div className="relative aspect-[16/5] w-full bg-muted">
        {user.bannerImage ? (
          <Image
            src={user.bannerImage}
            alt={user.name ? `${user.name}'s banner` : "User banner"}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <ImageIcon className="h-16 w-16 text-muted-foreground/30" />
          </div>
        )}
      </div>

      <CardContent className="p-6 pt-0">
        {/* Avatar and Actions Section */}
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row">
          <Avatar className="-mt-16 h-32 w-32 shrink-0 border-4 border-background ring-2 ring-primary">
            {user.profileImage && (
              <AvatarImage src={user.profileImage} alt={user.name ?? "User"} />
            )}
            <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
          </Avatar>
          <div className="mt-4 flex w-full items-center justify-end gap-2 sm:w-auto">
            <Button onClick={onEdit}>
              <Edit className="mr-2 h-4 w-4" /> Edit Profile
            </Button>
          </div>
        </div>

        {/* User Details Section */}
        <div className="mt-4">
          <h1 className="text-3xl font-bold tracking-tighter">{user.name}</h1>
          <p className="text-muted-foreground">@{user.username}</p>

          {user.title && (
            <p className="mt-2 text-foreground/80">{user.title}</p>
          )}

          {user.bio && <p className="mt-4 max-w-2xl">{user.bio}</p>}

          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
            {user.location && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" /> {user.location}
              </div>
            )}
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" /> Joined{" "}
              <FormattedJoinDate dateString={user.joinedAt} />
            </div>
          </div>
        </div>

        {/* Social Links Section */}
        <div className="mt-6 flex items-center gap-2">
          {user.githubUrl && (
            <Button variant="outline" size="icon" asChild>
              <Link
                href={user.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="h-4 w-4" />
              </Link>
            </Button>
          )}
          {user.twitterUrl && (
            <Button variant="outline" size="icon" asChild>
              <Link
                href={user.twitterUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Twitter className="h-4 w-4" />
              </Link>
            </Button>
          )}
          {user.websiteUrl && (
            <Button variant="outline" size="icon" asChild>
              <Link
                href={user.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <LinkIcon className="h-4 w-4" />
              </Link>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
