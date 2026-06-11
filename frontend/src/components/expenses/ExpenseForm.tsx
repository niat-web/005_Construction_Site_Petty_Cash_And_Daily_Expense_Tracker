import React, { useState } from 'react';
import Input from '../common/Input';
import Button from '../common/Button';
import ReceiptUpload from './ReceiptUpload';
import { EXPENSE_CATEGORIES } from '../../utils/constants';
import type { ExpenseCategory } from '../../utils/constants';
import type { CashIssuance } from '../../api/cashApi';
import type { Expense } from '../../api/expenseApi';
import { getTodayISO } from '../../utils/dateUtils';

interface ExpenseFormProps {
  issuances: CashIssuance[];
  onSubmit: (data: {
    cash_issuance_id: number;
    category: ExpenseCategory;
    amount: number;
    description: string;
    receipt_url: string;
    expense_time: string;
  }) => void;
  loading?: boolean;
  initialData?: Expense | null;
}

export default function ExpenseForm({ issuances, onSubmit, loading = false, initialData }: ExpenseFormProps) {
  const [form, setForm] = useState({
    cash_issuance_id: initialData?.cash_issuance_id ? String(initialData.cash_issuance_id) : '',
    category: (initialData?.category || '') as ExpenseCategory | '',
    amount: initialData?.amount ? String(initialData.amount) : '',
    description: initialData?.description || '',
    receipt_url: initialData?.receipt_url || '',
    expense_time: getTodayISO(),
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = (key: string, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.cash_issuance_id) e.cash_issuance_id = 'Select an issuance';
    if (!form.category) e.category = 'Select a category';
    if (!form.amount || isNaN(Number(form.amount)) || Number(form.amount) <= 0)
      e.amount = 'Enter a valid amount';
    return e;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    onSubmit({
      cash_issuance_id: Number(form.cash_issuance_id),
      category: form.category as ExpenseCategory,
      amount: Number(form.amount),
      description: form.description,
      receipt_url: form.receipt_url,
      expense_time: form.expense_time + ' 00:00:00',
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="form-label">Cash Issuance <span className="text-red-500">*</span></label>
        <select
          className={`form-select ${errors.cash_issuance_id ? 'border-red-400' : ''}`}
          value={form.cash_issuance_id}
          onChange={(e) => set('cash_issuance_id', e.target.value)}
        >
          <option value="">Select issuance...</option>
          {issuances.map((i) => (
            <option key={i.id} value={i.id}>
              ₹{i.amount.toLocaleString('en-IN')} — Issued on {i.issue_date}
            </option>
          ))}
        </select>
        {errors.cash_issuance_id && <p className="form-error">{errors.cash_issuance_id}</p>}
      </div>

      <div>
        <label className="form-label">Category <span className="text-red-500">*</span></label>
        <select
          className={`form-select ${errors.category ? 'border-red-400' : ''}`}
          value={form.category}
          onChange={(e) => set('category', e.target.value)}
        >
          <option value="">Select category...</option>
          {EXPENSE_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        {errors.category && <p className="form-error">{errors.category}</p>}
      </div>

      <Input
        label="Amount (₹)"
        type="number"
        placeholder="e.g. 1500"
        value={form.amount}
        onChange={(e) => set('amount', e.target.value)}
        error={errors.amount}
        required
      />

      <div>
        <label className="form-label">Description</label>
        <textarea
          className="form-input resize-none"
          rows={2}
          placeholder="Brief description of the expense..."
          value={form.description}
          onChange={(e) => set('description', e.target.value)}
        />
      </div>

      <Input
        label="Expense Date"
        type="date"
        value={form.expense_time}
        onChange={(e) => set('expense_time', e.target.value)}
      />

      <ReceiptUpload value={form.receipt_url} onChange={(url) => set('receipt_url', url)} />

      <Button type="submit" variant="primary" loading={loading} className="w-full">
        {loading ? 'Saving...' : (initialData ? 'Update Expense' : 'Add Expense')}
      </Button>
    </form>
  );
}
