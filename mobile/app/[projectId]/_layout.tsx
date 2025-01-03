import { Tabs } from "expo-router";
import React, { useLayoutEffect } from "react";
import {
  ActivityIndicator,
  Platform,
  Text,
  TouchableOpacity,
} from "react-native";

import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useAuth } from "@/hooks/useAuth";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";
import { useNavigation } from "@react-navigation/native";
import { getProject } from "@/services/project";
import useFetchData from "@/hooks/useFetchData";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { projectId } = useLocalSearchParams();
  const { data: project, loading } = useFetchData(getProject, [
    projectId,
  ]) as any;

  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: `${project.name}`,
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <IconSymbol size={28} name="arrow.left" color="#22c55e" />
        </TouchableOpacity>
      ),
    });
  }, [navigation, project]);
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
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
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
        initialParams={{ projectId }}
        options={{
          title: "Tasks",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="checklist" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="demo"
        initialParams={{ projectId }}
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="house.fill" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
