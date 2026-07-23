import { create } from "zustand";
import { jwtDecode } from "jwt-decode";
import type { Role } from "@/types";

export interface JwtPayload {
  id: string;
  name: string;
  email: string;
  role: Role;
  exp: number;
  iat: number;
}

interface AuthState {
  accessToken: string | null;
  user: JwtPayload | null;
  isHydrated: boolean;
  setAccessToken: (token: string) => void;
  clearAuth: () => void;
  setHydrated: (value: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  user: null,
  isHydrated: false,
  setAccessToken: (token) => {
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      set({ accessToken: token, user: decoded });
    } catch {
      set({ accessToken: null, user: null });
    }
  },
  clearAuth: () => set({ accessToken: null, user: null }),
  setHydrated: (value) => set({ isHydrated: value }),
}));

// Convenience selector for the current role, e.g. useRole() in components. 
export const useRole = (): Role | undefined => useAuthStore((s) => s.user?.role);