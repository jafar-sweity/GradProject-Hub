import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getCurrentUser, refreshAccessToken } from "../Services/authServices";

function useAuthCheck() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  useEffect(() => {
    const checkTokenAndNavigate = async () => {
      try {
        const accessToken = await AsyncStorage.getItem("authToken");
        if (accessToken) {
          try {
            await getCurrentUser();
            router.replace("/home");
          } catch (tokenError) {
            const newToken = await refreshAccessToken();
            if (newToken) {
              router.replace("/home");
            } else {
              router.replace("/signIn");
            }
          }
        } else if (refreshToken) {
          const newToken = await refreshAccessToken();
          if (newToken) {
            router.replace("/home");
          } else {
            router.replace("/signIn");
          }
        } else {
          router.replace("/signIn");
          return;
        }
      } catch (error) {
        router.replace("/signIn");
      } finally {
        setIsChecking(false);
      }
    };
    checkTokenAndNavigate();
  }, [router]);

  return isChecking;
}

export default useAuthCheck;
