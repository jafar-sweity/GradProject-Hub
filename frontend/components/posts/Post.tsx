import Link from "next/link";
import UserAvatar from "../UserAvatar";
import { cn, formatRelativeDate } from "@/lib/utils";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { PostMoreButton } from "./PostMoreButton";
import Linkify from "../Linkify";
import UserTooltip from "../UserTooltip";
import LikeButton from "./LikeButton";
import { fa, tr } from "@faker-js/faker";
import { MessageSquare } from "lucide-react";
import BookmarkButton from "./BookmarkButton";
import Comments from "../comments/Comments";

interface PostProps {
  post: {
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
  };
}

export default function Post({ post }: PostProps) {
  const { user } = useAuth();
  const createdAtDate = new Date(post.createdAt);

  const [showComments, setShowComments] = useState(false);

  return (
    <article className="group/post space-y-3 rounded-2xl bg-card p-5 shadow-sm">
      <div className="flex justify-between  gap-3">
        <div className="flex  gap-3">
          <div className="flex flex-wrap gap-3">
            <UserTooltip username={post.username}>
              <Link href={`/users/${post.username}`}>
                <UserAvatar
                  avatarurl={post.avatarurl}
                  // avatarurl= {post.user.avatarurl}
                />
              </Link>
            </UserTooltip>
          </div>
          <div>
            <Link
              href={`/users/${post.username}`}
              className="block font-medium hover:underline"
            >
              {/* {post.user.displayName} */}
              {post.username}
            </Link>
            <Link
              // href={`/posts/${post.id}`}
              href={`/posts/${post.post_id}`}
              className="block text-sm text-muted-foreground hover:underline"
              suppressHydrationWarning
            >
              {/* {formatRelativeDate(post.createdAt)} */}
              {formatRelativeDate(createdAtDate)}
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
      <Linkify>
        <div className="whitespace-pre-line break-words">{post.content}</div>
      </Linkify>
      <hr className="text-muted-foreground" />
      <div className="flex justify-between gap-5">
        <div className="flex items-center gap-5">
          <LikeButton
            postId={post.post_id}
            initialState={{
              likes: post.likes,
              isLikedByUser: post.isLikedByUser,
            }}
          />
          {/*  want to print it in screen  showComments :  */}

          <CommentButton
            post={post}
            onClick={() => {
              setShowComments(!showComments);
            }}
          />
        </div>
        <BookmarkButton
          postId={post.post_id}
          initialState={{
            isBookmarkedByUser: post.isBookmarkedByUser,
          }}
        />
      </div>
      {showComments && <Comments post={post} />}
    </article>
  );
}
interface commentProps {
  post: {
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
  };
  onClick: () => void;
}

function CommentButton({ post, onClick }: commentProps) {
  return (
    <button onClick={onClick} className="flex items-center gap-2">
      <MessageSquare className="size-5" />
      <span className="text-sm font-medium tabular-nums">
        {post.comments} <span className="hidden sm:inline">comments</span>
      </span>
    </button>
  );
}
