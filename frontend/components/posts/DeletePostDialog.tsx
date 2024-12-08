import { useDeletePostMutation } from "./mutations";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import LoadingButton from "../LoadingButton";
import { Button } from "../ui/button";

interface DeletePostDialogProps {
  open: boolean;
  onClose: () => void;
  post: {
    post_id: string;
    user_id: string;
    content: string;
    likes: number;
    username: string;
    avatarurl: string;
    createdAt: Date;
  };
}

export const DeletePostDialog = ({
  open,
  onClose,
  post,
}: DeletePostDialogProps) => {
  const mutation = useDeletePostMutation();

  function handleOpenChange() {
    if (!open || mutation.isPending) {
      onClose();
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete post?</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this post? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <LoadingButton
            variant="destructive"
            onClick={() =>
              mutation.mutate(post.post_id, { onSuccess: onClose })
            }
            loading={mutation.isPending}
          >
            Delete
          </LoadingButton>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={mutation.isPending}
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
