import type { Expense } from '../../api/expenseApi';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDateTime } from '../../utils/dateUtils';
import CategoryBadge from './CategoryBadge';
import EmptyState from '../common/EmptyState';
import Button from '../common/Button';

interface ExpenseTableProps {
  expenses: Expense[];
  onEdit?: (expense: Expense) => void;
  onDelete?: (id: number) => void;
  showActions?: boolean;
}

export default function ExpenseTable({ expenses, onEdit, onDelete, showActions = true }: ExpenseTableProps) {
  if (!expenses.length) {
    return <EmptyState title="No expenses recorded" description="Add your first expense to get started." />;
  }

  return (
    <div className="table-container fade-in">
      <table className="table">
        <thead>
          <tr>
            <th>#</th>
            <th>Category</th>
            <th>Amount</th>
            <th>Description</th>
            <th>Time</th>
            <th>Receipt</th>
            {showActions && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {expenses.map((expense, idx) => (
            <tr key={expense.id}>
              <td className="text-slate-400 text-xs">{idx + 1}</td>
              <td><CategoryBadge category={expense.category} /></td>
              <td className="font-semibold text-slate-800">{formatCurrency(expense.amount)}</td>
              <td className="text-slate-500 max-w-48 truncate">{expense.description || '—'}</td>
              <td className="text-slate-400 text-xs whitespace-nowrap">{formatDateTime(expense.expense_time)}</td>
              <td>
                {expense.receipt_url ? (
                  <a
                    href={expense.receipt_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-amber-600 hover:text-amber-700 text-xs font-medium underline"
                  >
                    View
                  </a>
                ) : (
                  <span className="text-slate-300 text-xs">None</span>
                )}
              </td>
              {showActions && (
                <td>
                  <div className="flex gap-2">
                    {onEdit && (
                      <Button variant="ghost" onClick={() => onEdit(expense)} className="text-xs px-2 py-1">
                        Edit
                      </Button>
                    )}
                    {onDelete && (
                      <Button variant="danger" onClick={() => onDelete(expense.id)} className="text-xs px-2 py-1">
                        Delete
                      </Button>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
