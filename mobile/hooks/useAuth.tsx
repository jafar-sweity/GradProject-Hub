import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import { removeToken } from "@/helpers/token";
import { useRouter } from "expo-router";

export const useAuth = () => {
  const router = useRouter();
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  const { user, setUser, loading } = authContext;

  const logout = async () => {
    await removeToken();
    setUser(null);
    router.replace("/signIn");
  };

  return { user, loading, logout };
};
