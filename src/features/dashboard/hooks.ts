// features/dashboard/hooks.ts
import { useQuery } from '@tanstack/react-query';
import { getDashboardStats, getDashboardPerformance, getProductCategories } from './api';

export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: getDashboardStats,
  });
}

export function useDashboardPerformance() {
  return useQuery({
    queryKey: ['dashboard', 'performance'],
    queryFn: getDashboardPerformance,
    refetchInterval: 30_000, // "LIVE" badge on Monthly Performance chart
  });
}

export function useProductCategories() {
  return useQuery({
    queryKey: ['dashboard', 'categories'],
    queryFn: getProductCategories,
  });
}