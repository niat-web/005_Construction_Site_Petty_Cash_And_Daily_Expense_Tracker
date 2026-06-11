import api from './axios';

export interface DashboardData {
  today_issued: number;
  today_spent: number;
  balance: number;
  categories: Record<string, number>;
}

export const getDashboardApi = (role: 'admin' | 'project_manager' | 'supervisor') => {
  if (role === 'admin') return api.get<DashboardData>('/dashboard/admin');
  if (role === 'project_manager') return api.get<DashboardData>('/dashboard/project');
  return api.get<DashboardData>('/dashboard/site');
};
