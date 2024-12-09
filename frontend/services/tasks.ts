import axiosInstance from "@/lib/axiosInstance";

export const getProjectTasks = async (projectId: number) => {
  try {
    const response = await axiosInstance.get(`projects/${projectId}/tasks`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getTaskById = async (projectId: string, taskId: string) => {
  try {
    const response = await axiosInstance.get(
      `projects/${projectId}/tasks/${taskId}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteTask = async (projectId: string, taskId: string) => {
  try {
    const response = await axiosInstance.delete(
      `projects/${projectId}/tasks/${taskId}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
