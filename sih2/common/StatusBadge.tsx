import React from 'react';
import type { ComplaintStatus } from '../../types';

interface StatusBadgeProps {
  status: ComplaintStatus;
  size?: 'sm' | 'md' | 'lg';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm font-semibold',
  };

  const getStatusStyles = () => {
    switch (status) {
      case 'Submitted':
        return 'bg-blue-50 text-blue-700 border-blue-200 ring-blue-600/20';
      case 'Under Review':
        return 'bg-amber-50 text-amber-700 border-amber-200 ring-amber-600/20';
      case 'Assigned':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200 ring-indigo-600/20';
      case 'Awaiting Information':
        return 'bg-purple-50 text-purple-700 border-purple-200 ring-purple-600/20';
      case 'Resolved':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-600/20';
      case 'Closed':
        return 'bg-slate-100 text-slate-700 border-slate-300 ring-slate-600/10';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusDot = () => {
    switch (status) {
      case 'Submitted':
        return 'bg-blue-500';
      case 'Under Review':
        return 'bg-amber-500 animate-pulse';
      case 'Assigned':
        return 'bg-indigo-500';
      case 'Awaiting Information':
        return 'bg-purple-500';
      case 'Resolved':
        return 'bg-emerald-500';
      case 'Closed':
        return 'bg-slate-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border shadow-xs ${getStatusStyles()} ${
        sizeClasses[size]
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${getStatusDot()}`} />
      <span>{status}</span>
    </span>
  );
};
