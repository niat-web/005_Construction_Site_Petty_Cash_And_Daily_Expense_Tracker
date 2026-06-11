import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { loginThunk } from './authThunks';
import { getToken, getRole, getSiteId, getProjectId } from '../../utils/auth';

interface AuthState {
  token: string | null;
  role: string | null;
  siteId: number | null;
  projectId: number | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  token: getToken(),
  role: getRole(),
  siteId: getSiteId(),
  projectId: getProjectId(),
  isAuthenticated: !!getToken(),
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.token = null;
      state.role = null;
      state.siteId = null;
      state.projectId = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.clear();
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action: PayloadAction<{
        token: string;
        role: string;
        siteId: number | null;
        projectId: number | null;
      }>) => {
        state.loading = false;
        state.token = action.payload.token;
        state.role = action.payload.role;
        state.siteId = action.payload.siteId;
        state.projectId = action.payload.projectId;
        state.isAuthenticated = true;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
