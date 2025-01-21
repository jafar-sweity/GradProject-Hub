import React, { useState, useEffect } from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { Bookmark } from "react-native-feather"; // You can use other icons too

interface BookmarkButtonProps {
  postId: string;
  initialState: {
    isBookmarkedByUser: boolean;
  };
}

const BookmarkButton: React.FC<BookmarkButtonProps> = ({ postId, initialState }) => {
  const [isBookmarked, setIsBookmarked] = useState(
    initialState.isBookmarkedByUser
  );

  useEffect(() => {
    setIsBookmarked(initialState.isBookmarkedByUser);
  }, [initialState]);

  const handleBookmark = () => {
    // Logic to handle bookmark/unbookmark (this could be an API call)
    const newBookmarkState = !isBookmarked;
    setIsBookmarked(newBookmarkState);

    // Here you can make a request to the server to update the bookmark status
    // axiosInstance.post(`/posts/${postId}/bookmark`, { bookmark: newBookmarkState });
  };

  return (
    <TouchableOpacity onPress={handleBookmark} style={styles.button}>
      <Bookmark
        color={isBookmarked ? "#4CAF50" : "gray"}
        width={20}
        height={20}
      />
      <Text style={styles.bookmarkText}>
        {isBookmarked ? "Bookmarked" : "Bookmark"}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
  },
  bookmarkText: {
    fontSize: 14,
    marginLeft: 8,
    color: "gray",
  },
});

export default BookmarkButton;
