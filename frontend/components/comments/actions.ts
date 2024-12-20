"use client";

import { useAuth } from "@/hooks/useAuth";
import axiosInstance from "@/lib/axiosInstance";
import { createCommentSchema } from "@/lib/validation";
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
}

export async function submitCommentAPI(
  {
    post,
    content,
  }: {
    post: PostProps;
    content: string;
  },
  current_user_id: string
) {
  const { content: contentValidated } = createCommentSchema.parse({ content });

  const response = await axiosInstance.post(
    `community/comments/post/${post.post_id}`,
    {
      content: contentValidated,
      user_id: current_user_id,
    }
  );

  const newComment = response.data;
  return newComment;
}

export async function deleteCommentAPI(id: string) {
  const { user } = useAuth();

  if (!user) throw new Error("Unauthorized");

  //   const comment = await prisma.comment.findUnique({
  //     where: { id },
  //   });
  const comment = {
    id: "commentId",
    userId: "userId",
  };

  if (!comment) throw new Error("Comment not found");

  if (comment.userId !== user.id) throw new Error("Unauthorized");

  //   const deletedComment = await prisma.comment.delete({
  //     where: { id },
  //     include: getCommentDataInclude(user.id),
  //   });

  const deletedComment = "deleted comment";
  return deletedComment;
}
