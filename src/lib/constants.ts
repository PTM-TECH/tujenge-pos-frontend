export const APP_NAME = "TujengePOS";
export const APP_TAGLINE = "Point of Sale · v4.2";

export const PRODUCT_CATEGORIES = [
  "electronics",
  "Beverages",
  "Tea",
  "Equipment",
  "Syrups",
  "Snacks",
  "Merch",
  "Accessories",
] as const;

export const ROLE_LABELS: Record<string, string> = {
  SUPER_ADMIN: "Super Admin",
  ADMIN: "Admin",
  STAFF: "Staff",
};

export const PAYMENT_METHOD_LABELS: Record<string, string> = {
  cash: "Cash",
  card: "Card",
  mobile_money: "M-pesa",
};

export const DEFAULT_TAX_RATE = 16;
export const DEFAULT_CURRENCY = "KES";