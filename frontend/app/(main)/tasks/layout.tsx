"use client";
import { useAuth } from "@/hooks/useAuth";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user } = useAuth();
  const router = useRouter();
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push("/signIn");
    } else {
      setIsChecked(true);
    }
  }, [user, router]);

  if (!isChecked) {
    return (
      <div className="w-full flex justify-center ">
        <span className="loading loading-dots loading-lg bg-primary"></span>
      </div>
    );
  }

  return <>{children}</>;
};

export default Layout;
