import React, { useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import { emailValidation } from "@/helpers/emailValidtion";
import { signUp } from "@/services/authService";
import { sendEmail, verifyEmail } from "@/services/email";

const SignUp = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [verificationCode, setVerificationCode] = useState(Array(6).fill(""));
  const inputRefs = useRef<TextInput[]>([]);
  const [openModal, setOpenModal] = useState(false);

  const handleSignUp = async () => {
    let valid = true;
    const newErrors = { name: "", email: "", password: "" };

    if (!formData.name) {
      newErrors.name = "Full name is required.";
      valid = false;
    }

    if (!formData.email) {
      newErrors.email = "Email is required.";
      valid = false;
    } else if (!emailValidation(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
      valid = false;
    }

    if (!formData.password) {
      newErrors.password = "Password is required.";
      valid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
      valid = false;
    }

    setErrors(newErrors);

    if (valid) {
      formData.email = formData.email.toLowerCase();

      try {
        const emailResponse = await sendEmail({
          email: formData.email,
          name: formData.name,
        });

        if (emailResponse.success) {
          Alert.alert(
            "Success",
            "A verification code has been sent to your email."
          );
          setOpenModal(true);
        } else {
          Alert.alert("Error", "Error sending verification email.");
        }
      } catch (error: any) {
        Alert.alert("Error", error.response.data.message);
      }
    }
  };

  const handleVerifyCode = async () => {
    const code = verificationCode.join("");
    if (code.length < 6) {
      Alert.alert("Error", "Please enter the complete verification code.");
      return;
    }

    try {
      const verifyResponse = await verifyEmail({
        email: formData.email,
        code: code,
      });

      if (verifyResponse.success) {
        const payload = {
          ...formData,
          role: emailValidation(formData.email),
        };

        const signUpResponse = await signUp(payload);
        if (signUpResponse.user) {
          Alert.alert(
            "Success",
            "Sign Up Successful. Please sign in to continue."
          );
          router.replace("/signIn");
        } else {
          Alert.alert("Error", "Error signing up. Please try again.");
          setOpenModal(false);
        }
      } else {
        Alert.alert(
          "Error",
          "Verification failed. Please check the code and try again."
        );
        setOpenModal(false);
      }
    } catch (error) {
      Alert.alert("Error", "Verification failed. Please try again.");
      setOpenModal(false);
    }
  };

  const handleVerificationCodeChange = (value: string, index: number) => {
    if (/^\d?$/.test(value)) {
      const updatedCode = [...verificationCode];
      updatedCode[index] = value;
      setVerificationCode(updatedCode);
      if (value && index < verificationCode.length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleBackspace = (value: string, index: number) => {
    if (value === "" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };
  return (
    <View className="flex-1 justify-center items-center bg-background px-6">
      <View className="w-full max-w-md bg-card p-6 rounded-lg shadow-lg border border-border">
        <Text className="text-center text-2xl font-bold mb-6 text-foreground">
          Sign Up
        </Text>
        <View className="mb-4">
          <TextInput
            className="bg-input text-foreground p-3 rounded-lg border border-border focus:border-ring"
            placeholder="Full name"
            placeholderTextColor="hsl(240 5% 40%)"
            value={formData.name}
            onChangeText={(text) => setFormData({ ...formData, name: text })}
          />
          {errors.name && (
            <Text className="text-destructive text-sm mt-1">{errors.name}</Text>
          )}
        </View>
        <View className="mb-4">
          <TextInput
            className="bg-input text-foreground p-3 rounded-lg border border-border focus:border-ring"
            placeholder="Email"
            placeholderTextColor="hsl(240 5% 40%)"
            value={formData.email}
            onChangeText={(text) => setFormData({ ...formData, email: text })}
          />
          {errors.email && (
            <Text className="text-destructive text-sm mt-1 ">
              {errors.email}
            </Text>
          )}
        </View>
        <View className="mb-4">
          <TextInput
            className="bg-input text-foreground p-3 rounded-lg border border-border focus:border-ring"
            placeholder="Password"
            placeholderTextColor="hsl(240 5% 40%)"
            secureTextEntry
            value={formData.password}
            onChangeText={(text) =>
              setFormData({ ...formData, password: text })
            }
          />
          {errors.password && (
            <Text className="text-destructive text-sm mt-1">
              {errors.password}
            </Text>
          )}
        </View>
        <TouchableOpacity
          className="bg-primary py-3 rounded-lg text-center mb-4"
          onPress={handleSignUp}
        >
          <Text className="text-primary-foreground font-bold text-center">
            Sign Up
          </Text>
        </TouchableOpacity>

        <Text className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Text
            className="text-primary font-bold underline"
            onPress={() => router.replace("/signIn")}
          >
            Sign In
          </Text>
        </Text>
      </View>

      {openModal && (
        <View className="absolute top-0 left-0 right-0 bottom-0 bg-popover p-6 justify-center items-center">
          <Text className="text-foreground text-xl font-bold mb-4">
            Verify Email
          </Text>
          <Text className="text-muted-foreground mb-4 text-center">
            Enter the 6-digit verification code sent to your email.
          </Text>
          <View className="flex-row justify-center space-x-2 mb-6">
            {verificationCode.map((digit, index) => (
              <TextInput
                key={index}
                className="bg-input text-foreground p-3 rounded-lg text-center border border-border focus:border-ring w-12 text-xl"
                maxLength={1}
                keyboardType="numeric"
                value={digit}
                onChangeText={(value) =>
                  handleVerificationCodeChange(value, index)
                }
                onKeyPress={({ nativeEvent }) =>
                  nativeEvent.key === "Backspace" &&
                  handleBackspace(verificationCode[index], index)
                }
                ref={(ref) => {
                  if (ref) inputRefs.current[index] = ref;
                }}
              />
            ))}
          </View>
          <TouchableOpacity
            className="bg-primary py-3 rounded-lg text-center w-full max-w-sm"
            onPress={handleVerifyCode}
          >
            <Text className="text-primary-foreground font-bold text-center">
              Verify
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default SignUp;
