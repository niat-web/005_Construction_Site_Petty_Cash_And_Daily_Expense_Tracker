import React, { useState } from 'react';
import Input from '../common/Input';
import Button from '../common/Button';
import type { Site } from '../../api/siteApi';
import { getTodayISO } from '../../utils/dateUtils';

interface CashIssuanceFormProps {
  sites: Site[];
  onSubmit: (data: { site_id: number; amount: number; issue_date: string }) => void;
  loading?: boolean;
}

export default function CashIssuanceForm({ sites, onSubmit, loading = false }: CashIssuanceFormProps) {
  const [form, setForm] = useState({ site_id: '', amount: '', issue_date: getTodayISO() });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.site_id) e.site_id = 'Select a site';

    if (!form.amount || isNaN(Number(form.amount)) || Number(form.amount) <= 0)
      e.amount = 'Enter a valid amount';
    return e;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    onSubmit({ site_id: Number(form.site_id), amount: Number(form.amount), issue_date: form.issue_date });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="form-label">Site <span className="text-red-500">*</span></label>
        <select className={`form-select ${errors.site_id ? 'border-red-400' : ''}`} value={form.site_id} onChange={(e) => set('site_id', e.target.value)}>
          <option value="">Select site...</option>
          {sites.map((s) => <option key={s.id} value={s.id}>{s.site_name} ({s.site_code})</option>)}
        </select>
        {errors.site_id && <p className="form-error">{errors.site_id}</p>}
      </div>

      <Input label="Amount (₹)" type="number" placeholder="e.g. 10000" value={form.amount} onChange={(e) => set('amount', e.target.value)} error={errors.amount} required />
      <Input label="Issue Date" type="date" value={form.issue_date} onChange={(e) => set('issue_date', e.target.value)} />
      <Button type="submit" variant="primary" loading={loading} className="w-full">
        {loading ? 'Issuing...' : 'Issue Cash'}
      </Button>
    </form>
  );
}
