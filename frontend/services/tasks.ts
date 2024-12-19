import axiosInstance from "@/lib/axiosInstance";

export const getProjectTasks = async (projectId: string) => {
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

export const updateTask = async (
  projectId: string,
  taskId: string,
  data: unknown
) => {
  try {
    const response = await axiosInstance.put(
      `projects/${projectId}/tasks/${taskId}`,
      data
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addTask = async (projectId: string, data: unknown) => {
  try {
    const response = await axiosInstance.post(
      `projects/${projectId}/tasks`,
      data
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
