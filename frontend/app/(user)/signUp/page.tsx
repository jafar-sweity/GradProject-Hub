"use client";
import React, { useState } from "react";
import { signUp } from "@/services/authService";
import { useRouter } from "next/navigation";
import { emailValidation } from "@/helpers/emailValidtion";
import Link from "next/link";
import { sendEmail, verifyEmail } from "@/services/email";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar,
  SnackbarCloseReason,
} from "@mui/material";
import { AxiosError } from "axios";

export default function SignUp() {
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
  const [openModal, setOpenModal] = useState(false);
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [snackBarMessage, setSnackBarMessage] = useState("");
  const [severity, setSeverity] = useState<
    "error" | "success" | "info" | "warning" | undefined
  >(undefined);

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
    const newErrors: {
      name: string;
      email: string;
      password: string;
      verificationCode: string;
    } = {
      name: "",
      email: "",
      password: "",
      verificationCode: "",
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

      try {
        const emailResponse = await sendEmail({
          email: formData.email,
          name: formData.name,
        });
        if (emailResponse.success) {
          setOpenSnackBar(true);
          setSeverity("success");
          setSnackBarMessage(
            "A verification code has been sent to your email. Please check your inbox."
          );
          setOpenModal(true);
        } else {
          setOpenSnackBar(true);
          setSeverity("error");
          setSnackBarMessage("Error sending verification email.");
        }
      } catch (error) {
        console.log(error);
        if (error instanceof AxiosError) {
          setErrors((prevState) => ({
            ...prevState,
            email: error?.response?.data?.message,
          }));
        }
      }
    }
  };

  const handleVerifyCode = async () => {
    const code = verificationCode.join("");
    if (code.length < 6) {
      setOpenSnackBar(true);
      setSeverity("error");
      setSnackBarMessage("Please enter the complete verification code.");
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
          setOpenSnackBar(true);
          setSeverity("success");
          setSnackBarMessage("Sign Up Successful. Please sign in to continue.");
          setTimeout(() => {
            router.push("/signIn");
          }, 2000);
        } else {
          setOpenSnackBar(true);
          setSeverity("error");
          setSnackBarMessage("Error signing up. Please try again.");
        }
      } else {
        setOpenSnackBar(true);
        setSeverity("error");
        setSnackBarMessage(
          "Verification failed. Please check the code and try again."
        );
      }
    } catch (error) {
      console.error("Verification error:", error);
      if (error instanceof AxiosError) {
        setOpenSnackBar(true);
        setSeverity("error");
        setSnackBarMessage(error?.response?.data?.message);
      }
    }
  };

  const handleVerificationCodeChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const value = e.target.value;
    if (/^\d?$/.test(value)) {
      const updatedCode = [...verificationCode];
      updatedCode[index] = value;
      setVerificationCode(updatedCode);

      if (value && index < 5) {
        const nextInput = document.getElementById(`code-${index + 1}`);
        if (nextInput) nextInput.focus();
      }
    }
  };

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenSnackBar(false);
  };

  return (
    <div>
      <div className="flex items-center justify-center min-h-screen bg-cover bg-center">
        <div className="card w-full max-w-md shadow-lg border-[0.05px] bg-black bg-opacity-35 border-gray-800">
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
              <p className="text-center mt-4">
                Already have an account?{" "}
                <Link href="/signIn" className="text-primary">
                  Sign in
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
      <Dialog open={openModal} onClose={() => setOpenModal(false)}>
        <DialogTitle>Verify Your Account</DialogTitle>
        <DialogContent>
          <p>We emailed you the six-digit code. Enter it below to confirm:</p>
          <div
            style={{ display: "flex", justifyContent: "center", gap: "8px" }}
          >
            {verificationCode.map((digit, index) => (
              <input
                key={index}
                id={`code-${index}`}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleVerificationCodeChange(e, index)}
                style={{
                  width: "40px",
                  height: "40px",
                  fontSize: "24px",
                  textAlign: "center",
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                  color: "#333",
                  backgroundColor: "#f9f9f9",
                }}
              />
            ))}
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleVerifyCode} color="primary">
            Verify
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={openSnackBar}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <Alert severity={severity} variant="filled" sx={{ width: "100%" }}>
          {snackBarMessage}
        </Alert>
      </Snackbar>
      ;
    </div>
  );
}
