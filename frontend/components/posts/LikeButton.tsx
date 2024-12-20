import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import axiosInstance from "@/lib/axiosInstance";
import { cn } from "@/lib/utils";
import { Heart } from "lucide-react";

interface LikeInfo {
  isLikedByUser: boolean;
  likes: number;
}

interface LikeButtonProps {
  postId: string;
  initialState: LikeInfo;
}

export default function LikeButton({ postId, initialState }: LikeButtonProps) {
  const { user } = useAuth();
  const { toast } = useToast();

  const [likeInfo, setLikeInfo] = useState<LikeInfo>(initialState);
  const [loading, setLoading] = useState(false); // To prevent multiple clicks

  useEffect(() => {
    // Fetch the latest like info when the component is mounted
    if (!user?.id) return; // Ensure user.id is available
    axiosInstance
      .get(`community/likes/${postId}/likes?userId=${user.id}`)
      .then((response) => setLikeInfo(response.data))
      .catch(() => {
        toast({
          variant: "destructive",
          description: "Failed to load like information.",
        });
      });
  }, [postId, user?.id]);

  const handleLikeToggle = async () => {
    if (!user) {
      toast({
        variant: "destructive",
        description: "You must be signed in to like a post.",
      });
      return;
    }

    setLoading(true);

    try {
      if (likeInfo.isLikedByUser) { 
        // Unlike the post
        await axiosInstance.delete(
          `community/likes/${postId}/unlike?userId=${user.id}`
        );
        setLikeInfo((prev) => ({
          isLikedByUser: false,
          likes: prev.likes - 1,
        }));
      } else {
        // Like the post
        await axiosInstance.post(
          `community/likes/${postId}/like?userId=${user.id}`
        );
        setLikeInfo((prev) => ({
          isLikedByUser: true,
          likes: prev.likes + 1,
        }));
      }
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        description: "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleLikeToggle}
      disabled={loading}
      className="flex items-center gap-2"
    >
      <Heart
        className={cn(
          "size-5",
          likeInfo.isLikedByUser && "fill-red-500 text-red-500"
        )}
      />
      <span className="text-sm font-medium tabular-nums">
        {likeInfo.likes} <span className="hidden sm:inline">likes</span>
      </span>
    </button>
  );
}
