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

interface PostC {
  content: string;
  user_id: string;
  username: string;
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

  interface Project {
    id: number;
    title: string;
    description: string;
  }

  interface SkillMatch {
    id: number;
    skill: string;
    projectTitle: string;
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
  }

  const [projects, setProjects] = useState<Project[]>([]);
  const [skillMatches, setSkillMatches] = useState<SkillMatch[]>([]);
  const [communityUpdates, setCommunityUpdates] = useState<Post[]>([]);
  const [newPostContent, setNewPostContent] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      const dummyProjects = await getProjects();
      const dummySkillMatches = await getSkillMatches();
      const response = await getallPosts(user?.id || "");

      let posts = response.data.map((post: Post) => ({
        ...post,
        createdAt: new Date(post.createdAt).toLocaleString(),
      }));

      posts = posts.slice(0, 5); // Limit to 5 posts
      setProjects(dummyProjects);
      setSkillMatches(dummySkillMatches);
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

  const handleAddPost = () => {
    if (newPostContent.trim()) {
      const newPost: PostC = {
        content: newPostContent,
        username: user?.name || "Anonymous",

        user_id: user?.id || "",
      };
      createPost(newPost);
      setNewPostContent("");
    } else {
      alert("Please enter some content for the post.");
    }
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
    { title: "Skill Matches for You", data: skillMatches, type: "skills" },
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
                />
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
                } 
                 else if (item.type === "updates") {
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

const getSkillMatches = async () => [
  { id: 1, skill: "React", projectTitle: "Web Dashboard" },
  { id: 2, skill: "Node.js", projectTitle: "API Development" },
  { id: 3, skill: "UI/UX", projectTitle: "Mobile App Design" },
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
  skillCard: {
    backgroundColor: "#2e2e2e",
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
  },
  updateCard: {
    flexDirection: "row",
    backgroundColor: "#2e2e2e",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: "center",
  },
  avatar: { width: 50, height: 50, borderRadius: 25, marginBottom: 10 },
  avatarSmall: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
  cardTitle: { fontSize: 16, fontWeight: "bold", color: "#ffffff" },
  cardSubtitle: { fontSize: 14, color: "#aaaaaa", marginTop: 5 },
  updateText: { fontSize: 16, color: "#ffffff" },
  updateTime: { fontSize: 12, color: "#888888", marginTop: 5 },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 15,
  },
  actionText: {
    fontSize: 14,
    color: "#ffffff",
    marginLeft: 5,
  },
});

export default HomeScreen;
