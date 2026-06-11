import { createSlice } from '@reduxjs/toolkit';
import type { WeeklyReport } from '../../api/reportApi';
import { fetchWeeklyReportThunk } from './reportThunks';

interface ReportState {
  weeklyReport: WeeklyReport | null;
  loading: boolean;
  error: string | null;
}

const initialState: ReportState = {
  weeklyReport: null,
  loading: false,
  error: null,
};

const reportSlice = createSlice({
  name: 'reports',
  initialState,
  reducers: { clearReport(state) { state.weeklyReport = null; } },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWeeklyReportThunk.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchWeeklyReportThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.weeklyReport = action.payload;
      })
      .addCase(fetchWeeklyReportThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearReport } = reportSlice.actions;
export default reportSlice.reducer;
