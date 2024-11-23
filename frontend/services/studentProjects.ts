import axiosInstance from "@/lib/axiosInstance";

export const getStudentProject = async (studentId: string) => {
  try {
    const response = await axiosInstance.get(`projects/student/${studentId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
