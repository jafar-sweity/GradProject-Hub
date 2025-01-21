import axiosInstance from "@/lib/axiosInstance";

export const getallPostsCurrentUser = async (userId: string) => {
  try {
    const response = await axiosInstance.get("community/posts/forYou", {
      params: {
        userId,
      },
    });
    // reverse the order of the posts
    response.data.reverse();
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

export const getallPosts = async (userId: string) => {
  try {
    // Fetch posts concurrently
    const [currentUserPosts, followedPosts] = await Promise.all([
      getallPostsCurrentUser(userId),
      getFollowedPosts(userId),
    ]);

    // Extract the data
    const userPosts = currentUserPosts.data;
    const followPosts = followedPosts.data;

    // Combine posts: prioritize followed posts but mix in user-specific posts
    const combinedPosts: any[] = [];

    const maxFollowPosts = Math.min(followPosts.length, 6); // Limit followed posts to 6
    const maxUserPosts = Math.min(userPosts.length, 2); // Limit user posts to 4

    for (let i = 0; i < Math.max(maxFollowPosts, maxUserPosts); i++) {
      if (i < maxFollowPosts) {
        combinedPosts.push(followPosts[i]);
      }
      if (i < maxUserPosts) {
        combinedPosts.push(userPosts[i]); // Add a post from the user's feed
      }
    }

    // Sort the combined list by creation date (most recent first)
    const sortedPosts = combinedPosts.sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );

    // Limit to 10 posts
    const limitedPosts = sortedPosts.slice(0, 10);

    return { data: limitedPosts };
  } catch (error: any) {
    console.error("Error fetching all posts:", error.message);
    return { data: [] };
  }
};
