import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../app/store';
import { fetchSitesThunk } from '../../features/sites/siteThunks';
import { fetchWeeklyReportThunk } from '../../features/reports/reportThunks';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/common/Button';
import WeeklySummaryCard from '../../components/reports/WeeklySummaryCard';
import Loader from '../../components/common/Loader';
import { getWeekRange } from '../../utils/dateUtils';

export default function PMReportsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { sites } = useSelector((s: RootState) => s.sites);
  const { weeklyReport, loading } = useSelector((s: RootState) => s.reports);
  const { start, end } = getWeekRange();
  const [params, setParams] = useState({ site_id: '', week_start: start, week_end: end });

  useEffect(() => { dispatch(fetchSitesThunk()); }, [dispatch]);

  const handleFetch = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(fetchWeeklyReportThunk({ 
      site_id: params.site_id ? Number(params.site_id) : undefined, 
      week_start: params.week_start, 
      week_end: params.week_end 
    }));
  };

  const set = (k: string, v: string) => setParams((p) => ({ ...p, [k]: v }));

  return (
    <div className="space-y-6 fade-in">
      <PageHeader title="Weekly Reports" subtitle="Analyse weekly cash flow and expenses across your project" />

      {/* Filter Form */}
      <div className="card max-w-2xl">
        <h3 className="text-sm font-semibold text-slate-700 mb-4">Generate Report</h3>
        <form onSubmit={handleFetch} className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
          <div>
            <label className="form-label">Site</label>
            <select className="form-select" value={params.site_id} onChange={(e) => set('site_id', e.target.value)}>
              <option value="">All Project Sites</option>
              {sites.map((s) => <option key={s.id} value={s.id}>{s.site_name}</option>)}
            </select>
          </div>
          <div>
            <label className="form-label">Week Start</label>
            <input type="date" className="form-input" value={params.week_start} onChange={(e) => set('week_start', e.target.value)} required />
          </div>
          <div>
            <label className="form-label">Week End</label>
            <input type="date" className="form-input" value={params.week_end} onChange={(e) => set('week_end', e.target.value)} required />
          </div>
          <Button type="submit" variant="primary" loading={loading}>Generate</Button>
        </form>
      </div>

      {loading && <Loader message="Generating report..." />}
      {weeklyReport && !loading && (
        <WeeklySummaryCard report={weeklyReport} weekStart={params.week_start} weekEnd={params.week_end} />
      )}
    </div>
  );
}
