import { useState, useRef } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import LoadingButton from "@/components/LoadingButton";
import { useSubmitPostMutation } from "./mutations";
import { ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import UserAvatar from "@/components/UserAvatar";
import axios from "axios";

export default function PostEditor() {
  const { user } = useAuth();
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Write something amazing...",
      }),
    ],
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const mutation = useSubmitPostMutation();

  const input = editor?.getText() || "";

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length) {
      const file = files[0];
      setSelectedFile(file); // Save the file for later upload

      if (file.type.startsWith("image/") || file.type.startsWith("video/")) {
        const reader = new FileReader();
        reader.onloadend = () => setFilePreview(reader.result as string);
        reader.readAsDataURL(file);
      }
    }
  };

  async function uploadFile() {
    if (!selectedFile) return null;

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await axios.post("/api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data.url; // URL of the uploaded file
    } catch (error) {
      console.error("Error uploading file:", error);
      return null;
    }
  }

  async function onSubmit() {
    if (!editor || !user?.id) return;

    const content = editor.getText();
    const fileUrl = await uploadFile();

    mutation.mutate(
      { content, user_id: user.id, username: user.name },
      {
        onSuccess: () => {
          editor.commands.clearContent();
          setSelectedFile(null);
          setFilePreview(null);
        },
      }
    );
  }

  return (
    <div className="flex flex-col gap-5 rounded-2xl bg-card p-5 shadow-sm">
      <div className="flex gap-5">
        <UserAvatar avatarurl={user?.avatarurl} className="hidden sm:inline" />
        <div className="w-full">
          <EditorContent
            editor={editor}
            className={cn(
              "max-h-[20rem] w-full overflow-y-auto rounded-2xl bg-background px-5 py-3"
            )}
          />
        </div>
      </div>

      {filePreview && (
        <div className="mt-3">
          {filePreview.startsWith("data:image") ? (
            <img
              src={filePreview}
              alt="Preview"
              className="max-h-48 object-cover rounded-lg"
            />
          ) : (
            <video src={filePreview} controls className="max-h-48 rounded-lg" />
          )}
        </div>
      )}

      <div className="flex items-center justify-end gap-3">
        <AddAttachmentsButton onFileChange={handleFileChange} />
        <LoadingButton
          onClick={onSubmit}
          loading={mutation.isPending}
          disabled={!input.trim()}
          className="min-w-20"
        >
          Post
        </LoadingButton>
      </div>
    </div>
  );
}

function AddAttachmentsButton({
  onFileChange,
}: {
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="text-primary hover:text-primary"
        onClick={() => fileInputRef.current?.click()}
      >
        <ImageIcon size={20} />
      </Button>
      <input
        type="file"
        accept="image/*, video/*"
        ref={fileInputRef}
        className="sr-only hidden"
        onChange={onFileChange}
      />
    </>
  );
}
