"use client";

import { use, useEffect, useState } from "react";
import InfiniteScrollContainer from "@/components/InfiniteScrollContainer";
import { getallPostsCurrentUser } from "@/components/posts/editor/action";
import Post from "@/components/posts/Post";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
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

export default function ForYouFeed() {
  const { user, loading } = useAuth();

  const [userId, setUserId] = useState<string | null>(null);

  // UseEffect to wait for `user` to load and update `userId`
  useEffect(() => {
    if (user?.id) {
      setUserId(user.id);
    }
  }, [user]);

  const query = useQuery<PostProps[]>({
    queryKey: ["post-feed", "for-you", userId],
    queryFn: async () => {
      if (!userId) {
        return [];
      }

      try {
        const response = await getallPostsCurrentUser(userId);
        if (!response.data) {
          throw Error(`Request failed`);
        }
        // reverse the order of the posts
        response.data.reverse();
        console.log("the response is", response.data[0].avatarurl);

        return response.data.map((post: any) => ({
          post_id: post.id,
          user_id: user?.id,
          content: post.content,
          likes: post.likes || 0,
          username: post.username || "Unknown",
          createdAt: new Date(post.createdAt),
          isLikedByUser: post.isLikedByUser,
          isBookmarkedByUser: post.isBookmarkedByUser,
          comments: post.comments || 0,
          avatarurl: post.avatarurl,
          photoUrls: post.photoUrls,
        }));
      } catch (error: any) {
        console.error("Error fetching posts:", error.message);
        return [];
      }
    },
    enabled: !!userId, // Ensure the query only runs when `userId` is available
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

  return (
    <div className="space-y-5">
      {query.data?.map((post, index) => (
        <Post key={index} post={post} />
      ))}
    </div>
  );
}
