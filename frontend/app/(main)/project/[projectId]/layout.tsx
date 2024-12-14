"use client";
import { useAuth } from "@/hooks/useAuth";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    if (!user && !loading) {
      router.push("/signIn");
    } else {
      setIsChecked(true);
    }
  }, [user, router]);

  if (!isChecked) {
    return (
      <div className="w-full flex justify-center">
        <span className="loading loading-dots loading-lg bg-primary"></span>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-hidden rounded-[0.5rem] border bg-background shadow w-full">
        {children}
      </div>
    </>
  );
};

export default Layout;
