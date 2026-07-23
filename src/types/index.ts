
// single source of truth for cross-feature shapes.

export type Role = "SUPER_ADMIN" | "ADMIN" | "STAFF";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: "active" | "inactive";
  lastLogin: string | null;
  salesCount: number;
  avatarColor?: string;
}

export interface Supplier {
  id: string;
  name: string;
  category: string;
  phone: string;
  email: string;
  address: string;
  since: string;
  ordersCount: number;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  description?: string;
  category: string;
  supplierId: string;
  supplierName: string;
  taxRuleId: string | null;
  taxRate: number;
  price: number;
  stock: number;
  lowStockThreshold: number;
  rating?: number;
  imageUrl?: string;
}

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  taxRate: number;
}

export type PaymentMethod = "cash" | "card" | "mobile_money";
export type SaleStatus = "complete" | "refunded" | "pending";

export interface Sale {
  id: string;
  saleRef: string;
  createdAt: string;
  cashierId: string;
  cashierName: string;
  items: CartItem[];
  itemCount: number;
  method: PaymentMethod;
  status: SaleStatus;
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  amountPaid: number;
  balanceDue: number;
}

export type PurchaseStatus = "received" | "pending"| "cancelled";

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  date: string;
  supplierId: string;
  supplierName: string;
  contactName: string;
  itemsCount: number;
  total: number;
  status: PurchaseStatus;
}

export interface TaxRule {
  id: string;
  name: string;
  appliesTo: string; // category name, or "All"
  rate: number;
  effectiveDate: string;
  lastUpdated: string;
  updatedBy: string;
  active: boolean;
}

export interface DashboardStats {
  todaysRevenue: number;
  revenueChangePct: number;
  transactions: number;
  transactionsChangePct: number;
  itemsSold: number;
  itemsSoldChangePct: number;
  outstandingBalance: number;
  outstandingAccounts: number;
}

export interface CategorySummary {
  category: string;
  productCount: number;
  itemsSold: number;
  changePct: number;
}

export interface ApiError {
  message: string;
  statusCode?: number;
  errors?: Record<string, string[]>;
}