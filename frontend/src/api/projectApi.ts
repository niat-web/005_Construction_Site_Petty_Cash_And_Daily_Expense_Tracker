import api from './axios';

export interface Project {
  id: number;
  project_name: string;
  monthly_budget: number;
}

export type CreateProjectPayload = Omit<Project, 'id'>;

export const getProjectsApi = () => api.get<Project[]>('/projects/');
export const getProjectApi = (id: number) => api.get<Project>(`/projects/${id}`);
export const createProjectApi = (payload: CreateProjectPayload) => api.post<Project>('/projects/', payload);
export const updateProjectApi = (id: number, payload: Partial<CreateProjectPayload>) => api.put<Project>(`/projects/${id}`, payload);
export const deleteProjectApi = (id: number) => api.delete(`/projects/${id}`);
