import axiosInstance from "@/lib/axiosInstance";

export const getProjectMembers = async (projectId: string) => {
  try {
    const response = await axiosInstance.get(`projects/${projectId}/members`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getProject = async (projectId: string) => {
  try {
    const response = await axiosInstance.get(`projects/${projectId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
