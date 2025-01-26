import axiosInstance from "@/lib/axiosInstance";
import { AxiosError } from "axios";

export const sendScheduleMeetingInfo = async (data: {
  emails: string[];
  meetingDate: Date;
  roomId: string;
  meetingCreator: string;
}) => {
  try {
    const response = await axiosInstance.post(
      "meeting/sendScheduleMeetingInfo",
      data
    );
    return response.data;
  } catch (error) {
    throw error as AxiosError;
  }
};
