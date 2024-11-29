import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "../../../hooks/use-toast";
import { createPost } from "./action";
import { useAuth } from "@/hooks/useAuth";

export function useSubmitPostMutation() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      if (user?.id) {
        queryClient.invalidateQueries({
          queryKey: ["post-feed", "for-you", user.id],
        });
      }
      toast({
        title: "Post created",
        description: "Your post has been created",
      });
    },
    onError: (error) => {
      console.log(error);
      toast({
        title: "Error creating post",
        description: error.message,
      });
    },
  });
  return mutation;
}

// creat muations for updating and deleting posts as well
