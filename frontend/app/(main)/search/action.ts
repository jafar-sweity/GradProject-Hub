import axiosInstance from "@/lib/axiosInstance";

interface PostType {
  id: string;
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

interface SearchResultsProps {
  query: string;
  userid: string;
}

export const fetchPosts = async ({ query, userid }: SearchResultsProps) => {
  try {
    const response = await axiosInstance.get<PostType[]>(
      "community/posts/search",
      {
        params: {
          q: query,
          userId: userid,
        },
      }
    );

    // Transform the data into the desired format
    const posts = response.data.map((post: any) => ({
      id: post.id,
      user_id: post.user_id,
      content: post.content,
      likes: post.likes || 0,
      username: post.username || "Unknown", // Fallback for username
      avatarurl: post.avatarurl || "", // Provide a fallback for avatar
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
