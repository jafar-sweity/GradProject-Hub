import { Tabs } from "expo-router";
import React, { useEffect } from "react";
import { ActivityIndicator, Platform } from "react-native";

import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useAuth } from "@/hooks/useAuth";
import { SafeAreaView } from "react-native-safe-area-context";
import axiosInstance from "@/lib/axiosInstance";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});
export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { user, loading, logout } = useAuth();

 

  async function registerForPushNotificationsAsync() {
    let token;
    if (true) {
      // if (Constants.isDevice) {
      try {
        const { status: existingStatus } =
          await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== "granted") {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }
        if (finalStatus !== "granted") {
          alert("Failed to get push token for push notification!");
          return;
        }
        token = (await Notifications.getExpoPushTokenAsync()).data;
      } catch (error) {
        console.error("Error getting push token:", error);
      }
    } else {
      alert("Must use physical device for Push Notifications");
    }
    console.log(token);

    return token;
  }

  useEffect(() => {
    async function registerPushToken() {
      const token = await registerForPushNotificationsAsync();
      if (token) {
        axiosInstance
          .post("notification/register-token", {
            userId: user?.id,
            token,
          })
          .then(() => console.log("Token registered"))
          .catch((err) =>
            console.error("Error registering token:", err.response.data)
          );
      }
    }
    if (user?.id) {
      registerPushToken();

      const notificationListener =
        Notifications.addNotificationReceivedListener((notification) => {
          // console.log("Notification received:", notification.request.content);
        });
      return () => {
        Notifications.removeNotificationSubscription(notificationListener);
      };
    }
  }, [user?.id]);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="hsl(142.1 70.6% 45.3%)" />
      </SafeAreaView>
    );
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].primary,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: "absolute",
          },
          default: {},
        }),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="house.fill" color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="supervisorProjects"
        options={{
          href: user?.role == "supervisor" ? "/supervisorProjects" : null,
          title: "Projects",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="paperplane.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="studentProjects"
        options={{
          href: user?.role == "student" ? "/studentProjects" : null,
          title: "Projects",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="paperplane.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="Recommendations"
        options={{
          title: "Recommendations",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="star.fill" color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="Profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="person.crop.circle" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
