"use client";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { createPost } from "./action";
import { User } from "lucide-react";
import UserAvatar from "../../UserAvatar";
import { useAuth } from "@/hooks/useAuth";
import { useDropzone } from "@uploadthing/react";
import { Button } from "@/components/ui/button";
import "./styles.css";
import DOMPurify from "dompurify";
import { useSubmitPostMutation } from "./mutations";
import { on } from "events";
import LoadingButton from "@/components/LoadingButton";

export default function PostEditor() {
  const { user } = useAuth();

  const mutatuion = useSubmitPostMutation();
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        bold: false,
        italic: false,
      }),
      Placeholder.configure({
        placeholder: "Write something amazing...",
      }),
    ],
  });
  const input =
    editor?.getText({
      blockSeparator: "\n",
    }) || "";

  function onSubmit() {
    if (!editor) {
      return;
    }
    const content = editor.getText();
    if (user?.id) {
      mutatuion.mutate(
        { content, user_id: user.id },
        {
          onSuccess: () => {
            editor?.commands.clearContent();
          },
        }
      );
    } else {
      console.error("User ID is undefined");
    }
    editor?.commands.clearContent();
  }
  return (
    <div className="flex flex-col gap-5 rounded-2xl bg-card p-5 shadow-sm">
      <div className="flex gap-5">
        <UserAvatar avatarurl={user?.avatarurl} className="hidden sm:inline" />

        <EditorContent
          editor={editor}
          className="max-h-[20rem] w-full overflow-y-auto rounded-2xl bg-background px-5 py-3"
        />
      </div>
      <div className="flex justify-end">
        <LoadingButton
          onClick={onSubmit}
          disabled={!input.trim()}
          className="min-w-20"
          loading={mutatuion.isPending}
        >
          Post
        </LoadingButton>
      </div>
    </div>
  );
}
