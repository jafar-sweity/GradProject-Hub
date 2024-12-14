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
    return error;
  }
};

export const deleteUrl = async (projectId: string, urlType: string) => {
  try {
    const { data } = await axiosInstance.delete("/upload/url", {
      params: {
        projectId,
        urlType,
      },
    });
    return data;
  } catch (error) {
    console.error("Error deleting URL:", error);
    return error;
  }
};
