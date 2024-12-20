import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import axiosInstance from "@/lib/axiosInstance";
import { cn } from "@/lib/utils";
import { Bookmark } from "lucide-react";

interface BookmarkInfo {
  isBookmarkedByUser: boolean;
}

interface BookmarkButtonProps {
  postId: string;
  initialState: BookmarkInfo;
}

export default function BookmarkButton({
  postId,
  initialState,
}: BookmarkButtonProps) {
  const { user } = useAuth();
  const { toast } = useToast();

  const [bookmarkInfo, setBookmarkInfo] = useState<BookmarkInfo>(initialState);
  const [loading, setLoading] = useState(false); // Prevent multiple clicks

  // useEffect(() => {
  //   // Fetch the latest bookmark info when the component is mounted
  //   if (!user?.id) return; // Ensure user.id is available
  //   axiosInstance
  //     .get(`community/posts/${postId}/bookmark?userId=${user.id}`)
  //     .then((response) => setBookmarkInfo(response.data))
  //     .catch(() => {
  //       toast({
  //         variant: "destructive",
  //         description: "Failed to load bookmark information.",
  //       });
  //     });
  // }, [postId, user?.id]);

  const handleBookmarkToggle = async () => {
    
    if (!user) {
      toast({
        variant: "destructive",
        description: "You must be signed in to bookmark a post.",
      });
      return;
    }

    setLoading(true);

    try {
      if (bookmarkInfo.isBookmarkedByUser) {
        // Remove bookmark
        await axiosInstance.delete(
          `community/posts/${postId}/bookmark?userId=${user.id}`
        );
        setBookmarkInfo((prev) => ({
          isBookmarkedByUser: false,
        }));
      } else {
        // Add bookmark
        await axiosInstance.post(
          `community/posts/${postId}/bookmark?userId=${user.id}`
        );
        setBookmarkInfo((prev) => ({
          isBookmarkedByUser: true,
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
      onClick={handleBookmarkToggle}
      disabled={loading}
      className="flex items-center gap-2"
    >
      <Bookmark
        className={cn(
          "size-5",
          bookmarkInfo.isBookmarkedByUser && "fill-primary text-primary"
        )}
      />
    </button>
  );
}
