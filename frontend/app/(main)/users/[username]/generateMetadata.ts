import axiosInstance from "@/lib/axiosInstance";
import { Metadata } from "next";

interface PageProps {
  params: { username: string };
}

export async function generateMetadata({
  params: { username },
}: PageProps): Promise<Metadata> {
  try {
    // Fetch user data from the API
    const response = await axiosInstance.get(`/community/users/${username}`);
    const user = response.data;

    // Return dynamic metadata
    return {
      title: `${user.username} (@${user.username})`,
      description: `${user.username}'s profile - view details and activities.`,
    };
  } catch (error) {
    console.error("Error generating metadata:", error);

    // Return fallback metadata if the user is not found
    return {
      title: "User not found",
      description: "The requested user profile could not be found.",
    };
  }
}
