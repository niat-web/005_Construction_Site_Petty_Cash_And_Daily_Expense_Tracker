import api from './axios';

export interface User {
  id: number;
  name: string;
  username: string;
  role: string;
  project_id: number | null;
  site_id: number | null;
}

export interface CreatePMUserPayload {
  name: string;
  username: string;
  password?: string;
  project_id: number;
}

export interface CreateSupervisorUserPayload {
  name: string;
  username: string;
  password?: string;
  site_id: number;
}

export const getUsersApi = () => api.get<User[]>('/users/');
export const createPMApi = (payload: CreatePMUserPayload) => api.post<User>('/users/project-manager', payload);
export const createSupervisorApi = (payload: CreateSupervisorUserPayload) => api.post<User>('/users/supervisor', payload);
export const updateUserApi = (id: number, payload: Partial<User & { password?: string }>) => api.put<User>(`/users/${id}`, payload);
export const deleteUserApi = (id: number) => api.delete(`/users/${id}`);
