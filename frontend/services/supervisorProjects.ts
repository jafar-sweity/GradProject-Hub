import axiosInstance from "@/lib/axiosInstance";

export const getSupervisorProjects = async (supervisorId: string) => {
  try {
    const response = await axiosInstance.get(
      `projects/supervisor/${supervisorId}`
    );
    console.log("Supervisor projects fetched successfully:", response.data);

    return response.data;
  } catch (error) {
    console.error("Error fetching supervisor projects:", error);
    throw error;
  }
};
