import type MockAdapter from "axios-mock-adapter";

const STATS = {
  todaysRevenue: { value: 3847.25, changePct: 12.4 },
  transactions: { value: 142, changePct: 8.1 },
  itemsSold: { value: 389, changePct: 5.7 },
  outstandingBalance: { value: 255.75, changePct: -3, partialPaymentAccounts: 3 },
};

const ANNUAL_PERFORMANCE = {
  ytdTotal: 244000,
  data: [
    { month: "Jan", revenue: 22000 },
    { month: "Feb", revenue: 24000 },
    { month: "Mar", revenue: 26000 },
    { month: "Apr", revenue: 29000 },
    { month: "May", revenue: 31000 },
    { month: "Jun", revenue: 34000 },
    { month: "Jul", revenue: 36000 },
    { month: "Aug", revenue: 38000 },
    { month: "Sep", revenue: 40000 },
    { month: "Oct", revenue: 42000 },
    { month: "Nov", revenue: 44000 },
    { month: "Dec", revenue: 46000 },
  ],
};

const MONTHLY_PERFORMANCE = [
  { week: "Jun W1", revenue: 8500, balance: 9000, profit: 8800 },
  { week: "Jun W2", revenue: 10200, balance: 9500, profit: 9800 },
  { week: "Jun W3", revenue: 9600, balance: 9800, profit: 9200 },
  { week: "Jun W4", revenue: 11800, balance: 10500, profit: 10900 },
  { week: "Jul W1", revenue: 11200, balance: 10800, profit: 10600 },
  { week: "Jul W2", revenue: 12500, balance: 11200, profit: 11800 },
  { week: "Jul W3", revenue: 12100, balance: 11600, profit: 11500 },
  { week: "Jul W4", revenue: 13400, balance: 12000, profit: 12800 },
];

const PRODUCT_CATEGORIES = [
  { id: "coffee", name: "Coffee", icon: "coffee", productCount: 18, sold: 84, growthPct: 14 },
  { id: "beverages", name: "Beverages", icon: "cup-soda", productCount: 12, sold: 52, growthPct: 8 },
  { id: "tea", name: "Tea", icon: "leaf", productCount: 9, sold: 37, growthPct: 22 },
  { id: "equipment", name: "Equipment", icon: "settings", productCount: 24, sold: 11, growthPct: 3 },
];

export function registerDashboardMocks(mock: MockAdapter) {
  mock.onGet("/dashboard/stats").reply(() => {
    return [200, STATS];
  });

  mock.onGet("/dashboard/performance").reply(() => {
    return [
      200,
      {
        annual: ANNUAL_PERFORMANCE,
        monthly: MONTHLY_PERFORMANCE,
      },
    ];
  });

  // Not in the confirmed task table's two endpoints, but shown in the
  // screenshot — mocked separately so it's easy to drop if unneeded.
  mock.onGet("/dashboard/product-categories").reply(() => {
    return [200, PRODUCT_CATEGORIES];
  });
}