
import Link from "next/link";
import UserAvatar from "../UserAvatar";
import { cn, formatRelativeDate } from "@/lib/utils";
import { use } from "react";
import { useAuth } from "@/hooks/useAuth";
import { PostMoreButton } from "./PostMoreButton";

interface PostProps {
  post: {
    post_id: string;
    user_id: string;
    content: string;
    likes: number;
    username: string;
    avatarurl: string;
    createdAt: Date;
  };
}

export default function Post({ post }: PostProps) {
  const { user } = useAuth();
  return (
    <article className="group/post space-y-3 rounded-2xl bg-card p-5 shadow-sm">
      <div className="flex justify-between  gap-3">
        <div className="flex  gap-3">
          <div className="flex flex-wrap gap-3">
            <Link href={"/users/${post.user.username}"}>
              <UserAvatar
                avatarurl=""
                // avatarurl= {post.user.avatarurl}
              />
            </Link>
          </div>
          <div>
            <Link
              href={`/users/${post.username}`}
              //   <Link href={`/users/${post.user.username}`}>
              className="block font-medium hover:underline"
            >
              {/* {post.user.displayName} */}
              {post.username}
            </Link>
            <Link
              // href={`/posts/${post.id}`}
              href={`/posts/1`}
              className="block text-sm text-muted-foreground hover:underline"
              suppressHydrationWarning
            >
              {/* {formatRelativeDate(post.createdAt)} */}
              {formatRelativeDate(post.createdAt)}
            </Link>
          </div>
        </div>
        {post.user_id === user?.id && (
          <PostMoreButton
            post={post}
            className="opacity-0 transition-opacity group-hover/post:opacity-100"
          />
        )}
      </div>
      <div className="whitespace-pre-line break-words">{post.content}</div>
    </article>
  );
}
