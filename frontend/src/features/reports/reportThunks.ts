import { createAsyncThunk } from '@reduxjs/toolkit';
import { getWeeklyReportApi } from '../../api/reportApi';
import type { WeeklyReportParams } from '../../api/reportApi';

export const fetchWeeklyReportThunk = createAsyncThunk(
  'reports/fetchWeekly',
  async (params: WeeklyReportParams, { rejectWithValue }) => {
    try {
      const res = await getWeeklyReportApi(params);
      return res.data;
    } catch (err: unknown) {
      const e = err as { response?: { data?: { error?: string } } };
      return rejectWithValue(e.response?.data?.error || 'Failed to fetch weekly report');
    }
  }
);
