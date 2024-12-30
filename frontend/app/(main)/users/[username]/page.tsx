"use client";

import TrendsSidebar from "@/components/TrendsSidebar";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axiosInstance";
import UserAvatar from "@/components/UserAvatar";
import { formatNumber } from "@/lib/utils";
import FollowButton from "@/components/FollowButton";
import UserPosts from "./UserPosts";
import EditProfileButton from "./EditProfileButton";
import Linkify from "@/components/Linkify";
import { CldUploadWidget } from "next-cloudinary";
import { Camera } from "lucide-react";
import { useContext, useState } from "react";
import { AuthContext } from "@/context/AuthContext";

interface PageProps {
  params: { username: string };
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
    bio: string;
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
  const authContext = useContext(AuthContext);
  const [avatarUrl, setAvatarUrl] = useState(userdata.avatarurl);
  const { user } = useAuth();

  const formattedDate = new Date(userdata.createdAt).toLocaleDateString(
    "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    }
  );
  const currentUser = user?.id === userdata.user_id;
  return (
    <div className="h-fit w-full space-y-5 rounded-2xl bg-card p-5 shadow-sm">
      {currentUser ? (
        <CldUploadWidget
          uploadPreset="avatars"
          options={{ cropping: true, folder: "avatars", multiple: false }}
          onSuccess={async (result) => {
            if (result?.info) {
              if (typeof result.info !== "string") {
                const newAvatarUrl = result.info.secure_url;
                setAvatarUrl(newAvatarUrl);

                alert("Avatar uploaded successfully!");
                if (user) {
                  user.avatarurl = newAvatarUrl;
                }
                try {
                  await axiosInstance.post(`/users/${user?.id}`, {
                    avatarurl: newAvatarUrl,
                  });
                } catch (error) {
                  console.error("Failed to update profile:", error);
                }
              }
            }
          }}
        >
          {({ open }) => (
            <div
              className="relative mx-auto w-60 h-60 rounded-full group cursor-pointer"
              onClick={() => open()}
            >
              <UserAvatar
                avatarurl={
                  avatarUrl || "https://via.placeholder.com/150?text=Avatar"
                }
                size={250}
                className="w-full h-full object-cover rounded-full border border-gray-300 shadow-md"
              />
              <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Camera className="text-white mr-2" size={24} />
                <span className="text-white font-medium text-sm">
                  Change Photo
                </span>
              </div>
            </div>
          )}
        </CldUploadWidget>
      ) : (
        <UserAvatar
          avatarurl={userdata.avatarurl}
          size={250}
          className="mx-auto size-full max-h-60 max-w-60 rounded-full"
        />
      )}

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
          <EditProfileButton user={userdata} />
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
      {userdata.bio && (
        <>
          <hr />
          <Linkify>
            <div className="overflow-hidden whitespace-pre-line break-words">
              {userdata.bio}
            </div>
          </Linkify>
        </>
      )}
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
