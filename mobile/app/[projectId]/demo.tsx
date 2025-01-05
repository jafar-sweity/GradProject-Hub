import React, { useState } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";

import { Video, ResizeMode } from "expo-av";
import { useLocalSearchParams } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import { deleteUrl, uploadUrl } from "@/services/upload";

const DemoVideoScreen: React.FC = () => {
  const { projectId, video_demo_url } = useLocalSearchParams() as {
    projectId: string;
    video_demo_url: string;
  };
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(video_demo_url);

  const handleUpload = async () => {
    try {
      // Request media library permissions
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Denied", "Media library access is required.");
        return;
      }

      // Allow user to pick a video
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: false,
      });

      if (result.canceled || !result.assets || result.assets.length === 0) {
        Alert.alert("No Video Selected", "Please select a video to upload.");
        return;
      }

      const { uri, fileName } = result.assets[0];
      setUploading(true);

      const formData = new FormData();
      formData.append("file", {
        uri,
        name: fileName || "video.mp4", // Default name if fileName is unavailable
        type: "video/mp4", // Assuming MP4 format
      } as any);

      formData.append("upload_preset", "video_demo");

      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dnvhhx04c/upload",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setUploadedUrl(response.data.secure_url);
      await uploadUrl(projectId, response.data.secure_url, "video_demo");
      Alert.alert("Success", "Video uploaded successfully!");
    } catch (error: any) {
      console.error("Upload failed:", error?.response?.data || error.message);
      Alert.alert("Error", "Failed to upload video.");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    try {
      if (!uploadedUrl) {
        Alert.alert("No Video", "No video uploaded yet.");
        return;
      }
      await deleteUrl(projectId, "video_demo");
      setUploadedUrl(null);
      Alert.alert("Success", "Video deleted successfully!");
    } catch (error: any) {
      console.error("Delete failed:", error.response?.data);
      Alert.alert("Error", "Failed to delete video.");
    }
  };

  return (
    <View className="flex-1 p-4 justify-between">
      {uploadedUrl && uploadedUrl.includes("cloudinary") ? (
        <View
          className="h-3/5 mb-4 border border-gray-900"
          style={{ borderRadius: 8 }}
        >
          <Video
            source={{ uri: uploadedUrl }}
            useNativeControls
            resizeMode={ResizeMode.CONTAIN}
            style={{ flex: 1, borderRadius: 8 }}
          />
        </View>
      ) : (
        <View
          className="h-3/5 mb-4 justify-center items-center bg-gray-200"
          style={{ borderRadius: 8 }}
        >
          <Text className="text-gray-600">No video uploaded yet.</Text>
        </View>
      )}

      <View className="flex flex-row gap-4 justify-center mb-24">
        <TouchableOpacity
          onPress={handleUpload}
          className="bg-primary p-2 items-center w-1/2 justify-center"
          disabled={uploading}
          style={{ borderRadius: 8 }}
        >
          {uploading ? (
            <View className="w-1/2">
              <ActivityIndicator color="#ffffff" />
            </View>
          ) : (
            <Text className="text-white font-bold w-1/2 text-center">
              Upload Video
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleDelete}
          className="bg-red-500 p-4 items-center w-1/2"
          style={{ borderRadius: 8 }}
        >
          <Text className="text-white font-bold">Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default DemoVideoScreen;
