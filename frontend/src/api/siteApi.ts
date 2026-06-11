import api from './axios';

export interface Site {
  id: number;
  project_id: number;
  site_name: string;
  site_code: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateSitePayload {
  project_id: number;
  site_name: string;
  site_code: string;
}

export const getAllSitesApi = () => api.get<Site[]>('/sites/');
export const getSiteApi = (id: number) => api.get<Site>(`/sites/${id}`);
export const createSiteApi = (payload: CreateSitePayload) =>
  api.post<Site>('/sites/', payload);
export const updateSiteApi = (id: number, payload: Partial<CreateSitePayload>) =>
  api.put<Site>(`/sites/${id}`, payload);
export const deleteSiteApi = (id: number) => api.delete(`/sites/${id}`);
