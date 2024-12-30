import { cn } from "@/lib/utils";
import { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Bot, XCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import UserAvatar from "./UserAvatar";

interface AiChatBoxProps {
  open: boolean;
  onClose: () => void;
}

export default function AiChatBox({ open, onClose }: AiChatBoxProps) {
  const [messages, setMessages] = useState<
    { role: string; content: string; id: string }[]
  >([]);
  const [input, setInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() === "") return;

    setMessages([
      ...messages,
      { role: "user", content: input, id: Date.now().toString() },
    ]);
    setInput("");
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();

      setMessages((prevMessages) => [
        ...prevMessages,
        { role: "AI", content: data, id: Date.now().toString() },
      ]);
    } catch (err) {
      setError("Failed to fetch AI response.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={cn(
        "bottom-0 right-0 z-10 w-full max-w-[500px] p-1 xl:right-36",
        open ? "fixed" : "hidden"
      )}
    >
      <button onClick={onClose} className="mb-1 ms-auto block">
        <XCircle size={30} />
      </button>
      <div className="flex h-[600px] flex-col rounded border bg-background shadow-xl">
        <div className="h-full overflow-y-auto">
          {messages.length > 0 ? (
            messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))
          ) : (
            <div className="flex">No messages yet</div>
          )}
        </div>
        {error && <div className="text-red-500">{error}</div>}
        <form onSubmit={handleSubmit} className="m-3 flex gap-1">
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="Say something..."
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Sending..." : "Send"}
          </Button>
        </form>
      </div>
    </div>
  );
}

function ChatMessage({
  message: { role, content },
}: {
  message: { role: string; content: string };
}) {
  const user = useAuth();
  const isUser = role === "user";
  const isAi = role === "AI";
  return (
    <div
      className={cn(
        "mb-3 flex items-center",
        isAi ? "me-5 justify-start" : "ms-5 justify-end"
      )}
    >
      {isAi && <Bot className="mr-2 shrink-0" />}

      <p
        className={cn(
          "whitespace-pre-line rounded-md border px-3 py-2",
          isAi ? " bg-background" : " bg-primary text-primary-foreground"
        )}
      >
        {content}
      </p>
      {isUser && user.user && (
       <UserAvatar avatarurl={user.user.avatarurl} />
      )}
    </div>
  );
}
