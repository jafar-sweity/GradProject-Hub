"use client";
import React from "react";
import { signIn } from "@/services/authService";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import Link from "next/link";

export default function SignIn() {
  const router = useRouter();
  const [formData, setFormData] = React.useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = React.useState({
    email: "",
    password: "",
    general: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [id]: value,
    }));
    setErrors((prevState) => ({
      ...prevState,
      [id]: "",
      general: "",
    }));
  };

  const handleSignIn = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    let valid = true;
    const newErrors: { email: string; password: string; general: string } = {
      email: "",
      password: "",
      general: "",
    };

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
          router.push("/");
        }
      } catch (error) {
        if (error instanceof AxiosError) {
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
        console.error(error);
      }
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center"
      style={{
        backgroundImage: "var(--backgroundImage)",
      }}
    >
      <div
        className="card w-full max-w-md shadow-lg border-[0.05px] bg-black bg-opacity-35 border-gray-800"
        style={{
          boxShadow: "var(--boxShadow)",
        }}
      >
        <div className="card-body">
          <h2 className="text-center text-2xl font-bold">Sign in</h2>
          <form>
            <div className="form-control mb-4">
              <label className="label" htmlFor="email">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                id="email"
                placeholder="your@email.com"
                className="input input-bordered w-full bg-background"
                onChange={handleChange}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>
            <div className="form-control mb-4">
              <label className="label" htmlFor="password">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                id="password"
                placeholder="Password"
                className="input input-bordered w-full bg-background"
                onChange={handleChange}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>
            {errors.general && (
              <p className="text-red-500 text-sm text-center mb-4">
                {errors.general}
              </p>
            )}
            <div className="form-control mb-4">
              <button
                type="submit"
                className="btn text-background bg-foreground w-full hover:bg-backgroundHover"
                onClick={handleSignIn}
              >
                Sign in
              </button>
            </div>
            <p className="text-center mt-4">
              Don&apos;t have an account?{" "}
              <Link href="/sign-up" className="text-primary">
                Sign up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
