import React, { useState } from 'react';
import { changePasswordApi } from '../../api/authApi';
import PageHeader from '../../components/common/PageHeader';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

export default function ChangePasswordPage() {
  const [form, setForm] = useState({ old_password: '', new_password: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (form.new_password !== form.confirm) {
      setError('New passwords do not match.');
      return;
    }
    if (form.new_password.length < 6) {
      setError('New password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      await changePasswordApi({ old_password: form.old_password, new_password: form.new_password });
      setSuccess('Password changed successfully!');
      setForm({ old_password: '', new_password: '', confirm: '' });
    } catch (err: unknown) {
      const e2 = err as { response?: { data?: { msg?: string } } };
      setError(e2.response?.data?.msg || 'Failed to change password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 fade-in">
      <PageHeader title="Change Password" subtitle="Update your account password" />
      <div className="max-w-sm">
        <div className="card">
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-lg mb-4">
              ✓ {success}
            </div>
          )}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Current Password" type="password" value={form.old_password} onChange={(e) => set('old_password', e.target.value)} required />
            <Input label="New Password" type="password" value={form.new_password} onChange={(e) => set('new_password', e.target.value)} required />
            <Input label="Confirm New Password" type="password" value={form.confirm} onChange={(e) => set('confirm', e.target.value)} required />
            <Button type="submit" variant="primary" loading={loading} className="w-full">
              {loading ? 'Updating...' : 'Update Password'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
