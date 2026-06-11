import api from './axios';

export interface CashIssuance {
  id: number;
  site_id: number;
  issued_by: number | null;
  amount: number;
  issue_date: string;
}

export interface CreateIssuancePayload {
  site_id: number;
  amount: number;
  issue_date?: string;
}

export interface IssuanceFilters {
  site_id?: number;
  from_date?: string;
  to_date?: string;
}

export const getIssuancesApi = (filters?: IssuanceFilters) =>
  api.get<CashIssuance[]>('/cash-issuances/', { params: filters });

export const getIssuanceApi = (id: number) =>
  api.get<CashIssuance>(`/cash-issuances/${id}`);

export const createIssuanceApi = (payload: CreateIssuancePayload) =>
  api.post<CashIssuance>('/cash-issuances/', payload);

export const updateIssuanceApi = (id: number, payload: Partial<CreateIssuancePayload>) =>
  api.put(`/cash-issuances/${id}`, payload);

export const deleteIssuanceApi = (id: number) =>
  api.delete(`/cash-issuances/${id}`);
