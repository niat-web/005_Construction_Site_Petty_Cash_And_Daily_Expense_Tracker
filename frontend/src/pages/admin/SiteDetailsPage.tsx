import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../app/store';
import { fetchSiteThunk, updateSiteThunk } from '../../features/sites/siteThunks';
import PageHeader from '../../components/common/PageHeader';
import SiteForm from '../../components/sites/SiteForm';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import { formatCurrency } from '../../utils/formatCurrency';

export default function SiteDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { currentSite, loading } = useSelector((s: RootState) => s.sites);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (id) dispatch(fetchSiteThunk(Number(id)));
  }, [id, dispatch]);

  const handleUpdate = async (data: { project_name: string; site_code: string; pm_name: string; monthly_budget: number }) => {
    setSaving(true);
    await dispatch(updateSiteThunk({ id: Number(id), payload: data }));
    setSaving(false);
    setEditing(false);
  };

  if (loading) return <Loader />;
  if (!currentSite) return <div className="text-slate-400">Site not found.</div>;

  return (
    <div className="space-y-6 fade-in">
      <div className="flex items-center gap-3">
        <Button variant="ghost" onClick={() => navigate(-1)} className="text-sm">← Back</Button>
      </div>
      <PageHeader
        title={currentSite.project_name}
        subtitle={`Site Code: ${currentSite.site_code}`}
        action={!editing ? <Button variant="outline" onClick={() => setEditing(true)}>Edit Site</Button> : undefined}
      />

      {editing ? (
        <div className="max-w-xl">
          <div className="card">
            <SiteForm onSubmit={handleUpdate} loading={saving} initialData={currentSite} />
            <Button variant="ghost" onClick={() => setEditing(false)} className="w-full mt-3">Cancel</Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
          {[
            { label: 'Project Name', value: currentSite.project_name },
            { label: 'Site Code', value: currentSite.site_code, mono: true },
            { label: 'Project Manager', value: currentSite.pm_name },
            { label: 'Monthly Budget', value: formatCurrency(currentSite.monthly_budget), highlight: true },
          ].map(({ label, value, mono, highlight }) => (
            <div key={label} className="card">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">{label}</p>
              <p className={`text-xl font-bold ${mono ? 'font-mono text-slate-600' : ''} ${highlight ? 'text-amber-600' : 'text-slate-800'}`}>{value}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
