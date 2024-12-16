import axiosInstance from "@/lib/axiosInstance";

export const getSupervisorProjects = async (
  supervisorId: string,
  semesterName: string
) => {
  try {
    console.log("semesterName", semesterName);

    const response = await axiosInstance.get(
      `projects/supervisor/${supervisorId}?semesterName=${semesterName ?? ""}`
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching supervisor projects:", error);
    throw error;
  }
};
