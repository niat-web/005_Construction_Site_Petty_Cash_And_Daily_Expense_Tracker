import { formatCurrency } from '../../utils/formatCurrency';

interface BalanceCardProps {
  balance: number;
  totalIssued: number;
  totalSpent: number;
}

export default function BalanceCard({ balance, totalIssued, totalSpent }: BalanceCardProps) {
  const isNegative = balance < 0;
  const pctSpent = totalIssued > 0 ? Math.min((totalSpent / totalIssued) * 100, 100) : 0;

  return (
    <div className={`card ${isNegative ? 'border-red-200 border' : 'border-green-200 border'}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-slate-600">Running Balance</h3>
        {isNegative && (
          <span className="badge badge-red text-xs animate-pulse">⚠ Shortfall</span>
        )}
      </div>

      <p className={`text-4xl font-bold ${isNegative ? 'text-red-500' : 'text-green-600'}`}>
        {formatCurrency(balance)}
      </p>

      <div className="mt-4 space-y-2">
        <div className="flex justify-between text-xs text-slate-500">
          <span>Progress</span>
          <span>{pctSpent.toFixed(0)}% spent</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-500 ${isNegative ? 'bg-red-400' : 'bg-green-400'}`}
            style={{ width: `${pctSpent}%` }}
          />
        </div>
        <div className="flex justify-between text-xs mt-1">
          <span className="text-slate-400">Issued: <span className="font-medium text-slate-600">{formatCurrency(totalIssued)}</span></span>
          <span className="text-slate-400">Spent: <span className="font-medium text-slate-600">{formatCurrency(totalSpent)}</span></span>
        </div>
      </div>
    </div>
  );
}
