"use client";
import { useState, useEffect } from "react";
import InfiniteScrollContainer from "@/components/InfiniteScrollContainer";
import Post from "@/components/posts/Post";
import PostsLoadingSkeleton from "@/components/posts/PostsLoadingSkeleton";
import { useToast } from "@/hooks/use-toast";
import axiosInstance from "@/lib/axiosInstance";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface Post {
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
}

interface PostsPage {
  posts: Post[];
  nextCursor: string | null;
}

export default function Bookmarks() {
  const { toast } = useToast();
  const { user } = useAuth();

  const [posts, setPosts] = useState<Post[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingNext, setLoadingNext] = useState(false);

  // Function to fetch bookmarked posts
  const fetchBookmarkedPosts = async (cursor: string | null = null) => {
    try {
      if (!user?.id) {
        toast({
          variant: "destructive",
          description: "User not authenticated.",
        });
        return;
      }

      const response = await axiosInstance.get<PostsPage>(
        `community/posts/${user.id}/bookmarked`, // Pass user.id here
        {
          params: { cursor },
        }
      );
      const { posts: newPosts, nextCursor: newNextCursor } = response.data;

      // Avoid duplicating posts by checking against the current state
      const newPostsWithoutDuplicates = newPosts.filter(
        (newPost) => !posts.some((post) => post.id === newPost.id)
      );

      if (cursor === null) {
        // If it's the initial fetch, reset the posts
        setPosts(newPostsWithoutDuplicates);
      } else {
        // If it's subsequent fetch, append the posts
        setPosts((prev) => [...prev, ...newPostsWithoutDuplicates]);
      }

      setNextCursor(newNextCursor); // Update the next cursor
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        description: "An error occurred while loading bookmarks.",
      });
    } finally {
      setLoading(false);
      setLoadingNext(false);
    }
  };

  // Fetch initial bookmarked posts
  useEffect(() => {
    fetchBookmarkedPosts();
  }, [user?.id]);

  // Handler for infinite scroll
  const handleScroll = () => {
    if (nextCursor && !loadingNext) {
      setLoadingNext(true);
      fetchBookmarkedPosts(nextCursor);
    }
  };

  if (loading) {
    return <PostsLoadingSkeleton />;
  }

  if (!posts.length && !nextCursor) {
    return (
      <p className="text-center text-muted-foreground">
        You don&apos;t have any bookmarks yet.
      </p>
    );
  }

  return (
    <InfiniteScrollContainer
      className="space-y-5"
      onBottomReached={handleScroll}
    >
      {posts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
      {loadingNext && <Loader2 className="mx-auto my-3 animate-spin" />}
    </InfiniteScrollContainer>
  );
}
