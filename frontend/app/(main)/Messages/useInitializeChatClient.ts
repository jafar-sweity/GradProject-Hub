import { useEffect, useState } from "react";
import { StreamChat } from "stream-chat";
import { useSession } from "../SessionProvider";
import axiosInstance from "@/lib/axiosInstance";
import { useAuth } from "@/hooks/useAuth";

export default function useInitializeChatClient() {
  const { user } = useSession();
  const [chatClient, setChatClient] = useState<StreamChat | null>(null);
  const { user: togetavatar } = useAuth();
  useEffect(() => {
    const client = StreamChat.getInstance(process.env.NEXT_PUBLIC_STREAM_KEY!);

    if (!user) {
      return;
    }

    client
      .connectUser(
        {
          id: String(user.id),
          username: user.name,
          name: user.name,
          image: togetavatar?.avatarurl,
        },
        async () => {
          try {
            const response = await axiosInstance.get("chat/token", {
              params: { userId: String(user.id) }, // Ensure userId is a string here too
            });
            return response.data.token; // Ensure response structure matches
          } catch (error) {
            console.error("Error fetching token:", error);
            throw new Error("Failed to fetch token");
          }
        }
      )
      .catch((error) => console.error("Failed to connect user", error))
      .then(() => setChatClient(client));

    return () => {
      setChatClient(null);
      client
        .disconnectUser()
        .catch((error) => console.error("Failed to disconnect user", error))
        .then(() => console.log("Connection closed"));
    };
  }, [user?.id, user?.name, user?.avatarurl]);

  return chatClient;
}
