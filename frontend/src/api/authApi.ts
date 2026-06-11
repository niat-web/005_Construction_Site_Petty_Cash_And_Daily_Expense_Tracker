import api from './axios';

export interface LoginPayload {
  username: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  role: string;
  site_id: number | null;
  project_id: number | null;
}

export const loginApi = (payload: LoginPayload) =>
  api.post<LoginResponse>('/auth/login', payload);

export const changePasswordApi = (payload: {
  old_password: string;
  new_password: string;
}) => api.post('/auth/change-password', payload);
