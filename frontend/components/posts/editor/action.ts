import axiosInstance from "@/lib/axiosInstance";
interface Post {
  content: string;
  user_id: string;
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
    }));

    return { data: posts };
  } catch (error: any) {
    console.error("Error fetching posts:", error.message);
    return { data: [] };
  }
};
export const getallPostsCurrentUser = async (userId: string) => {
  console.log("the user id is", userId);

  try {
    const response = await axiosInstance.get("community/posts/forYou", {
      params: {
        userId, // Pass user_id as a query parameter
      },
    });

    const posts = response.data.map((post: any) => ({
      id: post.id,
      user_id: post.user_id,
      content: post.content,
      likes: post.likes || 0,
      username: post.username || "Unknown",
      createdAt: new Date(post.createdAt),
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

export async function deletePost(postId: string) {
  try {
    const response = await axiosInstance.delete(`community/posts/${postId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}