import axiosInstance from "@/lib/axiosInstance";

export const getSemesters = async () => {
  try {
    const response = await axiosInstance.get("semesters");
    return response.data;
  } catch (error) {
    console.error("Error fetching semesters:", error);
    throw error;
  }
};
