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

// --- Inventory ---

export const productSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  sku: z.string().min(2, "SKU is required"),
  description: z.string().optional(),
  category: z.string().min(1, "Select a category"),
  supplierId: z.string().min(1, "Select a supplier"),
  taxRuleId: z.string().nullable().optional(), // unused by the form for now, see note below
  taxRate: z.coerce.number().min(0).max(100),
  price: z.coerce.number().positive("Price must be greater than 0"),
  stock: z.coerce.number().int().min(0),
  lowStockThreshold: z.coerce.number().int().min(0),
});
export type ProductFormValues = z.infer<typeof productSchema>;

// --- Suppliers ---

export const supplierSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  category: z.string().min(1, "Select a category"),
  phone: z.string().min(7, "Enter a valid phone number"),
  email: z.string().email("Enter a valid email"),
  address: z.string().min(5, "Address is required"),
});
export type SupplierFormValues = z.infer<typeof supplierSchema>;

// --- Purchases ---

export const purchaseLineItemSchema = z.object({
  productId: z.string().min(1, "Select a product"),
  quantity: z.coerce.number().int().positive("Must be at least 1"),
  unitCost: z.coerce.number().positive("Must be greater than 0"),
});

export const purchaseSchema = z.object({
  supplierId: z.string().min(1, "Select a supplier"),
  date: z.string().min(1, "Date is required"),
  status: z.enum(["pending", "received", "cancelled"]),
  items: z.array(purchaseLineItemSchema).min(1, "Add at least one item"),
});
export type PurchaseFormValues = z.infer<typeof purchaseSchema>;