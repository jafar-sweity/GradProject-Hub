import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import LoadingButton from "@/components/LoadingButton";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  updateUserProfileSchema,
  UpdateUserProfileValues,
} from "@/lib/validation";
import { useAuth } from "@/hooks/useAuth";
import axiosInstance from "@/lib/axiosInstance";
import { useState } from "react";

type UserData = {
  id: string;
  user_id: string;
  username: string;
  avatarurl: string;
  followersCount: number;
  followingCount: number;
  postsCount: number;
  createdAt: Date;
  isFollowedByUser: boolean; // Add this here
  bio: string;
};

interface EditProfileDialogProps {
  user: UserData;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function EditProfileDialog({
  user,
  open,
  onOpenChange,
}: EditProfileDialogProps) {
  const form = useForm<UpdateUserProfileValues>({
    resolver: zodResolver(updateUserProfileSchema),
    defaultValues: {
      username: user.username,
      bio: user.bio || "",
    },
  });
  const { user: authUser } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onSubmit(values: UpdateUserProfileValues) {
    if (!authUser) {
      console.error("User is not authenticated");
      return;
    }

    setIsSubmitting(true);
    try {
      await axiosInstance.post(`/users/${authUser.id}`, {
        username: values.username,
        bio: values.bio,
      });
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to update profile:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit as any)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Display Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your display name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us a little bit about yourself"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <LoadingButton type="submit" loading={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save"}
              </LoadingButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
