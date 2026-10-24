import React from 'react';

const STATUS_CLASSES: Record<string, string> = {
  pending: 'bg-accent text-accent-foreground',
  confirmed: 'bg-success text-primary-foreground',
  cancelled: 'bg-destructive text-destructive-foreground',
};

export const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  return (
    <span
      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${
        STATUS_CLASSES[status] ?? 'bg-muted text-muted-foreground'
      }`}
    >
      {status}
    </span>
  );
};
