import axiosInstance from "@/lib/axiosInstance";

export const getProjectTasks = async (projectId: number) => {
  try {
    const response = await axiosInstance.get(`projects/${projectId}/tasks`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
