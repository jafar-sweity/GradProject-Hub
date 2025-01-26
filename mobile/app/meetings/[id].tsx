import { View, Text, ActivityIndicator, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import {
  Call,
  useStreamVideoClient,
  StreamCall,
  CallingState,
} from "@stream-io/video-react-native-sdk";
import Room from "@/components/Room";
import { generateSlug } from "random-word-slugs";
const CallScreen = () => {
  const { id } = useLocalSearchParams();
  const [call, setCall] = useState<Call | null>(null);
  const client = useStreamVideoClient();
  const [slug, setSlug] = useState<string | null>(null);

  useEffect(() => {
    let slug: string;

    if (id !== "(call)" && id) {
      // joining an existing call
      slug = id.toString();
      const _call = client?.call("default", slug);
      _call
        ?.join({ create: false })
        .then(() => {
          setCall(_call);
        })
        .catch((error) => {
          console.error("Failed to join the call:", error);
        });
    } else {
      slug = generateSlug(3, {
        categories: {
          adjective: ["color", "personality"],
          noun: ["technology", "science", "education"],
        },
      });
      // creating a new call
      const _call = client?.call("default", slug);
      _call
        ?.join({ create: true })
        .then(() => {
          Alert.alert("Call Created Successfully", `Room ID: ${slug}`);
          setCall(_call);
        })
        .catch((error) => {
          console.error("Failed to create call:", error);
        });
    }
    setSlug(slug);
  }, [id, client]);

  useEffect(() => {
    // cleanup functions run when the component unmounts
    if (call?.state.callingState !== CallingState.LEFT) {
      call?.leave();
    }
  }, [call]);

  if (!call || !slug) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0f4" />
      </View>
    );
  }

  return (
    <StreamCall call={call}>
      <Room slug={slug} />
    </StreamCall>
  );
};

export default CallScreen;
