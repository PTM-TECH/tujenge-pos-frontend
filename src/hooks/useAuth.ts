"use client";

import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { api } from "@/lib/api-client";
import { getDefaultRouteForRole } from "@/config/nav.config";

export function useAuth() {
  const router = useRouter();
  const { accessToken, user, setAccessToken, clearAuth } = useAuthStore();

  async function login(email: string, password: string) {
    const { data } = await api.post<{ accessToken: string; requiresOtp?: boolean }>(
      "/auth/login",
      { email, password }
    );
    if (data.requiresOtp) {
      return { requiresOtp: true as const };
    }
    setAccessToken(data.accessToken);
    return { requiresOtp: false as const };
  }

  async function verifyOtp(code: string) {
    const { data } = await api.post<{ accessToken: string }>("/auth/verify-otp", { code });
    setAccessToken(data.accessToken);
  }

  async function logout() {
    try {
      await api.post("/auth/logout");
    } finally {
      clearAuth();
      router.replace("/login");
    }
  }

  function redirectToDefaultRoute() {
    if (user) router.replace(getDefaultRouteForRole(user.role));
  }

  return {
    accessToken,
    user,
    isAuthenticated: Boolean(accessToken && user),
    login,
    verifyOtp,
    logout,
    redirectToDefaultRoute,
  };
}