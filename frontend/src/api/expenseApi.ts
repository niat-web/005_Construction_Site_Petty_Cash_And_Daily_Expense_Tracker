import api from './axios';
import type { ExpenseCategory } from '../utils/constants';

export interface Expense {
  id: number;
  cash_issuance_id: number;
  category: ExpenseCategory;
  amount: number;
  description?: string;
  receipt_url?: string;
  expense_time: string;
}

export interface CreateExpensePayload {
  cash_issuance_id: number;
  category: ExpenseCategory;
  amount: number;
  description?: string;
  receipt_url?: string;
  expense_time?: string;
}

// Admins, PMs, and Supervisors all use this endpoint. It filters correctly in backend.
export const getExpensesApi = (site_id?: number) =>
  api.get<Expense[]>('/expenses/', { params: site_id ? { site_id } : undefined });

export const getExpenseApi = (id: number) =>
  api.get<Expense>(`/expenses/${id}`);

export const createExpenseApi = (payload: CreateExpensePayload) =>
  api.post<{ expense: Expense; negative_balance?: boolean; message?: string; current_balance?: number }>('/expenses/', payload);

export const updateExpenseApi = (id: number, payload: Partial<CreateExpensePayload>) =>
  api.put<{ expense: Expense; negative_balance?: boolean; message?: string; current_balance?: number }>(`/expenses/${id}`, payload);

export const deleteExpenseApi = (id: number) =>
  api.delete(`/expenses/${id}`);

export const uploadReceiptApi = (file: File) => {
  const formData = new FormData();
  formData.append('receipt', file);
  return api.post<{ url: string }>('/upload-receipt', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};
