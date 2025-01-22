import axiosInstance from "@/lib/axiosInstance";

export const registerNotification = async (userId: number, token: string) => {
  try {
    const response = await axiosInstance.post("/notification/register-token", {
      userId,
      token,
    });
    return response.data;
  } catch (error: any) {
    return error.response.data;
  }
};

export const sendNotification = async (
  title: string,
  body: string,
  userId: number
) => {
  try {
    const response = await axiosInstance.post(
      "/notification/send-notification",
      {
        title,
        body,
        userId,
      }
    );
    return response.data;
  } catch (error: any) {
    return error.response.data;
  }
};
