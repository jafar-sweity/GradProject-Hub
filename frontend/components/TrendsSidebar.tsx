import { useState, useEffect, Suspense } from "react";
import { useAuth } from "@/hooks/useAuth";
import axiosInstance from "@/lib/axiosInstance";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import UserAvatar from "./UserAvatar";
import { Button } from "./ui/button";
import { formatNumber } from "@/lib/utils";
import { getallPosts, getWhoToFollow } from "@/components/posts/editor/action";
import FollowButton from "./FollowButton"; // Import your FollowButton component

interface User {
  id: string;
  username: string;
  avatarurl: string;
}

export default function TrendsSidebar() {
  return (
    <div className="sticky top-[5.25rem] hidden md:block lg:w-80 w72 h-fit flex-none space-y-5">
      <Suspense fallback={<Loader2 className="mx-auto animate-spin" />}>
        <WhoToFollow />
        <TrendingTopics />
      </Suspense>
    </div>
  );
}

function WhoToFollow() {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchWhoToFollow = async () => {
      if (!user?.id) return;

      try {
        const users = await getWhoToFollow(user.id);
        setUsers(users);
      } catch (error) {
        console.error("Failed to fetch 'Who to Follow':", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWhoToFollow();
  }, [user?.id]);

  if (loading) {
    return <p></p>;
  }

  return (
    <div className="space-y-5 rounded-2xl bg-card p-5 shadow-sm">
      <div className="text-xl font-bold">Who to follow</div>
      {users.length > 0 ? (
        users.map((toFollow: User) => (
          <div
            key={toFollow.id}
            className="flex items-center justify-between gap-3"
          >
            <Link
              href={`/users/${toFollow.username}`}
              className="flex items-center gap-3"
            >
              <UserAvatar
                avatarurl={toFollow.avatarurl}
                className="flex-none"
              />
              <div>
                <p className="line-clamp-1 break-all font-semibold hover:underline">
                  {toFollow.username}
                </p>
                <p className="line-clamp-1 break-all text-muted-foreground">
                  @{toFollow.id}
                </p>
              </div>
            </Link>

            {/* Integrate FollowButton here */}
            <FollowButton
              userId={toFollow.id}
              initialState={{ isFollowedByUser: false, followers: 0 }}
            />
          </div>
        ))
      ) : (
        <p>No users to follow right now.</p>
      )}
    </div>
  );
}

function TrendingTopics() {
  const [trendingTopics, setTrendingTopics] = useState<
    { hashtag: string; count: number }[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchTrendingTopics = async () => {
      try {
        const topics = await getTrendingTopics();
        setTrendingTopics(topics);
      } catch (error) {
        console.error("Failed to fetch trending topics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingTopics();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center">
        <span className="loading loading-ring loading-xs"></span>
        <span className="loading loading-ring loading-sm"></span>
        <span className="loading loading-ring loading-md"></span>
        <span className="loading loading-ring loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="space-y-5 rounded-2xl bg-card p-5 shadow-sm">
      <div className="text-xl font-bold">Trending topics</div>
      {trendingTopics.map(({ hashtag, count }) => {
        const title = hashtag.split("#")[1];

        return (
          <Link key={title} href={`/hashtag/${title}`} className="block">
            <p
              className="line-clamp-1 break-all font-semibold hover:underline"
              title={hashtag}
            >
              {hashtag}
            </p>
            <p className="text-sm text-muted-foreground">
              {formatNumber(count)} {count === 1 ? "post" : "posts"}
            </p>
          </Link>
        );
      })}
    </div>
  );
}

const getTrendingTopics = async () => {
  const posts = await getallPosts();

  try {
    const response = await axiosInstance.get("community/posts");

    const hashtagCounts: Record<string, number> = {};

    posts.data.forEach((post: { content: string }) => {
      const hashtags = post.content.match(/#[\w_]+/g) || []; // Extract hashtags
      hashtags.forEach((hashtag) => {
        const normalizedHashtag = hashtag.toLowerCase(); // Normalize to lowercase
        hashtagCounts[normalizedHashtag] =
          (hashtagCounts[normalizedHashtag] || 0) + 1;
      });
    });

    const trendingTopics = Object.entries(hashtagCounts)
      .map(([hashtag, count]) => ({ hashtag, count }))
      .sort((a, b) =>
        b.count !== a.count
          ? b.count - a.count
          : a.hashtag.localeCompare(b.hashtag)
      )
      .slice(0, 5); // Take the top 5 hashtags

    return trendingTopics;
  } catch (error) {
    console.error("Error fetching trending topics:", error);
    return [];
  }
};
