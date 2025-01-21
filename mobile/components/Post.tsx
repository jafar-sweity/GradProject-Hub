import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { useAuth } from "@/hooks/useAuth";
import { formatRelative } from "date-fns";
import { MessageSquare } from "react-native-feather";
import LikeButton from "./LikeButton";
import BookmarkButton from "./BookmarkButton";
import axiosInstance from "@/lib/axiosInstance";

interface PostProps {
  post: {
    id: string;
    post_id: string;
    user_id: string;
    username: string;
    avatarurl: string;
    createdAt: string;
    content: string;
    likes: number;
    isLikedByUser: boolean;
    isBookmarkedByUser: boolean;
    comments: number;
  };
}

const Post: React.FC<PostProps> = ({ post }) => {
  const { user } = useAuth();
  const createdAtDate = new Date(post.createdAt);
  const [showComments, setShowComments] = useState(false);

  return (
    <View style={styles.postContainer}>
      {/* Post Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.userInfo}>
          <Image source={{ uri: post.avatarurl }} style={styles.avatar} />
          <View>
            <Text style={styles.username}>{post.username}</Text>
            <Text style={styles.timestamp}>
              {formatRelative(createdAtDate, new Date())}
            </Text>
          </View>
        </TouchableOpacity>
        {post.user_id === user?.id && (
          <TouchableOpacity
            onPress={() => Alert.alert("More Options")}
            style={styles.moreButton}
          >
            <Text style={styles.moreText}>⋮</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Post Content */}
      <Text style={styles.content}>{post.content}</Text>

      {/* Actions */}
      <View style={styles.actions}>
        <View style={styles.actionGroup}>
          <LikeButton postId={post.id} />
          <CommentButton
            post={post}
            onPress={() => setShowComments(!showComments)}
          />
        </View>
        <BookmarkButton
          postId={post.post_id}
          initialState={{
            isBookmarkedByUser: post.isBookmarkedByUser,
          }}
        />
      </View>

      {/* Comments */}
      {showComments && <CommentsList comments={post.id} />}
    </View>
  );
};

interface CommentButtonProps {
  post: PostProps["post"];
  onPress: () => void;
}

const CommentButton: React.FC<CommentButtonProps> = ({ post, onPress }) => (
  <TouchableOpacity onPress={onPress} style={styles.commentButton}>
    <MessageSquare color="gray" width={20} height={20} />
    <Text style={styles.commentText}>{post.comments} comments</Text>
  </TouchableOpacity>
);

interface Comment {
  id: number;
  author: {
    username: string;
    avatarurl: string;
  };
  content: string;
}

const CommentsList: React.FC<{ comments: string }> = ({ comments }) => {
  const { user } = useAuth();
  const [realComments, setRealComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isAddingComment, setIsAddingComment] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Loading state for comments

  const fetchComments = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get(
        `/community/comments/post/${comments}`
      );
      setRealComments(response.data.comments);
    } catch (error) {
      console.error("Failed to fetch comments", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [comments]);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    setIsAddingComment(true); // Show loading indicator
    try {
      const response = await axiosInstance.post(
        `community/comments/post/${comments}`,
        {
          content: newComment,
          user_id: user?.id,
        }
      );

      // Refetch comments to ensure the list is updated
      fetchComments();
      setNewComment(""); // Clear the input field
    } catch (error) {
      console.error("Failed to add comment", error);
    } finally {
      setIsAddingComment(false); // Hide loading indicator
    }
  };

  return (
    <>
      {/* Loading Indicator */}
      {isLoading ? (
        <ActivityIndicator size="large" color="#4CAF50" />
      ) : (
        <FlatList
          data={realComments}
          keyExtractor={(item, index) =>
            item.id ? item.id.toString() : index.toString()
          }
          renderItem={({ item }) => {
            const avatar =
              item.author?.avatarurl ||
              "https://example.com/default-avatar.png";
            const username = item.author?.username;

            return (
              <View style={styles.commentContainer}>
                <Image source={{ uri: avatar }} style={styles.avatar} />
                <View style={styles.commentDetails}>
                  <Text style={styles.commentUsername}>{username}</Text>
                  <Text style={styles.commentContent}>{item.content}</Text>
                </View>
              </View>
            );
          }}
        />
      )}

      {/* Add Comment Section */}
      <View style={styles.addCommentContainer}>
        <TextInput
          style={styles.commentInput}
          placeholder="Write a comment..."
          value={newComment}
          onChangeText={setNewComment}
          editable={!isAddingComment} // Disable input while loading
        />
        <TouchableOpacity
          onPress={handleAddComment}
          style={styles.addCommentButton}
          disabled={isAddingComment} // Disable button while loading
        >
          {isAddingComment ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.addCommentButtonText}>Submit</Text>
          )}
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  // Post Container
  postContainer: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  username: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#333", // Neutral color for username
  },
  timestamp: {
    fontSize: 12,
    color: "gray",
  },
  moreButton: {
    padding: 8,
  },
  moreText: {
    fontSize: 20,
    color: "gray",
  },
  content: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
    color: "#333", // Neutral content color
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  actionGroup: {
    flexDirection: "row",
    alignItems: "center",
  },
  commentButton: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 16,
  },
  commentText: {
    fontSize: 14,
    marginLeft: 8,
    color: "gray", // Subtle gray for the comment count
  },

  // Comments Section
  commentContainer: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    flexDirection: "row",
    alignItems: "center",
  },
  commentDetails: {
    flex: 1,
  },
  commentUsername: {
    fontWeight: "bold",
    marginBottom: 4,
    color: "#333", // Neutral color for comment author username
  },
  commentContent: {
    fontSize: 14,
    color: "#333", // Neutral content color
  },

  // Add Comment Section
  addCommentContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 8,
  },
  commentInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
    paddingHorizontal: 8,
    backgroundColor: "#f9f9f9",
  },
  addCommentButton: {
    marginLeft: 8,
    backgroundColor: "#4CAF50", // Green button for submit
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  addCommentButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  showAddCommentButton: {
    marginTop: 16,
    alignSelf: "center",
  },
  showAddCommentButtonText: {
    color: "#4CAF50", // Green text for Add a Comment button
    fontWeight: "bold",
  },
});

export default Post;
