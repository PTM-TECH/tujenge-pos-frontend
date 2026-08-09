import { api } from "@/lib/api-client";
import type { InviteUserFormValues } from "@/lib/validators";
import type { User, UpdateUserPayload } from "./types";

export async function fetchUsers(): Promise<User[]> {
  const { data } = await api.get<User[]>("/users");
  return data;
}

export async function inviteUser(payload: InviteUserFormValues): Promise<User> {
  const { data } = await api.post<User>("/users/invite", payload);
  return data;
}

export async function updateUser(id: string, payload: UpdateUserPayload): Promise<User> {
  const { data } = await api.patch<User>(`/users/${id}`, payload);
  return data;
}

export async function deleteUser(id: string): Promise<void> {
  await api.delete(`/users/${id}`);
}