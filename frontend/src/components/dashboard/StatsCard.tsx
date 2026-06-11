interface StatsCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  borderColor?: string;
  valueColor?: string;
  subtitle?: string;
}

import React from 'react';

export default function StatsCard({
  title,
  value,
  icon,
  borderColor = 'border-amber-400',
  valueColor = 'text-slate-800',
  subtitle,
}: StatsCardProps) {
  return (
    <div className={`stat-card ${borderColor} fade-in`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{title}</p>
          <p className={`text-3xl font-bold mt-1 ${valueColor}`}>{value}</p>
          {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
        </div>
        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
          {icon}
        </div>
      </div>
    </div>
  );
}
