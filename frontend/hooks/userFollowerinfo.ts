import { useQuery } from "@tanstack/react-query";
import kyInstance from "@/lib/ky";
import { FollowerInfo } from "@/lib/types";
import { useAuth } from "./useAuth";

export default function useUserFollowerInfo(
  userId: string,
  initialState: FollowerInfo
) {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["follower-info", userId],
    queryFn: () =>
      kyInstance
        .get(`/api/v1/community/followers/${userId}`, {
          searchParams: user?.id ? { currentUserId: user.id } : undefined,
        })
        .json<FollowerInfo>(),
    initialData: initialState,
    staleTime: Infinity,
  });
}
