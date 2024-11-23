import axiosInstance from "@/lib/axiosInstance";

export const getTasks = async () => {
  try {
    const response = await axiosInstance.get("projects/:projectId/tasks");
    return response.data;
  } catch (error) {
    throw error;
  }
};
