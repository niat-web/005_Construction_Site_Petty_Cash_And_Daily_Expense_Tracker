// API Base URL - API_URL is exposed through Vite's envPrefix in vite.config.ts.
export const API_BASE_URL =
  import.meta.env.API_URL || import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Expense categories
export const EXPENSE_CATEGORIES = [
  'Labour',
  'Material',
  'Tools',
  'Transport',
  'Food',
  'Misc',
] as const;

export type ExpenseCategory = typeof EXPENSE_CATEGORIES[number];

// Category colors for charts
export const CATEGORY_COLORS: Record<string, string> = {
  Labour: '#f59e0b',
  Material: '#3b82f6',
  Tools: '#8b5cf6',
  Transport: '#10b981',
  Food: '#f97316',
  Misc: '#94a3b8',
};

// Badge styles per category
export const CATEGORY_BADGE_STYLES: Record<string, string> = {
  Labour: 'badge-amber',
  Material: 'badge-blue',
  Tools: 'badge-purple',
  Transport: 'badge-green',
  Food: 'bg-orange-100 text-orange-700 badge',
  Misc: 'badge-gray',
};

export const USER_ROLES = {
  ADMIN: 'admin',
  PROJECT_MANAGER: 'project_manager',
  SUPERVISOR: 'supervisor',
} as const;
