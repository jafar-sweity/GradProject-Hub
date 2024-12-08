import axiosInstance from "@/lib/axiosInstance";

export async function DeletePost(postId: string, userId: string) {
  console.log("Deleting post", postId, userId);
  

  if (!userId) throw new Error("User not authenticated");

  const res = await axiosInstance.delete(`/community/posts/${postId}`, {
    params: { userId },
  });

  return res.data.post; // Ensure this aligns with your backend response
}
