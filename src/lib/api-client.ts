import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { useAuthStore } from "@/store/authStore";

interface RetriableConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true, // sends the httpOnly refresh_token cookie
  headers: { "Content-Type": "application/json" },
});

// Attach the in-memory access token to every request.
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// On 401, try exactly one silent refresh, then retry the original request.
let isRefreshing = false;
let pendingQueue: Array<() => void> = [];

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetriableConfig | undefined;

    if (error.response?.status !== 401 || !originalRequest || originalRequest._retry) {
      return Promise.reject(error);
    }

    if (originalRequest.url?.includes("/auth/refresh")) {
      useAuthStore.getState().clearAuth();
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    if (isRefreshing) {
      // Queue this request until the in-flight refresh resolves.
      return new Promise((resolve) => {
        pendingQueue.push(() => resolve(api(originalRequest)));
      });
    }

    isRefreshing = true;
    try {
      const { data } = await api.post<{ accessToken: string }>("/auth/refresh");
      useAuthStore.getState().setAccessToken(data.accessToken);
      pendingQueue.forEach((resolve) => resolve());
      pendingQueue = [];
      return api(originalRequest);
    } catch (refreshError) {
      useAuthStore.getState().clearAuth();
      pendingQueue = [];
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default api;