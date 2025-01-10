import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Modal,
  TextInput,
  Button,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useAuth } from "@/hooks/useAuth";
import axiosInstance from "@/lib/axiosInstance";
import Post from "@/components/Post";
import { getallPostsCurrentUser } from "@/services/PostData";

const fetchUser = async (username: string, currentUserId: string) => {
  const response = await axiosInstance.get(`/community/users/${username}`, {
    params: { currentUserId },
  });
  return response.data;
};

const UserProfile = () => {
  const [avatarUrl, setAvatarUrl] = useState(
    "https://via.placeholder.com/150?text=Avatar"
  );

  const [previousAvatarUrl, setPreviousAvatarUrl] = useState(avatarUrl);

  interface UserData {
    username: string;
    bio: string;
    avatarurl: string;
    followersCount: number;
    followingCount: number;
    postsCount: number;
  }

  const [userdata, setUserdata] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<any>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [editedBio, setEditedBio] = useState("");

  const { user } = useAuth();

  useEffect(() => {
    loadUserProfile();
  }, [user]);

  const loadUserProfile = async () => {
    if (user?.name && user?.id) {
      try {
        setLoading(true);
        const data = await fetchUser(user.name, user.id);
        setUserdata(data);
        setAvatarUrl(data.avatarurl || avatarUrl);
        const postsData = await getallPostsCurrentUser(user.id);
        setPosts(postsData.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
        Alert.alert("Error", "Failed to load user profile.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadUserProfile();
    setIsRefreshing(false);
  };

  const handleSaveProfile = async () => {
    try {
      const updatedUserData = {
        name: editedName || userdata?.username,
        bio: editedBio || userdata?.bio,
      };
      const response = await axiosInstance.put(
        `/community/users/${userdata?.username}`,
        updatedUserData
      );
      setUserdata(response.data);
      Alert.alert("Success", "Profile updated successfully!");
      setEditModalVisible(false);
    } catch (error) {
      Alert.alert("Error", "Failed to update profile.");
    }
  };

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!pickerResult.canceled) {
      if (pickerResult.assets && pickerResult.assets.length > 0) {
        setAvatarUrl(pickerResult.assets[0].uri);
        setPreviousAvatarUrl(pickerResult.assets[0].uri);
      }
    }
  };

  const data = [
    { type: "profile", userdata },
    ...posts.map((post: any) => ({ type: "post", ...post })),
  ];

  const renderItem = ({ item }: { item: any }) => {
    if (item.type === "profile") {
      return (
        <View style={styles.infoContainer}>
          <View style={styles.avatarContainer}>
            <Image source={{ uri: avatarUrl }} style={styles.avatar} />
            <View style={styles.buttonRow}>
              <TouchableOpacity
                onPress={() => setEditModalVisible(true)}
                style={styles.editProfileButton}
              >
                <Text style={styles.editProfileText}>Edit Profile</Text>
              </TouchableOpacity>
            </View>
          </View>

          <Text style={styles.username}>{item.userdata.username}</Text>
          <Text style={styles.textMuted}>@{item.userdata.username}</Text>

          <View style={styles.statsContainer}>
            <Text style={styles.statText}>
              {item.userdata.followersCount} Followers
            </Text>
            <Text style={styles.statText}>
              {item.userdata.followingCount} Following
            </Text>
            <Text style={styles.statText}>
              {item.userdata.postsCount} Posts
            </Text>
          </View>

          {item.userdata.bio && (
            <Text style={styles.bio}>{item.userdata.bio}</Text>
          )}
        </View>
      );
    } else {
      return <Post post={item} />;
    }
  };

  if (loading) {
    return (
      <ActivityIndicator size="large" color="#4CAF50" style={{ flex: 1 }} />
    );
  }

  if (!userdata) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>User profile could not be loaded.</Text>
      </View>
    );
  }

  return (
    <>
      <FlatList
        data={data}
        keyExtractor={(item, index) => `${item.type}-${index}`}
        renderItem={renderItem}
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
        }
      />

      {/* Edit Profile Modal */}
      <Modal
        visible={isEditModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Profile</Text>

            {/* Change Avatar Button */}
            <TouchableOpacity
              onPress={pickImage}
              style={styles.changePhotoButton}
            >
              <Text style={styles.changePhotoText}>Change Avatar</Text>
            </TouchableOpacity>

            {/* Avatar Preview */}
            <View style={styles.avatarPreviewContainer}>
              <Image source={{ uri: avatarUrl }} style={styles.avatarPreview} />
            </View>

            {/* Name and Bio Inputs */}
            <TextInput
              style={styles.input}
              placeholder="Enter your name"
              placeholderTextColor="#ccc"
              value={editedName}
              onChangeText={setEditedName}
            />
            <TextInput
              style={[styles.input, styles.bioInput]}
              placeholder="Enter your bio"
              placeholderTextColor="#ccc"
              value={editedBio}
              onChangeText={setEditedBio}
              multiline
            />

            {/* Modal Buttons */}
            <View style={styles.modalButtons}>
              <Button title="Save" onPress={handleSaveProfile} />
              <Button
                title="Cancel"
                onPress={() => setEditModalVisible(false)}
              />
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#121212",
  },
  avatarContainer: {
    alignSelf: "center",
    position: "relative",
    alignItems: "center",
  },
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 2,
    borderColor: "#333",
  },
  avatarPreviewContainer: {
    alignItems: "center",
    marginBottom: 15,
  },
  avatarPreview: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginVertical: 5,
  },
  changePhotoButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    backgroundColor: "#1f1f1f",
    borderRadius: 20,
    marginBottom: 15,
    alignItems: "center",
  },
  changePhotoText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  editProfileButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    backgroundColor: "#333",
    borderRadius: 20,
    marginHorizontal: 5,
    alignItems: "center",
  },
  editProfileText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  infoContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  username: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  textMuted: {
    color: "#aaa",
    marginTop: 5,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginTop: 15,
  },
  statText: {
    fontSize: 16,
    color: "#ddd",
  },
  bio: {
    marginTop: 20,
    fontSize: 16,
    textAlign: "center",
    color: "#ccc",
  },
  errorText: {
    fontSize: 18,
    color: "#f00",
    textAlign: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#1f1f1f",
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 15,
  },
  input: {
    backgroundColor: "#333",
    color: "#fff",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  bioInput: {
    height: 80,
    textAlignVertical: "top",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

export default UserProfile;
