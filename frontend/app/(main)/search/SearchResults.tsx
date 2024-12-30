"use client";

import Post from "@/components/posts/Post";
import PostsLoadingSkeleton from "@/components/posts/PostsLoadingSkeleton";
import { fetchPosts } from "./action";
import { useAuth } from "@/hooks/useAuth";
import React, { useEffect, useState } from "react";

interface PostType {
  id: string;
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
}

interface SearchResultsProps {
  query: string;
}

export default function SearchResults({ query }: SearchResultsProps) {
  const [posts, setPosts] = useState<PostType[] | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchPosts({ query, userid: user?.id || "" })
      .then((response) => {
        const updatedPosts = response.data.map((post: any) => ({
          ...post,
          bookmarks: post.bookmarks || [], // Set default value for missing 'bookmarks'
          post_id: post.id, // Add 'post_id' if missing
        }));
        setPosts(updatedPosts);
      })
      .catch((error) => {
        console.error("Error fetching posts:", error);
      });
  }, [query]);

  if (!posts) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {posts.map((post, index) => (
        <Post key={index} post={post} />
      ))}
    </div>
  );
}
