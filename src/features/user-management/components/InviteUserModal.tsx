"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { inviteUserSchema, type InviteUserFormValues } from "@/lib/validators";
import { ROLE_LABELS } from "@/lib/constants";
import type { Role } from "@/types";
import type { User } from "../types";

export interface InviteUserModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: InviteUserFormValues) => void;
  isSubmitting?: boolean;
  initialUser?: User | null;
}

const roleOptions = (Object.keys(ROLE_LABELS) as Role[]).map((value) => ({
  label: ROLE_LABELS[value],
  value,
}));

export function InviteUserModal({
  open,
  onClose,
  onSubmit,
  isSubmitting,
  initialUser,
}: InviteUserModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<InviteUserFormValues>({ resolver: zodResolver(inviteUserSchema) });

  useEffect(() => {
    if (open) {
      reset(
        initialUser
          ? { name: initialUser.name, email: initialUser.email, role: initialUser.role }
          : { name: "", email: "", role: "STAFF" }
      );
    }
  }, [open, initialUser, reset]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={initialUser ? "Edit User" : "Invite User"}
      description={
        initialUser
          ? "Update this user's details and role."
          : "Send an invitation to join the TujengePOS dashboard."
      }
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button form="invite-user-form" type="submit" isLoading={isSubmitting}>
            {initialUser ? "Save Changes" : "Send Invite"}
          </Button>
        </>
      }
    >
      <form id="invite-user-form" className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <Input
          label="Full Name"
          placeholder="e.g. Jane Doe"
          error={errors.name?.message}
          {...register("name")}
        />
        <Input
          label="Email Address"
          type="email"
          placeholder="jane@tujengepos.com"
          disabled={Boolean(initialUser)}
          hint={initialUser ? "Email can't be changed after invitation." : undefined}
          error={errors.email?.message}
          {...register("email")}
        />
        <Select
          label="Role"
          options={roleOptions}
          error={errors.role?.message}
          {...register("role")}
        />
      </form>
    </Modal>
  );
}