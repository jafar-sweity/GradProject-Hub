import {
  Image,
  StyleSheet,
  Platform,
  Text,
  View,
  StatusBar,
  ActivityIndicator,
} from "react-native";

import { HelloWave } from "@/components/HelloWave";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { SafeAreaView } from "react-native-safe-area-context";
import { Redirect, router } from "expo-router";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
export default function HomeScreen() {
  const { user, logout, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/signIn");
    }
  }, [loading, user]);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="hsl(142.1 70.6% 45.3%)" />
      </SafeAreaView>
    );
  }
  return (
    <SafeAreaView>
      <View className="h-6 bg-white">
        <Text>Open up App.js to start working on your app!</Text>
        <Text className="text-primary font-bold underline" onPress={logout}>
          Sign up
        </Text>
        <Text className="bg-red-400">lqlq {user?.name}</Text>
      </View>
    </SafeAreaView>
  );
}
