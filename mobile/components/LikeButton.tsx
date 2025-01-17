import React, { useState, useEffect } from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Heart } from "react-native-feather";
import axiosInstance from "@/lib/axiosInstance";
import { useAuth } from "@/hooks/useAuth";

interface LikeButtonProps {
  postId: string;
}

const LikeButton: React.FC<LikeButtonProps> = ({ postId }) => {
  const { user } = useAuth();
  const [likeInfo, setLikeInfo] = useState({
    likes: 0,
    isLikedByUser: false,
  });
  const [loading, setLoading] = useState(false);

  // Fetch like info on mount
  useEffect(() => {
    if (!user?.id) return;

    const fetchLikeInfo = async () => {
      try {
        const response = await axiosInstance.get(`community/posts/${postId}`);
        setLikeInfo(response.data);
      } catch (error) {
        console.error("Failed to fetch like info:", error);
      }
    };

    fetchLikeInfo();
  }, [postId, user?.id]);

  const handleLikeToggle = async () => {
    if (!user) {
      alert("You must be signed in to like a post.");
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
      console.error("Failed to toggle like:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableOpacity
      onPress={handleLikeToggle}
      style={styles.button}
      disabled={loading}
    >
      {loading ? (
        <ActivityIndicator size="small" color="gray" />
      ) : (
        <Heart
          color={likeInfo.isLikedByUser ? "red" : "gray"}
          width={20}
          height={20}
        />
      )}
      <Text style={styles.likeText}>{likeInfo.likes}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
  },
  likeText: {
    fontSize: 14,
    marginLeft: 8,
    color: "gray",
  },
});

export default LikeButton;
