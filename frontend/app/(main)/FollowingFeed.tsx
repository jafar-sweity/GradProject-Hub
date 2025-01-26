"use client";

import { use, useEffect, useState } from "react";
import InfiniteScrollContainer from "@/components/InfiniteScrollContainer";
import {
  getallFollowingPosts,
  getallPostsCurrentUser,
} from "@/components/posts/editor/action";
import Post from "@/components/posts/Post";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import PostLoadingSkeleton from "@/components/posts/PostsLoadingSkeleton";

interface PostProps {
  id: any;
  bookmarks: any;
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
  photoUrls?: string[];
}

export default function FollowingFeed() {
  const { user, loading } = useAuth();
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    if (user?.id) {
      setUserId(user.id);
    }
  }, [user]);

  const query = useQuery<PostProps[]>({
    queryKey: ["post-feed", "following", userId],
    queryFn: async () => {
      if (!userId) {
        return [];
      }

      try {
        const response = await getallFollowingPosts(userId);

        if (!response) {
          return [];
        }

        return response;
      } catch (error: any) {
        console.error("Error fetching posts:", error);
        return [];
      }
    },
    enabled: !!userId,
  });

  if (loading || query.isLoading) {
    return <PostLoadingSkeleton />;
  }

  if (query.isError) {
    return (
      <p className="text-center text-destructive">
        An error occurred while fetching posts
      </p>
    );
  }

  if (query.data?.length === 0) {
    return <p className="text-center">No posts available</p>;
  }
  // check the firrs post
  return (
    <div className="space-y-5">
      {query.data?.map((post, index) => (
        <Post key={index} post={post} />
      ))}
    </div>
  );
}
