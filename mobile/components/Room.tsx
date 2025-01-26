import { View, Text, TouchableOpacity } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import React from "react";
import {
  CallContent,
  ScreenShareToggleButton,
  ToggleCameraFaceButton,
  ToggleAudioPublishingButton,
  ToggleVideoPublishingButton,
  HangUpCallButton,
  ReactionsButton,
} from "@stream-io/video-react-native-sdk";
import { useRouter } from "expo-router";

const CallRoom = ({ slug }: { slug: string }) => {
  const router = useRouter();

  // const { useIsScreenSharingOn } = useCallStateHooks();
  // const isScreenSharingOn = useIsScreenSharingOn();

  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          position: "absolute",
          top: 10,
          left: 10,

          backgroundColor: "black",
          zIndex: 100,
        }}
      >
        <RoomId slug={slug} />
      </View>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <CallContent
          CallControls={() => (
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                padding: 10,
                gap: 16,
              }}
            >
              <ToggleVideoPublishingButton />
              <ToggleAudioPublishingButton />
              <ToggleCameraFaceButton />
              <ScreenShareToggleButton />
              <ReactionsButton />
              <HangUpCallButton onHangupCallHandler={() => router.back()} />
            </View>
          )}
        />
      </GestureHandlerRootView>
    </View>
  );
};

const RoomId = ({ slug }: { slug: string }) => {
  if (!slug) {
    slug = "";
  }
  slug = slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
  return (
    <TouchableOpacity
      // onPress={() => copySlug(slug)}
      style={{
        backgroundColor: "rgba(0,0,0,0.5)",
        padding: 10,
        borderRadius: 5,
      }}
    >
      <Text
        style={{
          color: "white",
        }}
      >
        Call ID: {slug}
      </Text>
    </TouchableOpacity>
  );
};
export default CallRoom;
