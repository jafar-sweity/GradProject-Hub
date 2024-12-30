"use client";
import { useState } from "react";
import AiChatBox from "./AiChatBox";
import { Button } from "./ui/button";
import { Bot } from "lucide-react";

export default function AIChatButton() {
  const [chatBoxOpen, setchatBoxOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setchatBoxOpen(true)} >
        <Bot size={20} className="mr-2" />
        AI Chat
      </Button>
      <AiChatBox open={chatBoxOpen} onClose={() => setchatBoxOpen(false)} />
    </>
  );
}
