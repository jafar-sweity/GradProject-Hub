import { View, Text, TextInput, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useStreamVideoClient } from "@stream-io/video-react-native-sdk";

const JoinMeeting = () => {
  const [roomId, setRoomId] = useState("");
  const client = useStreamVideoClient();
  return (
    <SafeAreaView
      style={{ flex: 1 }}
      className="flex-1 justify-center items-center bg-background text-white"
    >
      <Text className="p-5 font-bold">Enter the Room Name</Text>
      <TextInput
        className="p-5 m-5 bg-white text-black w-full"
        placeholder="Room Name"
        placeholderTextColor="gray"
        value={roomId}
        onChangeText={setRoomId}
      />
      <TouchableOpacity
        className="p-5 m-5 bg-primary"
        onPress={() => {
          if (!roomId) return;
          const slug = roomId.toLowerCase().replace(/\s/g, "-");
          console.log(slug, "slug", roomId);

          const call = client?.call("default", slug);
          call
            ?.get()
            .then((response) => {
              console.log("response", response);
              router.push(`/meetings/${slug}`);
            })
            .catch((error) => {
              console.error("Failed to join the call:", error);
            });
        }}
      >
        <Text className="text-white font-bold">Join Room</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default JoinMeeting;
