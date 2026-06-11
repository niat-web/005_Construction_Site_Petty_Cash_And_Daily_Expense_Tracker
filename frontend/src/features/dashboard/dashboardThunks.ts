import { createAsyncThunk } from '@reduxjs/toolkit';
import { getDashboardApi } from '../../api/dashboardApi';
import type { RootState } from '../../app/store';

export const fetchDashboardThunk = createAsyncThunk(
  'dashboard/fetch',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const role = state.auth.role as 'admin' | 'project_manager' | 'supervisor';
      
      const res = await getDashboardApi(role);
      return res.data;
    } catch (err: unknown) {
      const e = err as { response?: { data?: { error?: string, msg?: string } } };
      return rejectWithValue(e.response?.data?.error || e.response?.data?.msg || 'Failed to fetch dashboard');
    }
  }
);
