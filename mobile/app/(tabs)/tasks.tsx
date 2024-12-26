import { View, Text } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

const TasksScreen = () => {
  return (
    <SafeAreaView>
      <View>
        <Text className="bg-white">TasksScreen</Text>
      </View>
    </SafeAreaView>
  );
};

export default TasksScreen;
