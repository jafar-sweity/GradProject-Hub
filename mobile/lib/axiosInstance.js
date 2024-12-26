import axios from "axios";
import { baseUrl } from "../constants/configuration";
import { getToken } from "../helpers/token";
const axiosInstance = axios.create({
  baseURL: baseUrl,
});
axiosInstance.interceptors.request.use(
  async (config) => {
    const accessToken = await getToken();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
