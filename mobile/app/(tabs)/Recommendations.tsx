import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  ActivityIndicator,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import { Colors } from "@/constants/Colors"; // Adjust with your color scheme
import { useAuth } from "@/hooks/useAuth";
import axiosInstance from "@/lib/axiosInstance";

const imageMap: Record<string, any> = {
  "Imad Natsheh": require("../../assets/images/supervisor/imad_natsheh.png"),
  "Manar Qamhieh": require("../../assets/images/supervisor/manar_qamhieh.png"),
  "Ashraf Armoush": require("../../assets/images/supervisor/ashraf_armoush.png"),
  "Sufyan Samara": require("../../assets/images/supervisor/sufyan_samara.png"),
  "Hanal Abu Zant": require("../../assets/images/supervisor/hanal_abu_zant.png"),
  "Samer Arandi": require("../../assets/images/supervisor/samer_arandi.png"),
  "Anas Toma": require("../../assets/images/supervisor/anas_toma.png"),
  "Luai Malhis": require("../../assets/images/supervisor/luai_malhis.png"),
};

interface SupervisorCardProps {
  name: string;
  rating: number;
  bio: string;
  profilePicUrl: string;
  onSelect: () => void;
}

const SupervisorCard = ({
  name,
  rating,
  bio,
  profilePicUrl,
  onSelect,
}: SupervisorCardProps) => (
  <View
    style={{
      padding: 15,
      backgroundColor: Colors.dark.cardBackground,
      borderRadius: 10,
      marginBottom: 15,
      borderWidth: 1,
      borderColor: Colors.dark.border,
    }}
  >
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <Image
        source={imageMap[name] || imageMap.default}
        style={{ width: 50, height: 50, borderRadius: 25 }}
      />
      <Text
        style={{
          fontSize: 18,
          fontWeight: "bold",
          color: Colors.dark.text,
          marginLeft: 10,
        }}
      >
        {name}
      </Text>
    </View>
    <Text
      style={{
        fontSize: 14,
        color: Colors.dark.secondaryText,
        marginVertical: 10,
      }}
    >
      {bio}
    </Text>
    <Text style={{ fontSize: 14, color: Colors.primary }}>
      Rating: {rating} / 10
    </Text>
    <TouchableOpacity
      style={{
        backgroundColor: Colors.primary,
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginTop: 10,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.5,
        elevation: 5, // For Android
      }}
      onPress={onSelect}
    >
      <Text style={{ color: "white", fontWeight: "bold" }}>View Details</Text>
    </TouchableOpacity>
  </View>
);

