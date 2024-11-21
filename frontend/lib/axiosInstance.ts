import axios, { AxiosError, AxiosInstance, AxiosResponse } from "axios";
import Router from "next/router";
import { getToken, removeToken } from "@/helpers/token";

const axiosInstance: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response && error.response.status === 401) {
      removeToken();
      Router.push("/signIn");
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
