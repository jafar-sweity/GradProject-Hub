import axiosInstance from "@/lib/axiosInstance";
import { AxiosError } from "axios";

export const sendEmail = async (data: { email: string; name: string }) => {
  try {
    const response = await axiosInstance.post(
      "emails/requestEmailVerification",
      data
    );
    return response.data;
  } catch (error) {
    throw error as AxiosError;
  }
};

export const verifyEmail = async (data: { email: string; code: string }) => {
  try {
    const response = await axiosInstance.post("emails/verifyEmailCode", data);
    return response.data;
  } catch (error) {
    throw error as AxiosError;
  }
};
