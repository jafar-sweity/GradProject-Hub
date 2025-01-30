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
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faVideo,
  faPhone,
  faRightToBracket,
  faCalendarDays,
} from "@fortawesome/free-solid-svg-icons";

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
    id: currentUser.id.toString(),
    name: currentUser.name,
    image: currentUser.avatarurl,
  };

  const tokenProvider = async () => {
    try {
      console.log(
        "Generating user token for:",
        currentUser.id,
        currentUser.name,
        currentUser.email,
        currentUser.avatarurl
      );

      const response = await axiosInstance.post("/meeting/generateUserToken", {
        userId: currentUser.id,
        name: currentUser.name,
        image: currentUser.avatarurl,
        email: currentUser.email,
      });

      console.log("User token generated:", response.data.token);
      return response.data.token;
    } catch (error: any) {
      console.error("Error generating user token:", error.response);
      throw error;
    }
  };

  let client;
  try {
    client = StreamVideoClient.getOrCreateInstance({
      apiKey,
      user,
      tokenProvider,
      // options: {
      //   logLevel: "debug",
      //   logger: (logLevel, message, ...args) => {
      //     console.log("--------------------");
      //     console.log(`[StreamVideo] ${logLevel}: ${message}`, ...args);
      //   },
      // },
    });
  } catch (error) {
    console.error("Error creating StreamVideoClient instance:", error);
    throw error;
  }

  // const user: User = {
  //   id: "15",
  // };
  // const token =
  //   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMTUifQ.h2XqsvG2btBFtvf5WAUB4qby7FvlAd-pItCaCRykUhs";
  // const client = StreamVideoClient.getOrCreateInstance({ apiKey, token, user });

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
            title: "Schedule Meeting",
            tabBarIcon: ({ color }) => (
              <FontAwesomeIcon icon={faCalendarDays} color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="[id]"
          options={{
            title: "Meeting Screen",
            tabBarIcon: ({ color }) => (
              <FontAwesomeIcon icon={faVideo} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="joinCall"
          options={{
            title: "Join Meeting",
            tabBarIcon: ({ color }) => (
              <FontAwesomeIcon icon={faRightToBracket} color={color} />
            ),
          }}
        />
      </Tabs>
    </StreamVideo>
  );
};

export default MeetingLayout;
