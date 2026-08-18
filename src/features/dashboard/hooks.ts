import { useQuery } from '@tanstack/react-query';
import {
  getDashboardStats,
  getDashboardPerformance,
  getProductCategories,
  getOutstandingBalances,
} from './api';

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
    refetchInterval: 30_000, 
  });
}

export function useProductCategories() {
  return useQuery({
    queryKey: ['dashboard', 'categories'],
    queryFn: getProductCategories,
  });
}

export function useOutstandingBalances() {
  return useQuery({
    queryKey: ['dashboard', 'outstanding-balances'],
    queryFn: getOutstandingBalances,
  });
}