import React from 'react';
import type { ComplaintPriority } from '../../types';
import { AlertCircle, AlertTriangle, Clock, Info } from 'lucide-react';

interface PriorityBadgeProps {
  priority: ComplaintPriority;
  showIcon?: boolean;
  size?: 'sm' | 'md';
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({
  priority,
  showIcon = true,
  size = 'md',
}) => {
  const getStyles = () => {
    switch (priority) {
      case 'Urgent':
        return 'bg-red-50 text-red-700 border-red-200 ring-red-600/10 font-semibold';
      case 'High':
        return 'bg-orange-50 text-orange-700 border-orange-200 ring-orange-600/10';
      case 'Medium':
        return 'bg-amber-50 text-amber-700 border-amber-200 ring-amber-600/10';
      case 'Low':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-600/10';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getIcon = () => {
    switch (priority) {
      case 'Urgent':
        return <AlertCircle className="w-3.5 h-3.5 text-red-600" />;
      case 'High':
        return <AlertTriangle className="w-3.5 h-3.5 text-orange-600" />;
      case 'Medium':
        return <Clock className="w-3.5 h-3.5 text-amber-600" />;
      case 'Low':
        return <Info className="w-3.5 h-3.5 text-emerald-600" />;
    }
  };

  const sizeClass = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md border font-medium ${getStyles()} ${sizeClass}`}
    >
      {showIcon && getIcon()}
      <span>{priority}</span>
    </span>
  );
};
