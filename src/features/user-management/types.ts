import type { User, Role } from "@/types";

export type { User };

export interface UpdateUserPayload {
  role?: Role;
  status?: "active" | "inactive";
}