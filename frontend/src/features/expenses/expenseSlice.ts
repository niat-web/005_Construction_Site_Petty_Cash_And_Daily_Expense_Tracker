import { createSlice } from '@reduxjs/toolkit';
import type { Expense } from '../../api/expenseApi';
import {
  fetchExpensesThunk, createExpenseThunk,
  updateExpenseThunk, deleteExpenseThunk
} from './expenseThunks';

interface ExpenseState {
  expenses: Expense[];
  selectedExpense: Expense | null;
  loading: boolean;
  error: string | null;
  negativeBalanceWarning: { active: boolean; balance: number };
}

const initialState: ExpenseState = {
  expenses: [],
  selectedExpense: null,
  loading: false,
  error: null,
  negativeBalanceWarning: { active: false, balance: 0 },
};

const expenseSlice = createSlice({
  name: 'expenses',
  initialState,
  reducers: {
    setSelectedExpense(state, action) {
      state.selectedExpense = action.payload;
    },
    clearWarning(state) {
      state.negativeBalanceWarning = { active: false, balance: 0 };
    },
    clearExpenseError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchExpensesThunk.pending, (state) => { state.loading = true; })
      .addCase(fetchExpensesThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.expenses = action.payload;
      })
      .addCase(fetchExpensesThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(createExpenseThunk.fulfilled, (state, action) => {
        state.expenses.unshift(action.payload.expense);
        if (action.payload.negativeBalance) {
          state.negativeBalanceWarning = { active: true, balance: action.payload.balance };
        }
      })
      .addCase(updateExpenseThunk.fulfilled, (state, action) => {
        const idx = state.expenses.findIndex((e) => e.id === action.payload.expense.id);
        if (idx !== -1) state.expenses[idx] = action.payload.expense;
      })
      .addCase(deleteExpenseThunk.fulfilled, (state, action) => {
        state.expenses = state.expenses.filter((e) => e.id !== action.payload);
      });
  },
});

export const { setSelectedExpense, clearWarning, clearExpenseError } = expenseSlice.actions;
export default expenseSlice.reducer;
