import api from './axios';

export interface WeeklyReport {
  total_issued: number;
  total_spent: number;
  surplus: number;
  categories: Record<string, number>;
}

export interface WeeklyReportParams {
  site_id?: number;
  week_start: string;
  week_end: string;
}

export const getWeeklyReportApi = (params: WeeklyReportParams) =>
  api.get<WeeklyReport>('/reports/weekly', { 
    params: {
      site_id: params.site_id,
      start_date: params.week_start,
      end_date: params.week_end
    } 
  });
