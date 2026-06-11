import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../app/store';
import { updateExpenseThunk } from '../../features/expenses/expenseThunks';
import { getIssuancesApi } from '../../api/cashApi';
import type { CashIssuance } from '../../api/cashApi';
import { getExpenseApi } from '../../api/expenseApi';
import type { Expense } from '../../api/expenseApi';
import type { ExpenseCategory } from '../../utils/constants';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/common/Button';
import ExpenseForm from '../../components/expenses/ExpenseForm';
import Loader from '../../components/common/Loader';

export default function EditExpensePage() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading } = useSelector((s: RootState) => s.expenses);
  const [issuances, setIssuances] = useState<CashIssuance[]>([]);
  const [expense, setExpense] = useState<Expense | null>(null);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    Promise.all([
      getIssuancesApi(),
      getExpenseApi(Number(id)),
    ])
      .then(([issuRes, expRes]) => {
        setIssuances(issuRes.data);
        setExpense(expRes.data);
      })
      .finally(() => setFetching(false));
  }, [id]);

  const handleSubmit = async (data: {
    cash_issuance_id: number;
    category: ExpenseCategory;
    amount: number;
    description: string;
    receipt_url: string;
    expense_time: string;
  }) => {
    if (!id) return;
    await dispatch(updateExpenseThunk({ id: Number(id), payload: data }));
    navigate('/supervisor/expenses');
  };

  if (fetching) return <Loader />;

  return (
    <div className="space-y-6 fade-in">
      <Button variant="ghost" onClick={() => navigate(-1)} className="text-sm">← Back</Button>
      <PageHeader title="Edit Expense" subtitle="Update expense details" />
      <div className="max-w-xl">
        <div className="card">
          <ExpenseForm issuances={issuances} onSubmit={handleSubmit} loading={loading} initialData={expense} />
        </div>
      </div>
    </div>
  );
}
