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

export const getProjectsBySemesterName = async (semesterName: string) => {
  try {
    const response = await axiosInstance.get(
      `projects/semester/${semesterName}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateProjectStatus = async (projectId: string, project: any) => {
  try {
    const response = await axiosInstance.patch(
      `projects/status/${projectId}`,
      project
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
