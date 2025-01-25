import { Tabs } from "expo-router";
import React, { useEffect } from "react";
import { ActivityIndicator, Platform } from "react-native";

import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import {
  LogLevel,
  logLevels,
  StreamCall,
  StreamVideo,
  StreamVideoClient,
  User,
} from "@stream-io/video-react-native-sdk";
import { useAuth } from "@/hooks/useAuth";
import { SafeAreaView } from "react-native-safe-area-context";
import axiosInstance from "@/lib/axiosInstance";

const apiKey = process.env.EXPO_PUBLIC_GET_STREAM_API_KEY;

if (!apiKey) {
  throw new Error("Missing API Key");
}
const MeetingLayout = () => {
  const colorScheme = useColorScheme();
  const { user: currentUser } = useAuth();
  if (!currentUser) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-background">
        <ActivityIndicator size="large" color="hsl(142.1 70.6% 45.3%)" />
      </SafeAreaView>
    );
  }
  const user: User = {
    id: currentUser.id,
    name: currentUser.name,
    image: currentUser.avatarurl,
  };

  const tokenProvider = async () => {
    const response = await axiosInstance.post("/stream/generateUserToken", {
      id: currentUser.id,
      name: currentUser.name,
      avatarurl: currentUser.avatarurl,
      email: currentUser.email,
    });
  };

  const client = StreamVideoClient.getOrCreateInstance({
    apiKey,
    user,
    tokenProvider,
    options: {
      logger: (logLevel: LogLevel, message: String, ...args: unknown[]) => {},
    },
  });

  return (
    <StreamVideo client={client}>
      <Tabs
        screenOptions={({ route }) => ({
          tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarBackground: TabBarBackground,
          tabBarStyle: {
            display: route.name === "[id]" ? "none" : "flex",
          },
        })}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "All Calls",
            tabBarIcon: ({ color }) => (
              <IconSymbol size={28} name="house.fill" color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="[id]"
          options={{
            title: "Call Screen",
            tabBarIcon: ({ color }) => (
              <IconSymbol size={28} name="person.crop.circle" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="joinCall"
          options={{
            title: "Join Call",
            tabBarIcon: ({ color }) => (
              <IconSymbol size={28} name="star.fill" color={color} />
            ),
          }}
        />
      </Tabs>
    </StreamVideo>
  );
};

export default MeetingLayout;
