import axiosInstance from "../lib/axiosInstance";
export const getProject = async (projectId) => {
  try {
    console.log("Fetching project...");

    const response = await axiosInstance.get(`projects/${projectId}`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch Project:", error.message);
    throw new Error("Failed to fetch project");
  }
};
