import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import siteReducer from '../features/sites/siteSlice';
import expenseReducer from '../features/expenses/expenseSlice';
import dashboardReducer from '../features/dashboard/dashboardSlice';
import reportReducer from '../features/reports/reportSlice';
import projectReducer from '../features/sites/projectSlice';
import userReducer from '../features/users/userSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    sites: siteReducer,
    expenses: expenseReducer,
    dashboard: dashboardReducer,
    reports: reportReducer,
    projects: projectReducer,
    users: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
