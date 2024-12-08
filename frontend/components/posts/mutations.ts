import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import { DeletePost } from "./action";
import { useAuth } from "@/hooks/useAuth";

export function useDeletePostMutation() {
  const { user } = useAuth(); // Ensure `useAuth` provides `user`
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const router = useRouter();
  const pathname = usePathname();

  const mutation = useMutation({
    mutationFn: async (postId: string) => {
      if (!user?.id) throw new Error("User not authenticated");
      return DeletePost(postId, user.id);
    },

    onSuccess: async (deletedPost) => {
      toast({ description: "Post deleted successfully" });

      // Invalidate cache to refresh posts
      //   queryClient.invalidateQueries({ queryKey: ["posts"] }); // Adjust to your query key
      //   queryClient.invalidateQueries({ queryKey: ["userPosts"] }); // Optional for user-specific posts

      // Redirect if on the post's detail page
      if (pathname === `/posts/${deletedPost.id}`) {
        router.push("/"); // Redirect to home or community page
      }
    },

    onError: (error) => {
      console.error("Error deleting post:", error);
      toast({
        variant: "destructive",
        description: "Failed to delete post. Please try again.",
      });
    },
  });

  return mutation;
}
