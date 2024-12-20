import { useAuth } from "@/hooks/useAuth";
import axiosInstance from "@/lib/axiosInstance";
import {
  updateUserProfileSchema,
  UpdateUserProfileValues,
} from "@/lib/validation";

type UserData = {
  id: string;
  user_id: string;
  username: string;
  avatarurl: string;
  followersCount: number;
  followingCount: number;
  postsCount: number;
  createdAt: Date;
  isFollowedByUser: boolean;
  bio: string;
  avatarUrl: string;
};

export async function updateUserProfile(
  values: UpdateUserProfileValues,
  authUser: any,
  avatarFile?: File
): Promise<UserData> {
  // Validate the incoming profile data
  const validatedValues = updateUserProfileSchema.parse(values);

  console.log(`the user is ${authUser.id}`);

  try {
    let avatarUrl = authUser.avatarurl;

    // Upload the avatar if a new file is provided
    if (avatarFile) {
      const formData = new FormData();
      formData.append("file", avatarFile);
      formData.append("id", authUser.id);

      const response = await axiosInstance.post("/api/uploadthing", formData);
      if (response.status === 200) {
        avatarUrl = response.data.fileUrl; // URL returned by UploadThing
      } else {
        throw new Error("Failed to upload avatar");
      }
    }

    // Send updated profile data to your backend, including avatarUrl
    const response = await axiosInstance.post(`/users/${authUser.id}`, {
      username: validatedValues.username,
      bio: validatedValues.bio,
      avatarurl: avatarUrl, // Use the new avatar URL here
    });

    return response.data;
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw new Error("Failed to update user profile.");
  }
}
