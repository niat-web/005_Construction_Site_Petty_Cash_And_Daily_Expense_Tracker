import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../app/store';
import { createExpenseThunk } from '../../features/expenses/expenseThunks';
import { getIssuancesApi } from '../../api/cashApi';
import type { CashIssuance } from '../../api/cashApi';
import type { ExpenseCategory } from '../../utils/constants';
import { clearWarning } from '../../features/expenses/expenseSlice';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/common/Button';
import ExpenseForm from '../../components/expenses/ExpenseForm';
import Loader from '../../components/common/Loader';

export default function AddExpensePage() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading, negativeBalanceWarning } = useSelector((s: RootState) => s.expenses);
  const [issuances, setIssuances] = useState<CashIssuance[]>([]);
  const [fetchingIssuances, setFetchingIssuances] = useState(true);

  useEffect(() => {
    getIssuancesApi()
      .then((res) => setIssuances(res.data))
      .finally(() => setFetchingIssuances(false));

    return () => { dispatch(clearWarning()); };
  }, [dispatch]);

  const handleSubmit = async (data: {
    cash_issuance_id: number;
    category: ExpenseCategory;
    amount: number;
    description: string;
    receipt_url: string;
    expense_time: string;
  }) => {
    await dispatch(createExpenseThunk(data));
    navigate('/supervisor/expenses');
  };

  if (fetchingIssuances) return <Loader />;

  return (
    <div className="space-y-6 fade-in">
      <div className="flex items-center gap-3 mb-2">
        <Button variant="ghost" onClick={() => navigate(-1)} className="text-sm">
          ← Back
        </Button>
      </div>
      <PageHeader title="Add New Expense" subtitle="Record a new expense for your site" />

      {negativeBalanceWarning.active && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
          ⚠️ <strong>Cash shortfall detected!</strong> Current balance is{' '}
          <strong>₹{negativeBalanceWarning.balance.toLocaleString('en-IN')}</strong>.
          Expenses exceed issuances.
        </div>
      )}

      <div className="max-w-xl">
        <div className="card">
          {issuances.length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              <p className="font-medium">No cash issuances found</p>
              <p className="text-sm mt-1">Please wait for the admin to issue petty cash to your site.</p>
            </div>
          ) : (
            <ExpenseForm
              issuances={issuances}
              onSubmit={handleSubmit}
              loading={loading}
            />
          )}
        </div>
      </div>
    </div>
  );
}
