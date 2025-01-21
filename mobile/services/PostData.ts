import axiosInstance from "@/lib/axiosInstance";

export const getallPostsCurrentUser = async (userId: string) => {
  try {
    const response = await axiosInstance.get("community/posts/forYou", {
      params: {
        userId,
      },
    });

    const posts = response.data.map((post: any) => ({
      id: post.id,
      user_id: post.user_id,
      content: post.content,
      likes: post.likes || 0,
      username: post.username || "Unknown",
      avatarurl: post.avatarurl || "",
      createdAt: new Date(post.createdAt),
      isLikedByUser: post.isLikedByUser,
      isBookmarkedByUser: post.isBookmarkedByUser,
      comments: post.comments || 0,
    }));

    return { data: posts };
  } catch (error: any) {
    console.error("Error fetching posts:", error.message);
    return { data: [] };
  }
};


export const getFollowedPosts = async (userId: string) => {
  try {
    const response = await axiosInstance.get("community/posts/following", {
      params: {
        userId,
      },
    });

    const posts = response.data.map((post: any) => ({
      id: post.id,
      user_id: post.user_id,
      content: post.content,
      likes: post.likes || 0,
      username: post.username || "Unknown",
      avatarurl: post.avatarurl || "",
      createdAt: new Date(post.createdAt),
      isLikedByUser: post.isLikedByUser,
      isBookmarkedByUser: post.isBookmarkedByUser,
      comments: post.comments || 0,
    }));

    return { data: posts };
  } catch (error: any) {
    console.error("Error fetching posts:", error.message);
    return { data: [] };
  }
};
