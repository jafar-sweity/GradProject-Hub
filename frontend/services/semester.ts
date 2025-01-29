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

export const createSemester = async (semester: {
  name: string;
  start_date: string;
  end_date: string;
}) => {
  try {
    const response = await axiosInstance.post("semesters", semester);
    return response.data;
  } catch (error) {
    console.error("Error creating semester:", error);
    throw error;
  }
};

export const updateSemester = async (semester: {
  semester_id: string;
  name: string;
  start_date: string;
  end_date: string;
}) => {
  try {
    const response = await axiosInstance.patch(
      `semesters/${semester.semester_id}`,
      semester
    );
    return response.data;
  } catch (error) {
    console.error("Error updating semester:", error);
    throw error;
  }
};

export const deleteSemester = async (semesterId: string) => {
  try {
    const response = await axiosInstance.delete(`semesters/${semesterId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting semester:", error);
    throw error;
  }
};
