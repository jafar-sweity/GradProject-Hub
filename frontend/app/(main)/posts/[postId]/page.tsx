"use client";

import Post from "@/components/posts/Post";
import Linkify from "@/components/Linkify";

import { getPostById } from "./action";

interface pageProps {
  params: { postId: string };
}

interface post {
  post_id: string;
  user_id: string;
  content: string;
  likes: number;
  username: string;
  avatarurl: string;
  createdAt: Date;
  isLikedByUser: boolean;
  isBookmarkedByUser: boolean;
  comments: number;
}
import { Suspense, useEffect, useState } from "react";
import UserTooltip from "@/components/UserTooltip";
import Link from "next/link";
import UserAvatar from "@/components/UserAvatar";

export default function Page({ params: { postId } }: pageProps) {
  const [post, setPost] = useState<any>(null);

  useEffect(() => {
    getPostById(postId).then(setPost);
  }, [postId]);

  if (!post) return <div>Loading...</div>;

  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        <Post post={post} />
      </div>
      <div className="sticky top-[5.25rem] hidden lg:block h-fit w-80 flex-none">
        <Suspense fallback={<div>Loading...</div>}>
          <UserInfoSideBar user={post} />
        </Suspense>
      </div>
    </main>
  );
}
type UserData = {
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
interface userFileData {
  user: UserData;
}

async function UserInfoSideBar({ user }: userFileData) {
  return (
    <div className="space-y-5 rounded-2xl bg-card p-5 shadow-sm">
      <div className="text-xl font-bold "> About this user </div>

      <UserTooltip username={user.username}>
        <Link
          href={`/users/${user.username}`}
          className="flex item-center gap-3"
        >
          <UserAvatar avatarurl={user.avatarurl} className="flex-none" />
          <div>
            <p className="line-clamp-1 break-all font-semibold hover:underline">
              {user.username}
            </p>
            <p className="line-clamp-1 break-all text-muted-foreground">
              @{user.username}
            </p>
          </div>
        </Link>
      </UserTooltip>
      <Linkify>
        <div className="line-clamp-6 whitespace-pre-line break-words text-muted-foreground">
          {user.bio}
        </div>
      </Linkify>
    </div>
  );
}
