"use client";

import React, { useContext, useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { signIn } from "@/services/authService";
import { storeToken } from "@/helpers/token";
import { AuthContext } from "@/context/AuthContext";

const SignIn = () => {
  const authContext = useContext(AuthContext);
  const setUser = authContext?.setUser;

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    general: "",
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prevState) => ({ ...prevState, [field]: value }));
    setErrors((prevState) => ({ ...prevState, [field]: "", general: "" }));
  };

  const handleSignIn = async () => {
    let valid = true;
    const newErrors = { email: "", password: "", general: "" };

    if (!formData.email) {
      newErrors.email = "Email is required.";
      valid = false;
    }

    if (!formData.password) {
      newErrors.password = "Password is required.";
      valid = false;
    }

    setErrors(newErrors);

    if (valid) {
      try {
        const data = await signIn(formData);
        if (data) {
          storeToken(data.token);
          setUser?.(data.user);
          router.replace("/");
        }
      } catch (error: any) {
        if (
          error.response?.data?.message === "User not found" ||
          error.response?.data?.message === "Invalid password"
        ) {
          setErrors((prevState) => ({
            ...prevState,
            general: "Invalid email or password.",
          }));
        }
      }
    }
  };

  return (
    <View className="flex-1 items-center justify-center bg-background px-6">
      <View className="w-full max-w-md bg-card text-card-foreground shadow-lg border border-border  p-6">
        <Text className="text-center text-2xl font-bold mb-6 text-foreground">
          Sign in
        </Text>
        <View className="mb-4">
          <Text className="text-muted-foreground mb-2">Email</Text>
          <TextInput
            className="bg-input text-foreground p-3  border border-border focus:border-ring"
            placeholder="your@email.com"
            placeholderTextColor="hsl(240 5% 40%)"
            value={formData.email}
            onChangeText={(text) => handleChange("email", text)}
          />
          {errors.email && (
            <Text className="text-destructive text-sm mt-1">
              {errors.email}
            </Text>
          )}
        </View>
        <View className="mb-4">
          <Text className="text-muted-foreground mb-2">Password</Text>
          <TextInput
            className="bg-input text-foreground p-3  border border-border focus:border-ring"
            placeholder="Password"
            placeholderTextColor="hsl(240 5% 40%)"
            secureTextEntry
            value={formData.password}
            onChangeText={(text) => handleChange("password", text)}
          />
          {errors.password && (
            <Text className="text-destructive text-sm mt-1">
              {errors.password}
            </Text>
          )}
        </View>
        {errors.general && (
          <Text className="text-destructive text-sm text-center mb-4">
            {errors.general}
          </Text>
        )}
        <TouchableOpacity
          className="bg-primary text-primary-foreground py-3  text-center mb-4"
          onPress={handleSignIn}
        >
          <Text className="text-center font-bold text-primary-foreground">
            Sign in
          </Text>
        </TouchableOpacity>
        <Text className="text-center text-sm text-muted-foreground">
          Don’t have an account?{" "}
          <Text
            className="text-primary font-bold underline"
            onPress={() => router.replace("/signUp")}
          >
            Sign up
          </Text>
        </Text>
      </View>
    </View>
  );
};

export default SignIn;
