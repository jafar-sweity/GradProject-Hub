import axiosInstance from "@/lib/axiosInstance";
import { tr } from "@faker-js/faker";
interface Post {
  content: string;
  user_id: string;
  username: string;
}
export async function createPost(post: Post) {
  // check the authentification

  // check the user and if the user is logged in and their id
  try {
    const response = await axiosInstance.post("community/posts", post);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export const getallPosts = async () => {
  try {
    const response = await axiosInstance.get("community/posts");

    const posts = response.data.map((post: any) => ({
      id: post.id,
      user_id: post.user_id,
      content: post.content,
      likes: post.likes || 0,
      username: post.username || "Unknown",
      createdAt: new Date(post.createdAt),
      avatarurl: post.avatarurl || "",
    }));

    return { data: posts };
  } catch (error: any) {
    console.error("Error fetching posts:", error.message);
    return { data: [] };
  }
};
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
      photoUrls: post.photoUrls,
    }));

    return { data: posts };
  } catch (error: any) {
    console.error("Error fetching posts:", error.message);
    return { data: [] };
  }
};

export async function getWhoToFollow(userId: string) {
  console.log("the user id is", userId);

  try {
    const response = await axiosInstance.get(
      `community/followers/users/notfollow`,
      {
        params: {
          userId,
        },
      }
    );

    return response.data.map((user: any) => ({
      id: user.user_id,
      username: user.username,
      avatarurl: user.avatarurl,
    }));
  } catch (error: any) {
    console.error("Error fetching users:", error.message);
    return [];
  }
}

export async function getallFollowingPosts(userId: string) {
  try {
    const response = await axiosInstance.get("community/posts/following", {
      params: { userId },
    });

    // Transform the data
    const res = response.data.map((post: any) => ({
      id: post.id,

      post_id: post.id,
      user_id: post.user_id,
      content: post.content,
      likes: post.likes || 0,
      username: post.username || "Unknown", // Fallback for username
      avatarurl: post.avatarurl || "", // Provide a fallback for avatar
      createdAt: new Date(post.createdAt),
      comments: post.comments || 0,
      isBookmarkedByUser: post.isBookmarkedByUser,
      photoUrls: post.photoUrls,
    }));
    console.log("Transformed response:", res);

    return res;
  } catch (error: any) {
    console.error("Error fetching posts:", error.message);
    return [];
  }
}
