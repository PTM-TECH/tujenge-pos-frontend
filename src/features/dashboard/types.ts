// features/dashboard/types.ts

// ---- Stat cards (top row) ----
export interface DashboardStat {
  value: number;
  changePct: number; // e.g. 12.4 means +12.4%, -5.2 means -5.2%
}

export interface OutstandingBalanceStat extends DashboardStat {
  partialPaymentAccounts: number; // "3 accounts with partial payments"
}

export interface DashboardStats {
  todaysRevenue: DashboardStat;
  transactions: DashboardStat;
  itemsSold: DashboardStat;
  outstandingBalance: OutstandingBalanceStat;
}

// ---- Annual Sales Performance (bar chart, Jan–Dec) ----
export interface AnnualRevenuePoint {
  month: string;   // "Jan", "Feb", ...
  revenue: number;
}

export interface AnnualPerformance {
  ytdTotal: number;       // "$244K YTD" badge
  data: AnnualRevenuePoint[];
}

// ---- Monthly Performance (line chart, weekly, revenue/balance/profit) ----
export interface WeeklyPerformancePoint {
  week: string;    // "Jun W1", "Jun W2", ...
  revenue: number;
  balance: number;
  profit: number;
}

// ---- Combined performance response ----
export interface DashboardPerformance {
  annual: AnnualPerformance;
  monthly: WeeklyPerformancePoint[];
}

// ---- Product categories grid ----
export interface ProductCategory {
  id: string;
  name: string;          // "Coffee", "Beverages", ...
  icon: string;           // icon key, TBD with backend
  productCount: number;   // "18 products"
  sold: number;           // "84 items sold"
  growthPct: number; 
}