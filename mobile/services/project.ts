import axiosInstance from "../lib/axiosInstance";
export const getProject = async (projectId: string) => {
  try {
    console.log("Fetching project...");

    const response = await axiosInstance.get(`projects/${projectId}`);
    return response.data;
  } catch (error: any) {
    console.error("Failed to fetch Project:", error.message);
    throw new Error("Failed to fetch project");
  }
};

export const getProjectMembers = async (projectId: string) => {
  try {
    const response = await axiosInstance.get(`projects/${projectId}/members`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
