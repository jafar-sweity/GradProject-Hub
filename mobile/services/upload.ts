import axiosInstance from "@/lib/axiosInstance";

export const uploadUrl = async (
  projectId: string,
  url: string,
  urlType: "abstract" | "video_demo" | "report"
) => {
  try {
    const { data } = await axiosInstance.put("/upload/url", {
      projectId,
      url,
      urlType,
    });
    return data;
  } catch (error) {
    console.error("Error storing URL:", error);
    throw error;
  }
};

export const deleteUrl = async (
  projectId: string,
  urlType: "abstract" | "video_demo" | "report"
) => {
  try {
    const { data } = await axiosInstance.delete("/upload/url", {
      params: {
        projectId,
        urlType,
      },
    });
    console.log("Deleted URL:", data);

    return data;
  } catch (error) {
    console.error("Error deleting URL:", error);
    throw error;
  }
};
