"use client";
import React from "react";
// import { Button } from "@mui/material";
// import facbookIcon from "../../../public/icons/facebook.png";
// import googleIcon from "../../../public/icons/google.png";
// import Image from "next/image";
import { signUp } from "@/services/authService";
import { useRouter } from "next/navigation";
import { emailValidation } from "@/helpers/emailValidtion";
import { AxiosError } from "axios";
import Link from "next/link";

export default function SignUp() {
  const router = useRouter();
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = React.useState({
    name: "",
    email: "",
    password: "",
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
    }));
  };

  const handleSignUp = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    let valid = true;
    const newErrors: { name: string; email: string; password: string } = {
      name: "",
      email: "",
      password: "",
    };

    if (!formData.name) {
      newErrors.name = "Full name is required.";
      valid = false;
    }

    if (!formData.email) {
      newErrors.email = "Email is required.";
      valid = false;
    } else if (!emailValidation(formData.email)) {
      newErrors.email = "Please enter your university email address.";
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
      const payload = { ...formData, role: emailValidation(formData.email) };
      try {
        const data = await signUp(payload);
        if (data) {
          router.push("/signin");
        }
      } catch (error) {
        if (error instanceof AxiosError) {
          if (error.response?.data?.message === "User already exists") {
            setErrors((prevState) => ({
              ...prevState,
              email: "Email is already in use.",
            }));
          }
        }
        console.log(error);
      }
      // router.push("/signin");
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
          <h2 className="text-center text-2xl font-bold">Sign up</h2>
          <form>
            <div className="form-control mb-4">
              <label className="label" htmlFor="name">
                <span className="label-text">Full name</span>
              </label>
              <input
                type="text"
                id="name"
                placeholder="Your name"
                className="input input-bordered w-full bg-background"
                onChange={handleChange}
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>
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
            <div className="form-control mb-4">
              <button
                type="submit"
                className="btn text-background bg-foreground w-full hover:bg-backgroundHover"
                onClick={handleSignUp}
              >
                Sign up
              </button>
            </div>
            {/* <div className="divider">or</div>
            <div className="form-control mb-2">
              <Button
                type="button"
                className="btn btn-outline btn-primary w-full"
                startIcon={
                  <Image
                    src={googleIcon}
                    height={20}
                    width={20}
                    alt="Google icon"
                  />
                }
              >
                Sign up with Google
              </Button>
            </div>
            <div className="form-control">
              <Button
                type="button"
                className="btn btn-outline btn-info w-full"
                startIcon={
                  <Image
                    src={facbookIcon}
                    height={20}
                    width={20}
                    alt="Facebook icon"
                  />
                }
              >
                Sign up with Facebook
              </Button>
            </div> */}
            <p className="text-center mt-4">
              Already have an account?{" "}
              <Link href="/signin" className="text-primary">
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
