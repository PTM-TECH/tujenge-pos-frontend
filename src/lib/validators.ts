import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});
export type LoginFormValues = z.infer<typeof loginSchema>;

export const forgotPasswordSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email address"),
});
export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export const otpSchema = z.object({
  code: z.string().length(6, "Enter the 6-digit code"),
});
export type OtpFormValues = z.infer<typeof otpSchema>;

export const inviteUserSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Enter a valid email address"),
  role: z.enum(["SUPER_ADMIN", "ADMIN", "STAFF"]),
});
export type InviteUserFormValues = z.infer<typeof inviteUserSchema>;

export const taxRuleSchema = z.object({
  name: z.string().min(2, "Rule name is required"),
  appliesTo: z.string().min(1, "Select a category"),
  rate: z.coerce.number().min(0, "Rate cannot be negative").max(100, "Rate cannot exceed 100%"),
  effectiveDate: z.string().min(1, "Effective date is required"),
  active: z.boolean().default(true),
});
export type TaxRuleFormValues = z.infer<typeof taxRuleSchema>;