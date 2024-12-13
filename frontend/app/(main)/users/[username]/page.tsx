"use client";

import TrendsSidebar from "@/components/TrendsSidebar";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axiosInstance";
import UserAvatar from "@/components/UserAvatar";
import { formatNumber } from "@/lib/utils";
import { formatDate } from "date-fns";
import { Button } from "@/components/ui/button";
import FollowButton from "@/components/FollowButton";
import { User } from "lucide-react";
import UserPosts from "./UserPosts";

interface PageProps {
  params: { username: string };
}

interface FollowerInfo {
  followers: number;
  isFollowedByUser: boolean;
}

interface UserProfileProps {
  userdata: {
    id: string;
    user_id: string;
    username: string;
    avatarurl: string;
    followersCount: number;
    followingCount: number;
    postsCount: number;
    createdAt: Date;
    isFollowedByUser: boolean; // Add this here
  };
  loggedInUserId: string;
}
const fetchUser = async (username: string, currentUserId: string) => {
  const response = await axiosInstance.get(`/community/users/${username}`, {
    params: { currentUserId },
  });
  return response.data;
};

function UserProfile({ userdata, loggedInUserId }: UserProfileProps) {
  const formattedDate = new Date(userdata.createdAt).toLocaleDateString(
    "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    }
  );

  return (
    <div className="h-fit w-full space-y-5 rounded-2xl bg-card p-5 shadow-sm">
      <UserAvatar
        avatarurl={userdata.avatarurl}
        size={250}
        className="mx-auto size-full max-h-60 max-w-60 rounded-full"
      />
      <div className="flex flex-wrap gap-3 sm:flex-nowrap">
        <div className="me-auto space-y-3">
          <div>
            <h1 className="text-3xl font-bold">{userdata.username}</h1>
            <div className="text-muted-foreground">@{userdata.username}</div>
          </div>
          <div>Member since {formattedDate}</div>
          <div className="flex gap-4">
            <div>
              <strong>{formatNumber(userdata.followersCount)}</strong> Followers
            </div>
            <div>
              <strong>{formatNumber(userdata.followingCount)}</strong> Following
            </div>
            <div>
              <strong>{formatNumber(userdata.postsCount)}</strong> Posts
            </div>
          </div>
        </div>
        {userdata.user_id === loggedInUserId ? (
          <Button>Edit profile </Button>
        ) : (
          <FollowButton
            userId={userdata.user_id}
            initialState={{
              followers: userdata.followersCount,
              isFollowedByUser: userdata.isFollowedByUser,
            }}
          />
        )}
      </div>
    </div>
  );
}

export default function Page({ params: { username } }: PageProps) {
  const { user } = useAuth();

  const {
    data: userProfile,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["user", username],
    queryFn: () => fetchUser(username, user?.id || ""),
    enabled: !!username && !!user?.id,
  });

  if (isLoading || !user) {
    return <p>Loading profile...</p>;
  }

  if (isError || !userProfile) {
    return (
      <p className="text-destructive">
        Error loading user profile or user not found.
      </p>
    );
  }
  console.log("userProfile", userProfile);

  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        <UserProfile userdata={userProfile} loggedInUserId={user?.id ?? ""} />
        <div className="rounded-2xl bg-card p-5 shadow-sm">
          <h2 className="text-center text-2xl font-bold">
            {userProfile.username}&apos;s posts
          </h2>
        </div>
        <UserPosts user={userProfile} />
      </div>
      <TrendsSidebar />
    </main>
  );
}
