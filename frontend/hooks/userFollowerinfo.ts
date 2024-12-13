import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axiosInstance";
import { FollowerInfo } from "@/lib/types";
import { useAuth } from "./useAuth";

export default function useUserFollowerInfo(
  userId: string,
  initialState: FollowerInfo
) {
  const { user } = useAuth();

  const fetchFollowerInfo = async (): Promise<FollowerInfo> => {
    console.log(
      "Fetching follower info from:",
      `community/followers/${userId}`,
      "with params:",
      user?.id ? { currentUserId: user.id } : undefined
    );

    const { data } = await axiosInstance.get<FollowerInfo>(
      `community/followers/${userId}`,
      {
        params: user?.id ? { currentUserId: user.id } : undefined,
      }
    );

    return data;
  };

  return useQuery({
    queryKey: ["follower-info", userId],
    queryFn: fetchFollowerInfo,
    initialData: initialState,
    staleTime: Infinity,
  });
}
