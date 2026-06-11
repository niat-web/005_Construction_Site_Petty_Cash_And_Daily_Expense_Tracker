import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../app/store';
import { fetchDashboardThunk } from '../../features/dashboard/dashboardThunks';
import { fetchExpensesThunk } from '../../features/expenses/expenseThunks';
import Loader from '../../components/common/Loader';
import PageHeader from '../../components/common/PageHeader';
import StatsCard from '../../components/dashboard/StatsCard';
import BalanceCard from '../../components/dashboard/BalanceCard';
import CategoryChart from '../../components/dashboard/CategoryChart';
import ExpenseTable from '../../components/expenses/ExpenseTable';
import { formatCurrency } from '../../utils/formatCurrency';

export default function SupervisorDashboardPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { stats, loading } = useSelector((s: RootState) => s.dashboard);
  const { expenses } = useSelector((s: RootState) => s.expenses);

  useEffect(() => {
    dispatch(fetchDashboardThunk());
    dispatch(fetchExpensesThunk());
  }, [dispatch]);

  if (loading) return <Loader message="Loading dashboard..." />;

  return (
    <div className="space-y-6 fade-in">
      <PageHeader
        title="My Dashboard"
        subtitle="Today's petty cash summary for your site"
      />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Today Issued"
          value={formatCurrency(stats?.today_issued || 0)}
          borderColor="border-amber-400"
          icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z"/><path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd"/></svg>}
        />
        <StatsCard
          title="Today Spent"
          value={formatCurrency(stats?.today_spent || 0)}
          borderColor="border-blue-400"
          icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/></svg>}
        />
        <StatsCard
          title="Balance"
          value={formatCurrency(stats?.balance || 0)}
          borderColor={stats?.balance !== undefined && stats.balance < 0 ? 'border-red-400' : 'border-green-400'}
          valueColor={stats?.balance !== undefined && stats.balance < 0 ? 'text-red-500' : 'text-green-600'}
          icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/></svg>}
        />
        <StatsCard
          title="Expenses Today"
          value={String(expenses.length)}
          borderColor="border-purple-400"
          icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm2 10a1 1 0 10-2 0v3a1 1 0 102 0v-3zm2-3a1 1 0 011 1v5a1 1 0 11-2 0v-5a1 1 0 011-1zm4-1a1 1 0 10-2 0v7a1 1 0 102 0V8z" clipRule="evenodd"/></svg>}
        />
      </div>

      {/* Balance + Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {stats && (
          <BalanceCard
            balance={stats.balance}
            totalIssued={stats.today_issued}
            totalSpent={stats.today_spent}
          />
        )}
        {stats?.categories && <CategoryChart data={stats.categories} />}
      </div>

      {/* Recent Expenses */}
      <div>
        <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Recent Expenses</h2>
        <ExpenseTable expenses={expenses.slice(0, 5)} showActions={false} />
      </div>
    </div>
  );
}
