import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../app/store';
import { fetchSiteThunk } from '../../features/sites/siteThunks';
import PageHeader from '../../components/common/PageHeader';
import Loader from '../../components/common/Loader';

export default function MySitePage() {
  const dispatch = useDispatch<AppDispatch>();
  const { currentSite, loading } = useSelector((s: RootState) => s.sites);
  const { siteId } = useSelector((s: RootState) => s.auth);

  useEffect(() => { 
    if (siteId) dispatch(fetchSiteThunk(siteId)); 
  }, [dispatch, siteId]);

  if (loading) return <Loader />;
  if (!currentSite) return <div className="text-slate-400 text-sm py-8">Site not found.</div>;

  return (
    <div className="space-y-6 fade-in">
      <PageHeader title="My Site" subtitle="Details of your assigned construction site" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
        <InfoCard label="Site Name" value={currentSite.site_name} />
        <InfoCard label="Site Code" value={currentSite.site_code} mono />
        <InfoCard label="Project ID" value={`#${currentSite.project_id}`} />
        <InfoCard label="Created At" value={new Date(currentSite.created_at || '').toLocaleDateString()} />
      </div>
    </div>
  );
}

function InfoCard({ label, value, mono = false, highlight = false }: { label: string; value: string; mono?: boolean; highlight?: boolean }) {
  return (
    <div className="card">
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">{label}</p>
      <p className={`text-xl font-bold ${mono ? 'font-mono text-slate-600' : ''} ${highlight ? 'text-amber-600' : 'text-slate-800'}`}>
        {value}
      </p>
    </div>
  );
}
