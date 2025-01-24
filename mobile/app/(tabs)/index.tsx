import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  FlatList,
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  TextInput,
  Button,
  RefreshControl,
} from "react-native";
import { getallPosts, getFollowedPosts } from "@/services/PostData";
import { useAuth } from "@/hooks/useAuth";
import axiosInstance from "@/lib/axiosInstance";
import Post from "@/components/Post";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons"; // For icons
import * as ImagePicker from "expo-image-picker"; // For image upload

interface PostC {
  content: string;
  user_id: string;
  username: string;
  photoUrls?: string[]; // Add photo URLs to the post
}

async function createPost(post: PostC) {
  try {
    const response = await axiosInstance.post("community/posts", post);
    return response.data;
  } catch (error) {
    throw error;
  }
}

const HomeScreen = () => {
  const { user } = useAuth();

  // Redirect to login if user is null
  if (!user) {
    router.replace("/login");
  }

  interface Project {
    id: number;
    title: string;
    description: string;
  }

  interface Post {
    id: number;
    user_id: number;
    content: string;
    likes: number;
    username: string;
    avatarurl: string;
    createdAt: string;
    isLikedByUser: boolean;
    isBookmarkedByUser: boolean;
    comments: number;
    photoUrls?: string[]; // Add photo URLs to the Post interface
  }

  const [projects, setProjects] = useState<Project[]>([]);
  const [communityUpdates, setCommunityUpdates] = useState<Post[]>([]);
  const [newPostContent, setNewPostContent] = useState("");
  const [selectedImages, setSelectedImages] = useState<string[]>([]); // Store selected image URIs
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      const dummyProjects = await getProjects();
      const response = await getallPosts(user?.id || "");

      let posts = response.data.map((post: Post) => ({
        ...post,
        createdAt: new Date(post.createdAt).toLocaleString(),
      }));

      posts = posts.slice(0, 5); // Limit to 5 posts
      setProjects(dummyProjects);
      setCommunityUpdates(posts);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchData();
    setIsRefreshing(false);
  };

  // Handle image selection
  const handleImageUpload = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Sorry, we need camera roll permissions to make this work!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true, // Allow multiple image selection
      quality: 1,
    });

    if (!result.canceled) {
      const newImages = result.assets.map((asset) => asset.uri);
      setSelectedImages((prev) => [...prev, ...newImages]);
    }
  };

  // Handle post creation
  const handleAddPost = () => {
    if (!newPostContent.trim() && selectedImages.length === 0) {
      alert("Please add some content or an image to your post.");
      return;
    }
    // dont forget the selectedImages and upload them to the server
    

    // Create a new post object
    const newPost: PostC = {
      content: newPostContent,
      username: user?.name || "Anonymous",
      user_id: user?.id || "",
      photoUrls: [
        "https://picsum.photos/id/237/3000",
        "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Big_Buck_Bunny_thumbnail_vlc.png/1200px-Big_Buck_Bunny_thumbnail_vlc.png",
      ], // Add selected images to the post
    };

    // Add the new post to your data source (e.g., state or API call)
    createPost(newPost)
      .then(() => {
        // Refresh the posts after adding a new one
        fetchData();
      })
      .catch((error) => {
        console.error("Error creating post:", error);
      });

    // Clear the input and selected images
    setNewPostContent("");
    setSelectedImages([]);
  };

 

  useEffect(() => {
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </SafeAreaView>
    );
  }

  const sections = [
    { title: "Trending Projects", data: projects, type: "projects" },
    { title: "Community Updates", data: communityUpdates, type: "updates" },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={sections}
        keyExtractor={(item, index) => `${item.type}-${index}`}
        renderItem={({ item }) => (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>{item.title}</Text>

            {/* New Post Input under Community Updates */}
            {item.type === "updates" && (
              <View style={styles.newPostContainer}>
                <Text style={styles.newPostLabel}>Create a New Post</Text>
                <TextInput
                  style={styles.newPostInput}
                  placeholder="What's on your mind?"
                  placeholderTextColor="#aaaaaa"
                  value={newPostContent}
                  onChangeText={setNewPostContent}
                  multiline
                />
                {/* Photo Upload Icon */}
                <TouchableOpacity
                  onPress={handleImageUpload}
                  style={styles.uploadButton}
                >
                  <Ionicons name="camera" size={24} color="#4CAF50" />
                  <Text style={styles.uploadButtonText}>Add Photos</Text>
                </TouchableOpacity>
                {/* Display Selected Images */}
                {selectedImages.length > 0 && (
                  <FlatList
                    data={selectedImages}
                    horizontal
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                      <Image
                        source={{ uri: item }}
                        style={styles.selectedImage}
                      />
                    )}
                  />
                )}
                <Button title="Post" onPress={handleAddPost} color="#4CAF50" />
              </View>
            )}

            <FlatList
              data={item.data as any[]}
              keyExtractor={(subItem) => subItem.id.toString()}
              horizontal={item.type !== "updates"}
              renderItem={({ item: subItem }) => {
                if (item.type === "projects") {
                  return (
                    <TouchableOpacity style={styles.projectCard}>
                      <Image
                        source={{
                          uri: "https://random-image-pepebigotes.vercel.app/api/random-image",
                        }}
                        style={styles.avatar}
                      />
                      <Text style={styles.cardTitle}>{subItem.title}</Text>
                      <Text style={styles.cardSubtitle}>
                        {subItem.description}
                      </Text>
                    </TouchableOpacity>
                  );
                } else if (item.type === "updates") {
                  // Add image to one of the posts
                  
                  return (
                    <Post
                      key={subItem.id}
                      post={{
                        id: subItem.id,
                        post_id: subItem.post_id,
                        user_id: subItem.user_id,
                        username: subItem.username,
                        avatarurl: subItem.avatarurl,
                        createdAt: isNaN(new Date(subItem.createdAt).getTime())
                          ? new Date().toISOString() // Use current date if invalid
                          : new Date(subItem.createdAt).toISOString(),
                        content: subItem.content,
                        likes: subItem.likes,
                        isLikedByUser: subItem.isLikedByUser,
                        isBookmarkedByUser: subItem.isBookmarkedByUser,
                        comments: subItem.comments,
                        photoUrls: subItem.photoUrls, // Add photo URLs to the post
                      }}
                    />
                  );
                }
                return null;
              }}
            />
          </View>
        )}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
        }
      />
    </SafeAreaView>
  );
};

