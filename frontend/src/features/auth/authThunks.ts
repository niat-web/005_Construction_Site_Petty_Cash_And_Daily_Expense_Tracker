import { createAsyncThunk } from '@reduxjs/toolkit';
import { loginApi } from '../../api/authApi';
import type { LoginPayload } from '../../api/authApi';
import { setToken, setRole, setSiteId, setProjectId } from '../../utils/auth';

export const loginThunk = createAsyncThunk(
  'auth/login',
  async (payload: LoginPayload, { rejectWithValue }) => {
    try {
      const response = await loginApi(payload);
      const { access_token, role, site_id, project_id } = response.data;
      setToken(access_token);
      setRole(role);
      setSiteId(site_id !== undefined ? site_id : null);
      setProjectId(project_id !== undefined ? project_id : null);
      return { token: access_token, role, siteId: site_id, projectId: project_id };
    } catch (err: unknown) {
      const error = err as { response?: { data?: { msg?: string } } };
      return rejectWithValue(
        error.response?.data?.msg || 'Login failed. Check credentials.'
      );
    }
  }
);
