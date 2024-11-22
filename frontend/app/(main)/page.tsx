"use client";
import { useAuth } from "@/hooks/useAuth";

export default function Home() {
  const { user, loading } = useAuth();

  return (
    // dont use DashboardLayout
    <div className="flex items-center justify-center h-screen">
      <div className="flex flex-col items-center space-y-4">
        <h1 className="text-3xl font-bold">Welcome to GradPoject-hub</h1>
        <p className="text-lg text-center">Get started by editing </p>
        {loading ? (
          <p>Loading...</p>
        ) : user ? (
          <p className="text-lg">You are logged in as {user.name}</p>
        ) : (
          <p className="text-lg">You are not logged in</p>
        )}
      </div>
    </div>
  );
}
