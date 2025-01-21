import React, { useState } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";

import { WebView } from "react-native-webview";
import { useLocalSearchParams } from "expo-router";
import * as DocumentPicker from "expo-document-picker";
import axios from "axios";
import { deleteUrl, uploadUrl } from "@/services/upload";

const ReportScreen: React.FC = () => {
  const { projectId, report_url } = useLocalSearchParams() as {
    projectId: string;
    report_url: string;
  };
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(report_url);

  const handleUpload = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/pdf",
      });

      if (result.canceled || !result.assets || result.assets.length === 0) {
        Alert.alert("No File Selected", "Please select a file to upload.");
        return;
      }

      const { uri, name, mimeType } = result.assets[0];
      setUploading(true);

      const formData = new FormData();
      formData.append("file", {
        uri,
        name,
        type: mimeType,
      } as any);

      formData.append("upload_preset", "report");

      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dnvhhx04c/upload",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setUploadedUrl(response.data.secure_url);
      await uploadUrl(projectId, response.data.secure_url, "report");
      Alert.alert("Success", "File uploaded successfully!");
    } catch (error: any) {
      console.error("Upload failed:", error?.response?.data || error.message);
      Alert.alert("Error", "Failed to upload file.");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    try {
      if (!uploadedUrl) {
        Alert.alert("No file uploaded", "No file to delete.");
        return;
      }
      await deleteUrl(projectId, "report");
      setUploadedUrl(null);
      Alert.alert("Success", "File deleted successfully!");
    } catch (error) {
      console.error("Delete failed:", error);
      Alert.alert("Error", "Failed to delete file.");
    }
  };

  return (
    <View className="flex-1 p-4 justify-between">
      {uploadedUrl && uploadedUrl.includes("cloudinary") ? (
        <View className="h-3/5 mb-4" style={{ borderRadius: 8 }}>
          <WebView
            source={{ uri: uploadedUrl }}
            style={{ flex: 1, borderRadius: 8 }}
          />
        </View>
      ) : (
        <View
          className="h-3/5 mb-4 justify-center items-center bg-gray-200"
          style={{ borderRadius: 8 }}
        >
          <Text className="text-gray-600">No file uploaded yet.</Text>
        </View>
      )}

      <View className="flex flex-row gap-4 justify-center mb-24">
        <TouchableOpacity
          onPress={handleUpload}
          className="bg-primary p-4 items-center w-1/2"
          disabled={uploading}
          style={{ borderRadius: 8 }}
        >
          {uploading ? (
            <View className="w-1/2">
              <ActivityIndicator color="#ffffff" />
            </View>
          ) : (
            <Text className="text-white font-bold w-1/2 text-center">
              Upload PDF
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

export default ReportScreen;
