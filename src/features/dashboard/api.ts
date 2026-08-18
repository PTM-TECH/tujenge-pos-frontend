// features/dashboard/api.ts
import api from '@/lib/api-client';
import type { DashboardStats, DashboardPerformance, ProductCategory } from './types';

export async function getDashboardStats(): Promise<DashboardStats> {
  const { data } = await api.get<DashboardStats>('/dashboard/stats');
  return data;
}

export async function getDashboardPerformance(): Promise<DashboardPerformance> {
  const { data } = await api.get<DashboardPerformance>('/dashboard/performance');
  return data;
}

export async function getProductCategories(): Promise<ProductCategory[]> {
  const { data } = await api.get<ProductCategory[]>('/dashboard/product-categories');
  return data;
}