import { useToast } from "@/hooks/use-toast";
import {
  InfiniteData,
  QueryKey,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { deleteCommentAPI, submitCommentAPI } from "./actions";
import { useAuth } from "@/hooks/useAuth";
export interface Comment {
  id: string;
  content: string;
  userId: string;
  postId: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CommentsPage {
  previousCursor: string | null;
  comments: Comment[];
}
interface PostProps {
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

export function useSubmitCommentMutation(postId: string) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const mutation = useMutation({
    mutationFn: async (newComment: { post: PostProps; content: string }) => {
      if (!user?.id) {
        throw new Error("User not authenticated");
      }
      return await submitCommentAPI(newComment, user.id);
    },
    onSuccess: async (newComment: Comment) => {
      const queryKey: QueryKey = ["comments", postId];

      // Cancel any ongoing queries for this key
      await queryClient.cancelQueries({ queryKey });

      // Update cached comments data optimistically
      queryClient.setQueryData<InfiniteData<CommentsPage>>(
        queryKey,
        (oldData) => {
          if (!oldData) return;

          const firstPage = oldData.pages[0];

          if (firstPage) {
            return {
              ...oldData,
              pages: [
                {
                  ...firstPage,
                  comments: [...firstPage.comments, newComment],
                },
                ...oldData.pages.slice(1),
              ],
            };
          }

          return oldData;
        }
      );

      // Invalidate queries if needed to ensure data consistency
      queryClient.invalidateQueries({
        queryKey,
        predicate: (query) => !query.state.data,
      });

      // Display a success toast
      toast({ description: "Comment created successfully!" });
    },
    onError: (error) => {
      console.error("Error submitting comment:", error);
      toast({
        variant: "destructive",
        description: "Failed to submit comment. Please try again.",
      });
    },
  });

  return mutation;
}

export function useDeleteCommentMutation() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (commentId: string) => {
      await deleteCommentAPI(commentId);
      return commentId; // Return the ID of the deleted comment
    },
    onSuccess: (deletedCommentId: string) => {
      queryClient.setQueryData<InfiniteData<CommentsPage>>(
        ["comments"],
        (oldData) => {
          if (!oldData) return;

          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              comments: page.comments.filter(
                (comment) => comment.id !== deletedCommentId
              ),
            })),
          };
        }
      );

      toast({ description: "Comment deleted successfully!" });
    },
    onError: (error) => {
      console.error(error);
      toast({
        variant: "destructive",
        description: "Failed to delete comment. Please try again.",
      });
    },
  });
}
