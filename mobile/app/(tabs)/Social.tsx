import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  ActivityIndicator,
} from "react-native";

// Dummy data for posts and people
const dummyPosts = [
  {
    id: 1,
    username: "John Doe",
    avatarurl: "https://i.pravatar.cc/100?img=1",
    content: "This is a sample post!",
    timestamp: "2h",
  },
  {
    id: 2,
    username: "Jane Smith",
    avatarurl: "https://i.pravatar.cc/100?img=2",
    content: "React Native is amazing!",
    timestamp: "5h",
  },
];

const dummyPeople = [
  {
    id: 1,
    username: "Alice",
    avatarurl: "https://i.pravatar.cc/100?img=3",
  },
  {
    id: 2,
    username: "Bob",
    avatarurl: "https://i.pravatar.cc/100?img=4",
  },
];

const Social = () => {
  const [newPost, setNewPost] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const [posts, setPosts] = useState(dummyPosts);

  const handleCreatePost = () => {
    if (!newPost.trim()) return;

    setIsPosting(true);
    setTimeout(() => {
      const newPostData = {
        id: posts.length + 1,
        username: "You",
        avatarurl: "https://i.pravatar.cc/100?img=5",
        content: newPost,
        timestamp: "Just now",
      };
      setPosts([newPostData, ...posts]);
      setNewPost("");
      setIsPosting(false);
    }, 1000);
  };

  return (
    <View style={styles.container}>
      {/* New Post Section */}
      <View style={styles.newPostContainer}>
        <Image
          source={{ uri: "https://i.pravatar.cc/100?img=5" }}
          style={styles.avatar}
        />
        <TextInput
          style={styles.postInput}
          placeholder="What's happening?"
          value={newPost}
          onChangeText={setNewPost}
          editable={!isPosting}
        />
        <TouchableOpacity
          style={styles.postButton}
          onPress={handleCreatePost}
          disabled={isPosting}
        >
          {isPosting ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.postButtonText}>Post</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Posts Feed */}
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.postCard}>
            <Image source={{ uri: item.avatarurl }} style={styles.avatar} />
            <View style={styles.postContent}>
              <Text style={styles.postUsername}>{item.username}</Text>
              <Text style={styles.postTimestamp}>{item.timestamp}</Text>
              <Text style={styles.postText}>{item.content}</Text>
            </View>
          </View>
        )}
        contentContainerStyle={styles.feedContainer}
      />
    </View>
  );
};

const SkillMatch = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionHeader}>Skill Match Section</Text>
      {/* Add content related to Skill Match here */}
    </View>
  );
};

const TrendingProjects = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionHeader}>Trending Projects Section</Text>
      {/* Add content related to Trending Projects here */}
    </View>
  );
};

const HomePage = () => {
  const [activeTab, setActiveTab] = useState("Social");

  const renderContent = () => {
    if (activeTab === "Social") return <Social />;
    if (activeTab === "SkillMatch") return <SkillMatch />;
    if (activeTab === "TrendingProjects") return <TrendingProjects />;
  };

  return (
    <View style={styles.container}>
      {/* Tab Bar */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          onPress={() => setActiveTab("Social")}
          style={styles.tabButton}
        >
          <Text style={styles.tabButtonText}>Social</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setActiveTab("SkillMatch")}
          style={styles.tabButton}
        >
          <Text style={styles.tabButtonText}>Skill Match</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setActiveTab("TrendingProjects")}
          style={styles.tabButton}
        >
          <Text style={styles.tabButtonText}>Trending Projects</Text>
        </TouchableOpacity>
      </View>

      {/* Render the selected section */}
      {renderContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    paddingTop: 20,
  },
  tabBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#333",
    paddingVertical: 10,
  },
  tabButton: {
    padding: 10,
  },
  tabButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  sectionHeader: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  newPostContainer: {
    paddingTop: 30,
    flexDirection: "row",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 8,
  },
  postInput: {
    flex: 1,
    backgroundColor: "#333",
    borderRadius: 20,
    paddingHorizontal: 16,
    color: "#fff",
  },
  postButton: {
    marginLeft: 8,
    backgroundColor: "#4CAF50",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  postButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  feedContainer: {
    paddingVertical: 16,
  },
  postCard: {
    flexDirection: "row",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  postContent: {
    flex: 1,
  },
  postUsername: {
    color: "#fff",
    fontWeight: "bold",
  },
  postTimestamp: {
    color: "#888",
    fontSize: 12,
    marginBottom: 8,
  },
  postText: {
    color: "#fff",
  },
});

export default HomePage;
