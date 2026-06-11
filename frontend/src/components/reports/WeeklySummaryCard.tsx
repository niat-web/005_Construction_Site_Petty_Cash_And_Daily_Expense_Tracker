import type { WeeklyReport } from '../../api/reportApi';
import { formatCurrency } from '../../utils/formatCurrency';
import { CATEGORY_COLORS } from '../../utils/constants';

interface WeeklySummaryCardProps {
  report: WeeklyReport;
  weekStart: string;
  weekEnd: string;
}

export default function WeeklySummaryCard({ report }: WeeklySummaryCardProps) {
  const isSurplus = report.surplus >= 0;

  return (
    <div className="space-y-6 fade-in">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card border-l-4 border-amber-400">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Issued</p>
          <p className="text-3xl font-bold text-slate-800 mt-1">{formatCurrency(report.total_issued)}</p>
        </div>
        <div className="card border-l-4 border-blue-400">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Spent</p>
          <p className="text-3xl font-bold text-slate-800 mt-1">{formatCurrency(report.total_spent)}</p>
        </div>
        <div className={`card border-l-4 ${isSurplus ? 'border-green-400' : 'border-red-400'}`}>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{isSurplus ? 'Surplus' : 'Deficit'}</p>
          <p className={`text-3xl font-bold mt-1 ${isSurplus ? 'text-green-600' : 'text-red-500'}`}>
            {formatCurrency(Math.abs(report.surplus))}
          </p>
        </div>
      </div>

      {report.categories && Object.keys(report.categories).length > 0 && (
        <div className="card">
          <h3 className="text-sm font-semibold text-slate-700 mb-4">Category Breakdown</h3>
          <div className="space-y-3">
            {Object.entries(report.categories)
              .sort(([, a], [, b]) => b - a)
              .map(([category, amount]) => {
                const pct = report.total_spent > 0 ? (amount / report.total_spent) * 100 : 0;
                return (
                  <div key={category}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-600 font-medium">{category}</span>
                      <span className="text-slate-800 font-semibold">{formatCurrency(amount)}</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all duration-500"
                        style={{ width: `${pct}%`, backgroundColor: CATEGORY_COLORS[category] || '#94a3b8' }}
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
}
