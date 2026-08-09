"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { fetchUsers, inviteUser, updateUser, deleteUser } from "./api";
import type { InviteUserFormValues } from "@/lib/validators";
import type { UpdateUserPayload } from "./types";
import { useUiStore } from "@/store/uiStore";

const USERS_KEY = ["users"];

export function useUsers() {
  return useQuery({ queryKey: USERS_KEY, queryFn: fetchUsers });
}

export function useInviteUser() {
  const queryClient = useQueryClient();
  const showToast = useUiStore((s) => s.showToast);
  return useMutation({
    mutationFn: (payload: InviteUserFormValues) => inviteUser(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USERS_KEY });
      showToast({ title: "Invitation sent", variant: "success" });
    },
    onError: (err: unknown) => {
      const message = isAxiosError(err) && err.response?.data?.message
        ? err.response.data.message
        : "Could not invite user";
      showToast({ title: message, variant: "error" });
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  const showToast = useUiStore((s) => s.showToast);
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateUserPayload }) =>
      updateUser(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USERS_KEY });
    },
    onError: () => showToast({ title: "Could not update user", variant: "error" }),
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  const showToast = useUiStore((s) => s.showToast);
  return useMutation({
    mutationFn: (id: string) => deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USERS_KEY });
      showToast({ title: "User removed", variant: "success" });
    },
    onError: () => showToast({ title: "Could not remove user", variant: "error" }),
  });
}