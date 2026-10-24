import React from 'react';

const STATUS_CLASSES: Record<string, string> = {
  pending: 'bg-amber-50 text-amber-700 border border-amber-200',
  confirmed: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  cancelled: 'bg-rose-50 text-rose-700 border border-rose-200',
};

export const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  return (
    <span
      className={`inline-flex items-center justify-center rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize whitespace-nowrap ${
        STATUS_CLASSES[status] ?? 'bg-slate-100 text-slate-700 border border-slate-200'
      }`}
    >
      {status}
    </span>
  );
};
