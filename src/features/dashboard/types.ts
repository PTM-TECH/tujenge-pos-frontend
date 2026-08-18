export interface DashboardStat {
  value: number;
  changePct: number;
}

export interface OutstandingBalanceStat extends DashboardStat {
  partialPaymentAccounts: number; 
}

export interface DashboardStats {
  todaysRevenue: DashboardStat;
  transactions: DashboardStat;
  itemsSold: DashboardStat;
  outstandingBalance: OutstandingBalanceStat;
}

export interface AnnualRevenuePoint {
  month: string;  
  revenue: number;
}

export interface AnnualPerformance {
  ytdTotal: number;       
  data: AnnualRevenuePoint[];
}


export interface WeeklyPerformancePoint {
  week: string;    
  revenue: number;
  balance: number;
  profit: number;
}


export interface DashboardPerformance {
  annual: AnnualPerformance;
  monthly: WeeklyPerformancePoint[];
}


export interface ProductCategory {
  id: string;
  name: string;          
  icon: string;           
  productCount: number;   
  sold: number;           
  growthPct: number;      
}


export interface OutstandingBalance {
  id: string;
  customerName: string;
  saleRef: string;       
  date: string;           
  saleTotal: number;
  paid: number;
  balanceDue: number;
}