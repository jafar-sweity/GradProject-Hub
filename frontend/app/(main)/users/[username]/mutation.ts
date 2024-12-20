import { useToast } from "@/hooks/use-toast";
import { UpdateUserProfileValues } from "@/lib/validation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUserProfile } from "./actions";

export function useUpdateProfileMutation() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({
      values,
      authUser,
      avatarFile,
    }: {
      values: UpdateUserProfileValues;
      authUser: any;
      avatarFile?: File;
    }) => {
      let avatarUrl = authUser.avatarurl;

      // Upload avatar to UploadThing
      // if (avatarFile) {
      //   const formData = new FormData();
      //   formData.append("file", avatarFile);
      //   formData.append("id", authUser.id);

      //   const response = await fetch("/api/uploadthing", {
      //     method: "POST",
      //     body: formData,
      //   });

      //   if (!response.ok) {
      //     throw new Error("Failed to upload avatar");
      //   }

      //   const data = await response.json();
      //   avatarUrl = data.fileUrl; // URL returned by UploadThing
      // }

      // Send updated profile data to your backend
      return updateUserProfile({ ...values }, authUser, avatarFile);
    },
    onSuccess: async (updatedUser) => {
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
      toast({ description: "Profile updated successfully" });
    },
    onError: (error) => {
      console.error(error);
      toast({
        variant: "destructive",
        description: "Failed to update profile. Please try again.",
      });
    },
  });

  return mutation;
}
