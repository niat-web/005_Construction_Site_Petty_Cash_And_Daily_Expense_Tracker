import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { AppDispatch, RootState } from '../../app/store';
import { fetchExpensesThunk, deleteExpenseThunk } from '../../features/expenses/expenseThunks';
import { setSelectedExpense } from '../../features/expenses/expenseSlice';
import type { Expense } from '../../api/expenseApi';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/common/Button';
import ExpenseTable from '../../components/expenses/ExpenseTable';
import Loader from '../../components/common/Loader';
import { Link } from 'react-router-dom';

export default function SupervisorExpensesPage() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { expenses, loading } = useSelector((s: RootState) => s.expenses);

  useEffect(() => { dispatch(fetchExpensesThunk()); }, [dispatch]);

  const handleDelete = (id: number) => {
    if (window.confirm('Delete this expense?')) {
      dispatch(deleteExpenseThunk(id));
    }
  };

  const handleEdit = (expense: Expense) => {
    dispatch(setSelectedExpense(expense));
    navigate(`/supervisor/expenses/${expense.id}/edit`);
  };

  return (
    <div className="space-y-6 fade-in">
      <PageHeader
        title="My Expenses"
        subtitle="Track all expenses for your site"
        action={
          <Link to="/supervisor/expenses/add">
            <Button variant="primary">+ Add Expense</Button>
          </Link>
        }
      />

      {loading ? (
        <Loader />
      ) : (
        <ExpenseTable
          expenses={expenses}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
