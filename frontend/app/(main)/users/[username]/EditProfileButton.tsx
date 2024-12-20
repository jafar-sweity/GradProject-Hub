"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import EditProfileDialog from "./EditProfileDialog";

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
interface EditProfileButtonProps {
  user: UserData;
}
export default function EditProfileButton({ user }: EditProfileButtonProps) {
  const [showDialog, setShowDialog] = useState(false);

  return (
    <>
      <Button variant="outline" onClick={() => setShowDialog(true)}>
        Edit profile
      </Button>
      <EditProfileDialog
        user={user}
        open={showDialog}
        onOpenChange={setShowDialog}
      />
    </>
  );
}
