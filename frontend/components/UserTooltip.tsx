"use client";

import { FollowerInfo } from "@/lib/types";
import Link from "next/link";
import { PropsWithChildren } from "react";
import FollowButton from "./FollowButton";
import Linkify from "./Linkify";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import UserAvatar from "./UserAvatar";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axiosInstance";
import FollowerCount from "./FollowerCount";

interface UserTooltipProps extends PropsWithChildren {
  username: string;
}

const fetchUser = async (username: string, currentUserId: string) => {
  const response = await axiosInstance.get(`/community/users/${username}`, {
    params: { currentUserId },
  });
  return response.data;
};

export default function UserTooltip({ children, username }: UserTooltipProps) {
  const { user: loggedInUser } = useAuth();

  const {
    data: userProfile,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["tooltipUser", username],
    queryFn: () => fetchUser(username, loggedInUser?.id || ""),
    enabled: !!username && !!loggedInUser?.id,
  });

  if (isLoading || !userProfile) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return <p>Error loading user info.</p>;
  }

  const followerState: FollowerInfo = {
    followers: userProfile.followersCount,
    isFollowedByUser: userProfile.isFollowedByUser,
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent>
          <div className="flex max-w-80 flex-col gap-3 break-words px-1 py-2.5 md:min-w-52">
            <div className="flex items-center justify-between gap-2">
              <Link href={`/users/${userProfile.username}`}>
                <UserAvatar size={70} avatarurl={userProfile.avatarurl} />
              </Link>
              {loggedInUser && loggedInUser.id !== userProfile.user_id && (
                <FollowButton
                  userId={userProfile.user_id}
                  initialState={followerState}
                />
              )}
            </div>
            <div>
              <Link href={`/users/${userProfile.username}`}>
                <div className="text-lg font-semibold hover:underline">
                  {userProfile.username}
                </div>
                <div className="text-muted-foreground">
                  @{userProfile.username}
                </div>
              </Link>
            </div>
            {userProfile.bio && (
              <Linkify>
                <div className="line-clamp-4 whitespace-pre-line">
                  {userProfile.bio}
                </div>
              </Linkify>
            )}
            <FollowerCount
              userId={userProfile.user_id}
              initialState={followerState}
            />
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
