"use client";

import React, { useContext } from "react";
import { signIn } from "@/services/authService";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import Link from "next/link";
import { storeToken } from "@/helpers/token";
import { AuthContext } from "@/context/AuthContext";

export default function SignIn() {
  const authContext = useContext(AuthContext);
  const setUser = authContext!.setUser;
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
    const newErrors = {
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
          storeToken(data.token);
          setUser(data.user);
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
    <div className="flex items-center justify-center min-h-screen bg-background text-foreground">
      <div className="card w-full max-w-md bg-card text-card-foreground shadow-lg border border-border rounded-lg p-6">
        <h2 className="text-center text-2xl font-bold mb-6">Sign in</h2>
        <form>
          <div className="form-control mb-4">
            <label className="label" htmlFor="email">
              <span className="label-text text-muted-foreground">Email</span>
            </label>
            <input
              type="email"
              id="email"
              placeholder="your@email.com"
              className="input input-bordered w-full bg-input text-foreground focus:ring-2 focus:ring-ring"
              onChange={handleChange}
            />
            {errors.email && (
              <p className="text-destructive text-sm mt-1">{errors.email}</p>
            )}
          </div>
          <div className="form-control mb-4">
            <label className="label" htmlFor="password">
              <span className="label-text text-muted-foreground">Password</span>
            </label>
            <input
              type="password"
              id="password"
              placeholder="Password"
              className="input input-bordered w-full bg-input text-foreground focus:ring-2 focus:ring-ring"
              onChange={handleChange}
            />
            {errors.password && (
              <p className="text-destructive text-sm mt-1">{errors.password}</p>
            )}
          </div>
          {errors.general && (
            <p className="text-destructive text-sm text-center mb-4">
              {errors.general}
            </p>
          )}
          <div className="form-control mb-4">
            <button
              type="submit"
              className="btn bg-primary text-primary-foreground hover:bg-primary/90 w-full"
              onClick={handleSignIn}
            >
              Sign in
            </button>
          </div>
          <p className="text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/signUp" className="text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
