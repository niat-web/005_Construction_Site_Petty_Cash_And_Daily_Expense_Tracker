import api from './axios';

export interface DashboardData {
  today_issued?: number;
  today_spent?: number;
  issued_today?: number;
  spent_today?: number;
  total_cash_issued?: number;
  total_spent?: number;
  issued?: number;
  spent?: number;
  balance: number;
  categories?: Record<string, number>;
  total_projects?: number;
  total_sites?: number;
  project_name?: string;
  site_name?: string;
}

export const getDashboardApi = (role: 'admin' | 'project_manager' | 'supervisor') => {
  if (role === 'admin') return api.get<DashboardData>('/dashboard/admin');
  if (role === 'project_manager') return api.get<DashboardData>('/dashboard/project');
  return api.get<DashboardData>('/dashboard/site');
};
