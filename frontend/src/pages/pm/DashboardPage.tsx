import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../app/store';
import { fetchSitesThunk } from '../../features/sites/siteThunks';
import { fetchDashboardThunk } from '../../features/dashboard/dashboardThunks';
import { fetchExpensesThunk } from '../../features/expenses/expenseThunks';
import PageHeader from '../../components/common/PageHeader';
import StatsCard from '../../components/dashboard/StatsCard';
import BalanceCard from '../../components/dashboard/BalanceCard';
import CategoryChart from '../../components/dashboard/CategoryChart';
import Loader from '../../components/common/Loader';
import { formatCurrency } from '../../utils/formatCurrency';

export default function PMDashboardPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { sites } = useSelector((s: RootState) => s.sites);
  const { stats, loading } = useSelector((s: RootState) => s.dashboard);
  const { expenses } = useSelector((s: RootState) => s.expenses);

  useEffect(() => { 
    dispatch(fetchSitesThunk()); 
    dispatch(fetchExpensesThunk()); 
    dispatch(fetchDashboardThunk());
  }, [dispatch]);

  return (
    <div className="space-y-6 fade-in">
      <PageHeader title="Project Dashboard" subtitle="Overview of your assigned project" />

      {/* Global Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Total Sites" value={String(sites.length)} borderColor="border-amber-400"
          icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd"/></svg>}
        />
        <StatsCard title="Total Expenses" value={String(expenses.length)} borderColor="border-blue-400"
          icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/></svg>}
        />
        <StatsCard
          title="Today Issued"
          value={formatCurrency(stats?.today_issued || 0)}
          borderColor="border-green-400"
          icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z"/><path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9z" clipRule="evenodd"/></svg>}
        />
        <StatsCard
          title="Today Spent"
          value={formatCurrency(stats?.today_spent || 0)}
          borderColor="border-purple-400"
          icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm2 10a1 1 0 10-2 0v3a1 1 0 102 0v-3zm2-3a1 1 0 011 1v5a1 1 0 11-2 0v-5a1 1 0 011-1zm4-1a1 1 0 10-2 0v7a1 1 0 102 0V8z" clipRule="evenodd"/></svg>}
        />
      </div>

      {/* Site Dashboard */}
      {loading ? <Loader /> : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {stats && (
            <BalanceCard balance={stats.balance} totalIssued={stats.today_issued} totalSpent={stats.today_spent} />
          )}
          {stats?.categories && <CategoryChart data={stats.categories} />}
        </div>
      )}
    </div>
  );
}
