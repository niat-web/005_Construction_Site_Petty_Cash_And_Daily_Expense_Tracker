interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

import React from 'react';

export default function PageHeader({ title, subtitle, action }: PageHeaderProps) {
  return (
    <div className="page-header flex items-start justify-between gap-4">
      <div>
        <h1 className="page-title">{title}</h1>
        {subtitle && <p className="page-subtitle">{subtitle}</p>}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}
