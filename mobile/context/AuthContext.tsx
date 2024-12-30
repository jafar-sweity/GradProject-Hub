import React, { createContext, useState, useEffect, ReactNode } from "react";
import { getToken } from "@/helpers/token";

interface User {
  id: string;
  mongoId: string;
  name: string;
  email: string;
  role: string;
  avatarurl: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const loadUserFromToken = async () => {
    try {
      const token = await getToken();

      if (token) {
        const decodedUser: User = JSON.parse(atob(token.split(".")[1]));
        setUser(decodedUser);
      }
    } catch (error) {
      console.error("Failed to decode token:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUserFromToken();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
