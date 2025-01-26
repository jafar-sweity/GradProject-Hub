import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Platform,
  StyleSheet,
} from "react-native";
import { Call, useStreamVideoClient } from "@stream-io/video-react-native-sdk";
import { generateSlug } from "random-word-slugs";
import DateTimePicker from "@react-native-community/datetimepicker";
import { sendScheduleMeetingInfo } from "@/services/meeting";
import { useAuth } from "@/hooks/useAuth";

export default function CreateMeetingPage() {
  const [participantsInput, setParticipantsInput] = useState<string>("");
  const [call, setCall] = useState<Call | null>(null);
  const { user } = useAuth();
  const client = useStreamVideoClient();

  const [isPickerShow, setIsPickerShow] = useState(false);
  const [date, setDate] = useState(new Date(Date.now()));
  const [mode, setMode] = useState<"date" | "time">("date");
  interface ShowPickerProps {
    mode: "date" | "time";
  }

  const showPicker = ({ mode }: ShowPickerProps) => {
    setIsPickerShow(true);
    setMode(mode);
  };

  const onChange = (event: any, value: any) => {
    setDate(value);
    if (Platform.OS === "android") {
      setIsPickerShow(false);
    }
  };

  const createMeeting = async () => {
    if (!client) {
      Alert.alert("Error", "Stream client not available.");
      return;
    }

    try {
      const slug = generateSlug(3, {
        categories: {
          adjective: ["color", "personality"],
          noun: ["technology", "science", "education"],
        },
      });

      const call = client.call("default", slug);

      const starts_at = date
        ? new Date(date).toISOString()
        : new Date().toISOString();

      await call.getOrCreate({
        data: {
          starts_at,
        },
      });

      setCall(call);

      await sendScheduleMeetingInfo({
        emails: [...participantsInput.split(",").map((email) => email.trim())],
        meetingDate: new Date(date),
        roomId: slug,
        meetingCreator: user?.name || "",
      });

      Alert.alert("Success", "Meeting created successfully!");
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to create meeting. Please try again.");
    }
  };

  if (!client) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0f4" />
      </View>
    );
  }

  return (
    <View className="flex-1 p-4 bg-black justify-center">
      <Text className="text-2xl font-bold text-center mb-6 text-white">
        Create a New Meeting
      </Text>

      {/* Start Time Input */}
      <View className="mb-6">
        <Text className="text-lg font-bold mb-2 text-white">Start Time</Text>
        <TouchableOpacity
          onPress={() => showPicker({ mode: "date" })}
          className="rounded p-2 bg-gray-700 mb-2"
        >
          <Text className="text-white text-center">Select Date</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => showPicker({ mode: "time" })}
          className="rounded p-2 bg-gray-700 mb-2"
        >
          <Text className="text-white text-center">Select Time</Text>
        </TouchableOpacity>
        <View className="border border-gray-500 rounded p-2">
          <Text className="text-white text-center">
            {date.toLocaleString()}
          </Text>
        </View>

        {isPickerShow && (
          <DateTimePicker
            themeVariant="dark"
            value={date}
            mode={mode}
            display={"spinner"}
            is24Hour={true}
            onChange={onChange}
            style={styles.datePicker}
          />
        )}
      </View>

      {/* Participants Input */}
      <View className="mb-6">
        <Text className="text-lg font-bold mb-2 text-white">
          Participants (Emails)
        </Text>
        <TextInput
          className="border border-gray-500 rounded p-2 h-24 text-white"
          placeholder="Enter participant emails separated by commas"
          placeholderTextColor="gray"
          value={participantsInput}
          onChangeText={setParticipantsInput}
          multiline
        />
      </View>

      {/* Create Meeting Button */}
      <TouchableOpacity
        className="bg-primary p-4"
        onPress={createMeeting}
        style={{ borderRadius: 8 }}
      >
        <Text className="text-white text-center font-bold">Create Meeting</Text>
      </TouchableOpacity>
      {call && (
        <View className="mt-4">
          <Text className="text-white text-center">
            Meeting Room Name: {call.id}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  // This only works on iOS
  datePicker: {
    color: "white",
    width: 320,
    height: 260,
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
  },
});
