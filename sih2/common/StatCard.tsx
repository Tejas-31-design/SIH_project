import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  count: number | string;
  subtitle?: string;
  icon: LucideIcon;
  iconBgColor?: string;
  iconColor?: string;
  trendText?: string;
  trendType?: 'positive' | 'negative' | 'neutral' | 'urgent';
  onClick?: () => void;
  isActive?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  count,
  subtitle,
  icon: Icon,
  iconBgColor = 'bg-blue-50',
  iconColor = 'text-blue-600',
  trendText,
  trendType = 'neutral',
  onClick,
  isActive = false,
}) => {
  const getTrendStyle = () => {
    switch (trendType) {
      case 'positive':
        return 'text-emerald-700 bg-emerald-50 border-emerald-200';
      case 'urgent':
        return 'text-red-700 bg-red-50 border-red-200 animate-pulse font-semibold';
      case 'negative':
        return 'text-amber-700 bg-amber-50 border-amber-200';
      default:
        return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  return (
    <div
      onClick={onClick}
      className={`relative bg-white rounded-xl border p-4 transition-all duration-200 flex flex-col justify-between ${
        onClick
          ? 'cursor-pointer hover:shadow-md hover:border-blue-400 hover:-translate-y-0.5'
          : 'shadow-xs'
      } ${
        isActive
          ? 'ring-2 ring-blue-600 border-blue-600 shadow-md'
          : 'border-slate-200 shadow-xs'
      }`}
    >
      <div>
        <div className="flex items-start justify-between gap-1.5">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 leading-tight min-h-[28px] flex items-center">
            {title}
          </p>
          <div className={`p-2 rounded-lg shrink-0 ${iconBgColor}`}>
            <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${iconColor}`} />
          </div>
        </div>

        <div className="mt-1">
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-sans">
            {count}
          </div>
          {subtitle && (
            <div className="text-[11px] text-slate-500 font-medium mt-0.5 leading-snug">
              {subtitle}
            </div>
          )}
        </div>
      </div>

      {trendText && (
        <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs gap-1">
          <span className={`inline-flex items-center px-1.5 py-0.5 rounded-md border text-[10px] font-medium leading-none whitespace-nowrap ${getTrendStyle()}`}>
            {trendText}
          </span>
          <span className="text-slate-400 text-[10px] whitespace-nowrap shrink-0 font-medium">Live</span>
        </div>
      )}
    </div>
  );
};
