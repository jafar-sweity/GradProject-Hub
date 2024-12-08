"use client";

import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PostEditor from "@/components/posts/editor/PostEditor";
import TrendsSidebar from "@/components/TrendsSidebar";
import Post from "@/components/posts/Post";
import axiosInstance from "@/lib/axiosInstance";
import { useAuth } from "@/hooks/useAuth";
import ForYouFeed from "./ForYouFeed";
import { getallPostsCurrentUser } from "@/components/posts/editor/action";
import FollowingFeed from "./FollowingFeed";
interface PostProps {
  username: string;
  content: string;
  avatarurl: string;
  createdAt: Date;
}
export default function Home() {
  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        <PostEditor />
        <Tabs defaultValue="for-you">
          <TabsList>
            <TabsTrigger value="for-you">For you</TabsTrigger>
            <TabsTrigger value="following">Following</TabsTrigger>
          </TabsList>
          <TabsContent value="for-you">
            <ForYouFeed />
          </TabsContent>
          <TabsContent value="following">
            <FollowingFeed />
          </TabsContent>
        </Tabs>
      </div>
      <TrendsSidebar />
    </main>
  );
}
