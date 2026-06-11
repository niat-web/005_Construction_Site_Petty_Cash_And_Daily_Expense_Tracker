import React, { useState } from 'react';
import Input from '../common/Input';
import Button from '../common/Button';
import type { Site } from '../../api/siteApi';
import type { Project } from '../../api/projectApi';

interface SiteFormProps {
  projects: Project[];
  onSubmit: (data: { project_id: number; site_name: string; site_code: string }) => void;
  loading?: boolean;
  initialData?: Site;
}

export default function SiteForm({ projects, onSubmit, loading = false, initialData }: SiteFormProps) {
  const [form, setForm] = useState({
    project_id: initialData?.project_id ? String(initialData.project_id) : '',
    site_name: initialData?.site_name || '',
    site_code: initialData?.site_code || '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.project_id) e.project_id = 'Project is required';
    if (!form.site_name.trim()) e.site_name = 'Site name is required';
    if (!form.site_code.trim()) e.site_code = 'Site code is required';
    return e;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    onSubmit({ 
      project_id: Number(form.project_id), 
      site_name: form.site_name, 
      site_code: form.site_code.toUpperCase() 
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="form-label">Project <span className="text-red-500">*</span></label>
        <select 
          className={`form-select ${errors.project_id ? 'border-red-400' : ''}`} 
          value={form.project_id} 
          onChange={(e) => set('project_id', e.target.value)}
        >
          <option value="">Select Project...</option>
          {projects.map((p) => <option key={p.id} value={p.id}>{p.project_name}</option>)}
        </select>
        {errors.project_id && <p className="form-error">{errors.project_id}</p>}
      </div>

      <Input 
        label="Site Name" 
        placeholder="e.g. Tower A" 
        value={form.site_name} 
        onChange={(e) => set('site_name', e.target.value)} 
        error={errors.site_name} 
        required 
      />
      
      <Input 
        label="Site Code" 
        placeholder="e.g. SITE001" 
        value={form.site_code} 
        onChange={(e) => set('site_code', e.target.value.toUpperCase())} 
        error={errors.site_code} 
        required 
        disabled={!!initialData} 
      />
      
      <Button type="submit" variant="primary" loading={loading} className="w-full">
        {loading ? 'Saving...' : (initialData ? 'Update Site' : 'Create Site')}
      </Button>
    </form>
  );
}
