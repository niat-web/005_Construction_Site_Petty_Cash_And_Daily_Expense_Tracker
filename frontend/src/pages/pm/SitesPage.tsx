import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../app/store';
import { fetchSitesThunk } from '../../features/sites/siteThunks';
import PageHeader from '../../components/common/PageHeader';
import SiteTable from '../../components/sites/SiteTable';
import Loader from '../../components/common/Loader';

export default function PMSitesPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { sites, loading } = useSelector((s: RootState) => s.sites);

  useEffect(() => { dispatch(fetchSitesThunk()); }, [dispatch]);

  return (
    <div className="space-y-6 fade-in">
      <PageHeader
        title="Project Sites"
        subtitle="Sites assigned to your project"
      />
      {loading ? <Loader /> : <SiteTable sites={sites} />}
    </div>
  );
}
