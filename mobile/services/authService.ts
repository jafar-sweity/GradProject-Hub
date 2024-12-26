import axiosInstance from "@/lib/axiosInstance";
import { AxiosError } from "axios";
interface SignUpData {
  email: string;
  password: string;
  name: string;
}
export const signUp = async (data: SignUpData) => {
  try {
    const response = await axiosInstance.post("auth/register", data);
    return response.data;
  } catch (error) {
    throw error as AxiosError;
  }
};

export const signIn = async (data: { email: string; password: string }) => {
  try {
    const response = await axiosInstance.post("auth/login", data);
    return response.data;
  } catch (error) {
    throw error as AxiosError;
  }
};
