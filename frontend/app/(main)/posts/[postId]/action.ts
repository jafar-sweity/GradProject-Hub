import axiosInstance from "@/lib/axiosInstance";

interface Post {
  id: any;
  bookmarks: any;
  post_id: string;
  user_id: string;
  content: string;
  likes: number;
  username: string;
  avatarurl: string;
  createdAt: Date;
  isLikedByUser: boolean;
  isBookmarkedByUser: boolean;
  comments: number;
}

export async function getPostById(postId: string): Promise<Post | null> {
  
  try {
    const response = await axiosInstance.get<Post>(
      `/community/posts/${postId}`
    );
    const post = response.data;
    console.log(post);

    return {
      ...post,
      createdAt: new Date(post.createdAt), // Ensure createdAt is a Date object
    };
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error fetching post by id:", error.message);
    } else {
      console.error("Error fetching post by id:", error);
    }
    return null;
  }
}
