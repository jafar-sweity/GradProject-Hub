import axiosInstance from "@/lib/axiosInstance";

export const getSupervisorProjects = async (
  supervisorId: string,
  semesterName: string
) => {
  try {
    const response = await axiosInstance.get(
      `projects/supervisor/${supervisorId}?semesterName=${semesterName ?? ""}`
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching supervisor projects:", error);
    throw error;
  }
};
interface Project {
  name: string;
  description?: string;
  studentEmails?: string[];
}
export const addProject = async (data: Project) => {
  try {
    const response = await axiosInstance.post("projects", data);
    return response.data;
  } catch (error) {
    console.error("Error adding project:", error);
    throw error;
  }
};

// export const updateProject = async (projectId: string, data: Project) => {
//   try {
//     const response = await axiosInstance.patch(`projects/${projectId}`, data);
//     return response.data;
//   } catch (error) {
//     console.error("Error updating project:", error);
//     throw error;
//   }
// };
