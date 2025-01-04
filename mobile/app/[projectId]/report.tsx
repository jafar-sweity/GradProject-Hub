import React from "react";
import { Text } from "react-native";
import { useLocalSearchParams } from "expo-router";
const demo = () => {
  const { projectId } = useLocalSearchParams();
  return <Text className="text-red-600 bg-amber-400">{projectId}</Text>;
};

export default demo;
