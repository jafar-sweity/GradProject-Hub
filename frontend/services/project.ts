import axiosInstance from "@/lib/axiosInstance";

export const getProjectMembers = async (projectId: number) => {
  try {
    const response = await axiosInstance.get(`projects/${projectId}/members`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