export default function RecommendationPage() {
  const [projectDescription, setProjectDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedSupervisor, setSelectedSupervisor] =
    useState<Supervisor | null>(null);

  interface Supervisor {
    name: string;
    rating: number;
    bio: string;
    profilePicUrl: string;
    position: string;
    email: string;
    researchSummary: string;
    similarityScore: number;
  }

  const { user } = useAuth();
  const [supervisors, setSupervisors] = useState<Supervisor[]>([]);

  const handleSubmit = async () => {
    if (projectDescription.trim()) {
      setLoading(true);
      try {
        const response = await axiosInstance.post("/recommendations", {
          projectDescription,
        });
        const data = response.data;
        if (response.status === 200) {
          setSupervisors(data);
        } else {
          console.error("Error fetching recommendations:", data.error);
        }
      } catch (error) {
        console.error("Network error:", error);
      } finally {
        setLoading(false);
      }
    } else {
      alert("Please enter a project description.");
    }
  };

  const handleSelectSupervisor = (supervisor: Supervisor) => {
    setSelectedSupervisor(supervisor);
  };

  const handleBackToList = () => {
    setSelectedSupervisor(null);
  };

  return (
    <ScrollView
      contentContainerStyle={{
        padding: 20,
        backgroundColor: Colors.dark.background,
        flexGrow: 1,
      }}
    >
      {selectedSupervisor ? (
        <View>
          <View
            style={{
              padding: 20,
              backgroundColor: Colors.dark.cardBackground,
              borderRadius: 10,
              marginVertical: 10,
              borderWidth: 1,
              borderColor: Colors.dark.border,
            }}
          >
            <Text
              style={{
                fontSize: 22,
                fontWeight: "bold",
                color: Colors.primary,
                marginBottom: 10,
              }}
            >
              {selectedSupervisor.name}
            </Text>

            <View style={{ marginBottom: 10 }}>
              <Text
                style={{
                  fontSize: 14,
                  color: Colors.primary,
                  fontWeight: "bold",
                }}
              >
                Position:
              </Text>
              <Text
                style={{ fontSize: 16, color: Colors.dark.text, marginTop: 5 }}
              >
                {selectedSupervisor.position}
              </Text>
            </View>

            <View style={{ marginBottom: 10 }}>
              <Text
                style={{
                  fontSize: 14,
                  color: Colors.primary,
                  fontWeight: "bold",
                }}
              >
                Email:
              </Text>
              <Text
                style={{ fontSize: 16, color: Colors.dark.text, marginTop: 5 }}
              >
                {selectedSupervisor.email}
              </Text>
            </View>

            <View
              style={{
                marginBottom: 10,
                padding: 10,
                backgroundColor: Colors.dark.cardBackground,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: Colors.dark.border,
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  color: Colors.primary,
                  fontWeight: "bold",
                }}
              >
                Research Summary:
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: Colors.dark.text,
                  marginTop: 5,
                  lineHeight: 20,
                  fontStyle: "italic",
                }}
              >
                {selectedSupervisor.researchSummary}
              </Text>
            </View>

            <View style={{ marginBottom: 10 }}>
              <Text
                style={{
                  fontSize: 14,
                  color: Colors.primary,
                  fontWeight: "bold",
                }}
              >
                Similarity Score:
              </Text>
              <Text
                style={{ fontSize: 16, color: Colors.dark.text, marginTop: 5 }}
              >
                {selectedSupervisor.similarityScore} / 100
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={{
              backgroundColor: Colors.primary,
              paddingVertical: 12,
              paddingHorizontal: 20,
              borderRadius: 10,
              marginTop: 20,
              alignItems: "center",
            }}
            onPress={handleBackToList}
          >
            <Text style={{ color: "white", fontWeight: "bold" }}>
              Back to List
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        // Recommendation form and supervisor list
        <View>
          <Text
            style={{
              fontSize: 24,
              fontWeight: "bold",
              marginBottom: 15,
              color: Colors.dark.text,
              textAlign: "center",
            }}
          >
            Find Your Ideal Supervisor :
          </Text>
          <TextInput
            style={{
              height: 100,
              borderColor: Colors.dark.border,
              borderWidth: 1,
              borderRadius: 10,
              padding: 15,
              fontSize: 16,
              color: Colors.dark.text,
              marginBottom: 15,
              backgroundColor: Colors.dark.cardBackground,
            }}
            multiline
            numberOfLines={4}
            placeholder="Describe your project briefly..."
            placeholderTextColor={Colors.dark.secondaryText}
            value={projectDescription}
            onChangeText={setProjectDescription}
          />
          <TouchableOpacity
            style={{
              backgroundColor: Colors.primary,
              paddingVertical: 12,
              paddingHorizontal: 20,
              borderRadius: 10,
              marginBottom: 20,
              alignItems: "center",
            }}
            onPress={handleSubmit}
          >
            <Text style={{ color: "white", fontWeight: "bold" }}>
              Get Recommendations
            </Text>
          </TouchableOpacity>

          {loading ? (
            <ActivityIndicator
              size="large"
              color={Colors.primary}
              style={{ marginTop: 20 }}
            />
          ) : (
            <View style={{ marginTop: 20 }}>
              {supervisors.length > 0 ? (
                <View>
                  <Text
                    style={{
                      fontSize: 20,
                      fontWeight: "bold",
                      marginBottom: 15,
                      color: Colors.primary,
                    }}
                  >
                    Top 3 Supervisors for Your Project :
                  </Text>
                  {supervisors.map((supervisor, index) => (
                    <SupervisorCard
                      key={index}
                      name={supervisor.name}
                      rating={supervisor.rating}
                      bio={supervisor.bio}
                      profilePicUrl={supervisor.profilePicUrl}
                      onSelect={() => handleSelectSupervisor(supervisor)}
                    />
                  ))}
                </View>
              ) : (
                <Text style={{ color: Colors.dark.text }}>
                  No supervisors available. Please try again later.
                </Text>
              )}
            </View>
          )}
        </View>
      )}
    </ScrollView>
  );
}