// Dummy Data Simulations
const getProjects = async () => [
  {
    id: 1,
    title: "AI Research Tool",
    description: "A project for NLP analysis.",
  },
  {
    id: 2,
    title: "Fitness Tracker",
    description: "Track your daily fitness goals.",
  },
  {
    id: 3,
    title: "E-commerce App",
    description: "A scalable e-commerce platform.",
  },
];

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#121212", padding: 10 },
  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#121212",
  },
  sectionContainer: { marginBottom: 20 },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 10,
  },
  projectCard: {
    backgroundColor: "#1e1e1e",
    padding: 15,
    borderRadius: 10,
    marginRight: 10,
    width: 200,
  },
  newPostContainer: {
    backgroundColor: "#1e1e1e",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  newPostLabel: { fontSize: 18, color: "#ffffff", marginBottom: 10 },
  newPostInput: {
    backgroundColor: "#2e2e2e",
    color: "#ffffff",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    minHeight: 100,
  },
  uploadButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  uploadButtonText: {
    color: "#4CAF50",
    marginLeft: 8,
  },
  selectedImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 8,
  },
  avatar: { width: 50, height: 50, borderRadius: 25, marginBottom: 10 },
  cardTitle: { fontSize: 16, fontWeight: "bold", color: "#ffffff" },
  cardSubtitle: { fontSize: 14, color: "#aaaaaa", marginTop: 5 },
});

export default HomeScreen;
