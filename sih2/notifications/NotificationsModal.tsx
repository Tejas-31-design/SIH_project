import React, { useState } from 'react';
import {
  Bell,
  CheckCheck,
  AlertTriangle,
  UserCheck,
  RotateCw,
  CopyCheck,
  Info,
  ExternalLink,
  Shield,
} from 'lucide-react';
import { useComplaints } from '../../context/ComplaintContext';

interface NotificationsViewProps {
  onSelectComplaint: (id: string) => void;
}

export const NotificationsView: React.FC<NotificationsViewProps> = ({
  onSelectComplaint,
}) => {
  const { notifications, markNotificationAsRead, markAllNotificationsAsRead } = useComplaints();

  const [activeFilter, setActiveFilter] = useState<'all' | 'alert' | 'duplicate' | 'assignment' | 'status'>('all');

  const filteredNotifs = notifications.filter((n) => {
    if (activeFilter === 'all') return true;
    return n.type === activeFilter;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getNotifIcon = (type: string) => {
    switch (type) {
      case 'alert':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case 'duplicate':
        return <CopyCheck className="w-4 h-4 text-amber-600" />;
      case 'assignment':
        return <UserCheck className="w-4 h-4 text-blue-600" />;
      case 'status':
        return <RotateCw className="w-4 h-4 text-emerald-600" />;
      default:
        return <Info className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-800 border border-blue-200 mb-2">
              <Bell className="w-3.5 h-3.5 text-blue-600" />
              <span>Real-Time Event Stream</span>
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight font-sans">
              Notifications & Incident Audit Logs
            </h1>
            <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
              Consolidated real-time feed of case lifecycle events, algorithmic duplicate alerts, SLA overdue warnings, and cross-bureau officer assignments.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={markAllNotificationsAsRead}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Mark All Read ({unreadCount})</span>
              </button>
            )}
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-4 mt-4 border-t border-slate-100 text-xs">
          {[
            { id: 'all', label: 'All Events' },
            { id: 'alert', label: '⚠️ Overdue Alerts' },
            { id: 'duplicate', label: '🔍 Duplicate Flags' },
            { id: 'assignment', label: '👤 Officer Assignments' },
            { id: 'status', label: '🔄 Status Transitions' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                activeFilter === tab.id
                  ? 'bg-blue-700 text-white font-semibold shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs divide-y divide-slate-100 overflow-hidden">
        {filteredNotifs.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-xs">
            No events found for this filter category.
          </div>
        ) : (
          filteredNotifs.map((item) => (
            <div
              key={item.id}
              className={`p-4 hover:bg-slate-50/80 transition-colors flex items-start justify-between gap-4 ${
                !item.read ? 'bg-blue-50/40' : ''
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-slate-100 shrink-0 mt-0.5">
                  {getNotifIcon(item.type)}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-slate-900">
                      {item.title}
                    </h4>
                    {!item.read && (
                      <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                    )}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {item.message}
                  </p>
                  <div className="flex items-center gap-3 pt-1 text-[11px] text-slate-400 font-mono">
                    <span>{item.timestamp}</span>
                    {item.complaintId && (
                      <button
                        onClick={() => {
                          markNotificationAsRead(item.id);
                          onSelectComplaint(item.complaintId!);
                        }}
                        className="text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1 font-sans"
                      >
                        <span>Open Case {item.complaintId}</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {!item.read && (
                <button
                  onClick={() => markNotificationAsRead(item.id)}
                  className="text-[11px] font-semibold text-slate-400 hover:text-slate-700 shrink-0"
                >
                  Mark read
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
