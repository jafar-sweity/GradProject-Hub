import useFollowerInfo from "@/hooks/userFollowerinfo";
import kyInstance from "@/lib/ky";
import { FollowerInfo } from "@/lib/types";
import { QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "./ui/button";
import { useToast } from "../hooks/use-toast";
import axiosInstance from "@/lib/axiosInstance";
import { useAuth } from "@/hooks/useAuth";

interface FollowButtonProps {
  userId: string;
  initialState: FollowerInfo;
}

export default function FollowButton({
  userId,
  initialState,
}: FollowButtonProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useFollowerInfo(userId, initialState);

  if (isLoading) {
    return <Button>Loading...</Button>;
  }

  if (error) {
    return <Button>Error loading data</Button>;
  }

  const queryKey: QueryKey = ["follower-info", userId];

  const { mutate } = useMutation({
    mutationFn: async () => {
      const endpoint = data.isFollowedByUser
        ? `community/followers/unfollow/${userId}`
        : `community/followers/follow/${userId}`;

      await axiosInstance.post(endpoint, null, {
        params: { currentUserId: user?.id }, // Sends currentUserId as query params
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      toast({
        title: data.isFollowedByUser ? "Unfollowed" : "Followed",
        description: data.isFollowedByUser
          ? `You have unfollowed user successfully`
          : `You are now following user successfully`,
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Something went wrong: ${error.message}`,
      });
    },
  });

  return (
    <Button
      variant={data.isFollowedByUser ? "secondary" : "default"}
      onClick={() => mutate()}
    >
      {data.isFollowedByUser ? "Unfollow" : "Follow"}
    </Button>
  );
}
