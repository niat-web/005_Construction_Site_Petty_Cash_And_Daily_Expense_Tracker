import type { CashIssuance } from '../../api/cashApi';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/dateUtils';
import EmptyState from '../common/EmptyState';
import Button from '../common/Button';

interface CashIssuanceTableProps {
  issuances: CashIssuance[];
  onDelete?: (id: number) => void;
  showDelete?: boolean;
}

export default function CashIssuanceTable({ issuances, onDelete, showDelete = false }: CashIssuanceTableProps) {
  if (!issuances.length) {
    return <EmptyState title="No issuances found" description="No petty cash has been issued yet." />;
  }

  return (
    <div className="table-container fade-in">
      <table className="table">
        <thead>
          <tr>
            <th>#</th>
            <th>Site ID</th>
            <th>Amount</th>
            <th>Date</th>
            {showDelete && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {issuances.map((i, idx) => (
            <tr key={i.id}>
              <td className="text-slate-400 text-xs">{idx + 1}</td>
              <td className="font-medium text-slate-800">Site #{i.site_id}</td>
              <td className="font-semibold text-amber-600">{formatCurrency(i.amount)}</td>
              <td className="text-slate-500 text-sm">{formatDate(i.issue_date)}</td>
              {showDelete && onDelete && (
                <td>
                  <Button variant="danger" onClick={() => onDelete(i.id)} className="text-xs px-2 py-1">
                    Delete
                  </Button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
