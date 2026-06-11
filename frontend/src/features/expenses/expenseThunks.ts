import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  getExpensesApi,
  getExpenseApi,
  createExpenseApi,
  updateExpenseApi,
  deleteExpenseApi,
} from '../../api/expenseApi';
import type { CreateExpensePayload } from '../../api/expenseApi';

export const fetchExpensesThunk = createAsyncThunk(
  'expenses/fetchAll',
  async (siteId: number | undefined, { rejectWithValue }) => {
    try {
      const response = await getExpensesApi(siteId);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.msg || 'Failed to fetch expenses');
    }
  }
);

export const fetchExpenseThunk = createAsyncThunk(
  'expenses/fetchOne',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await getExpenseApi(id);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.msg || 'Failed to fetch expense');
    }
  }
);

export const createExpenseThunk = createAsyncThunk(
  'expenses/create',
  async (payload: CreateExpensePayload, { rejectWithValue }) => {
    try {
      const response = await createExpenseApi(payload);
      return {
        expense: response.data.expense,
        negativeBalance: response.data.negative_balance || false,
        balance: response.data.current_balance || 0,
      };
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.msg || 'Failed to add expense');
    }
  }
);

export const updateExpenseThunk = createAsyncThunk(
  'expenses/update',
  async (
    { id, payload }: { id: number; payload: Partial<CreateExpensePayload> },
    { rejectWithValue }
  ) => {
    try {
      const response = await updateExpenseApi(id, payload);
      return {
        expense: response.data.expense,
        negativeBalance: response.data.negative_balance || false,
        balance: response.data.current_balance || 0,
      };
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.msg || 'Failed to update expense');
    }
  }
);

export const deleteExpenseThunk = createAsyncThunk(
  'expenses/delete',
  async (id: number, { rejectWithValue }) => {
    try {
      await deleteExpenseApi(id);
      return id;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.msg || 'Failed to delete expense');
    }
  }
);
