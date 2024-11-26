//this how i implemented the post in mongodb
// interface IPost extends Document {
//   user_id: mongoose.Types.ObjectId; // Reference to User
//   content: string;
//   likes: number;
//   comments: IComment[]; // Changed to use a defined interface
//   createdAt: Date;
//   updatedAt: Date;
// }

import Link from "next/link";
import UserAvatar from "../UserAvatar";
import { cn, formatRelativeDate } from "@/lib/utils";
import { use } from "react";
import { useAuth } from "@/hooks/useAuth";

interface PostProps {
  post: {
    username: string;
    content: string;
    avatarurl: string;
    createdAt: Date;
  };
}

export default function Post({ post }: PostProps) {
  const { user } = useAuth();
  return (
    <article className="group/post space-y-3 rounded-2xl bg-card p-5 shadow-sm">
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
            {user?.name}
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
      <div className="whitespace-pre-line break-words">{post.content}</div>
    </article>
  );
}
