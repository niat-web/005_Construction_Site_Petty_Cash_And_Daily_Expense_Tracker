import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../app/store';
import { fetchExpensesThunk } from '../../features/expenses/expenseThunks';
import PageHeader from '../../components/common/PageHeader';
import ExpenseTable from '../../components/expenses/ExpenseTable';
import Loader from '../../components/common/Loader';

export default function PMExpensesPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { expenses, loading } = useSelector((s: RootState) => s.expenses);

  useEffect(() => {
    dispatch(fetchExpensesThunk());
  }, [dispatch]);

  return (
    <div className="space-y-6 fade-in">
      <PageHeader
        title="Project Expenses"
        subtitle="View expenses across all sites in your project"
      />
      {loading ? <Loader /> : <ExpenseTable expenses={expenses} showActions={false} />}
    </div>
  );
}
