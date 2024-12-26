import axiosInstance from "./axiosInstance";
export const getProject = async (projectId) => {
  try {
    console.log("Fetching project...");

    const response = await axiosInstance.get(
      `http://192.168.1.126:3000/api/v1/projects/${projectId}`
    );
    return response.data;
  } catch (error) {
    console.error("Failed to fetch Project:", error.message);
    throw new Error("Failed to fetch project");
  }
};
