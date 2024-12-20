import { useEffect, useState } from "react";
import { formatRelativeDate } from "@/lib/utils";
import Link from "next/link";
import UserAvatar from "../UserAvatar";
import UserTooltip from "../UserTooltip";
import { useAuth } from "@/hooks/useAuth";
import CommentMoreButton from "./CommentMoreButton";

interface CommentData {
  id: string;
  content: string;
  text: string;
  author: {
    username: string;
    avatarurl?: string;
  };
  createdAt: Date;
}

interface CommentProps {
  comment: CommentData;
}

export default function Comment({ comment }: CommentProps) {
  const { user } = useAuth();
  const [loadedComment, setLoadedComment] = useState<CommentData | null>(null);

  useEffect(() => {
    // Ensure that the comment data is set once the `comment` prop is available
    if (comment?.author?.username) {
      setLoadedComment(comment); // Update state when the comment is received
    }
  }, [comment]); // Listen to changes in the `comment` prop

  if (!loadedComment) {
    return <div>Loading author...</div>; // Loading state until data is available
  }

  const formattedDate = new Date(loadedComment.createdAt).toLocaleDateString(
    "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    }
  );

  return (
    <div className="group/comment flex gap-3 py-3">
      <span className="hidden sm:inline">
        <UserTooltip username={loadedComment.author.username}>
          <Link href={`/users/${loadedComment.author.username}`}>
            <UserAvatar avatarurl={loadedComment.author.avatarurl} size={40} />
          </Link>
        </UserTooltip>
      </span>
      <div>
        <div className="flex items-center gap-1 text-sm">
          <UserTooltip username={loadedComment.author.username}>
            <Link
              href={`/users/${loadedComment.author.username}`}
              className="font-medium hover:underline"
            >
              {loadedComment.author.username}
            </Link>
          </UserTooltip>
          <span className="text-muted-foreground">
            {formatRelativeDate(new Date(loadedComment.createdAt))}
          </span>
        </div>
        <div>{loadedComment.content}</div>
      </div>
      {comment.author.username === user?.name && (
        <CommentMoreButton
          comment={comment}
          className="ms-auto opacity-0 transition-opacity group-hover/comment:opacity-100"
        />
      )}
    </div>
  );
}
