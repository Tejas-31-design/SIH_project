import React from 'react';
import {
  LayoutDashboard,
  FileText,
  SearchCode,
  Building2,
  CopyCheck,
  ClockAlert,
  BarChart3,
  Bell,
  Settings,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  GraduationCap,
  Sparkles,
} from 'lucide-react';
import { useComplaints } from '../../context/ComplaintContext';

interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed,
  onToggleCollapse,
  isMobileOpen,
  onCloseMobile,
}) => {
  const { complaints, notifications, activeView, setActiveView, currentUser } = useComplaints();

  const overdueCount = complaints.filter(
    (c) => c.isOverdue && c.status !== 'Resolved' && c.status !== 'Closed'
  ).length;

  const duplicateGroupsCount = 3; // Distinct detected duplicate clusters
  const unreadAlerts = notifications.filter((n) => !n.read).length;

  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'complaints',
      label: 'All Complaints',
      icon: FileText,
      badge: complaints.length.toString(),
      badgeColor: 'bg-slate-700 text-slate-200',
    },
    {
      id: 'tracking',
      label: 'Complaint Tracking',
      icon: SearchCode,
      badge: null,
    },
    {
      id: 'bureaus',
      label: 'Bureau / Cell Mgmt',
      icon: Building2,
      badge: '6 Cells',
      badgeColor: 'bg-blue-900/60 text-blue-300',
    },
    {
      id: 'duplicates',
      label: 'Duplicate Detection',
      icon: CopyCheck,
      badge: `${duplicateGroupsCount} Clusters`,
      badgeColor: 'bg-amber-500/20 text-amber-300 border border-amber-500/40',
      highlight: true,
    },
    {
      id: 'delay',
      label: 'Delay & SLA Monitor',
      icon: ClockAlert,
      badge: overdueCount > 0 ? `${overdueCount} Overdue` : null,
      badgeColor: 'bg-red-500/20 text-red-300 border border-red-500/40 animate-pulse',
      highlight: true,
    },
    {
      id: 'analytics',
      label: 'Analytics & Reports',
      icon: BarChart3,
      badge: null,
    },
    {
      id: 'notifications',
      label: 'Notifications & Audit',
      icon: Bell,
      badge: unreadAlerts > 0 ? unreadAlerts.toString() : null,
      badgeColor: 'bg-rose-500 text-white',
    },
    {
      id: 'settings',
      label: 'Settings & SLA Config',
      icon: Settings,
      badge: null,
    },
  ];

  const handleNavClick = (viewId: string) => {
    setActiveView(viewId);
    if (isMobileOpen) {
      onCloseMobile();
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-900/70 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Main Sidebar Element */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 flex flex-col bg-[#0b1e36] text-white transition-all duration-300 ease-in-out border-r border-[#162e4e] shadow-xl ${
          isCollapsed ? 'w-20' : 'w-72'
        } ${
          isMobileOpen
            ? 'translate-x-0'
            : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Official Brand Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-[#162e4e] bg-[#071324]/80">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center shrink-0 shadow-md ring-2 ring-blue-400/30">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>

            {!isCollapsed && (
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-sm tracking-tight text-white font-sans">
                    AICTE
                  </span>
                  <span className="text-xs font-semibold px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-400/30">
                    360°
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 truncate tracking-wide font-medium">
                  Complaint Monitoring System
                </p>
              </div>
            )}
          </div>

          {/* Desktop Collapse Toggle */}
          <button
            onClick={onToggleCollapse}
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className="hidden lg:flex items-center justify-center w-7 h-7 rounded-md text-slate-400 hover:text-white hover:bg-[#162e4e] transition-colors"
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Portal Context Banner */}
        {!isCollapsed && (
          <div className="px-4 py-2.5 bg-[#0f2747]/60 border-b border-[#162e4e]">
            <div className="flex items-center gap-2 text-[11px] font-semibold text-blue-200">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>SIH 2026 Integrated Portal</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5 leading-snug">
              Cross-Bureau Case Tracking & Intelligent Triaging
            </p>
          </div>
        )}

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                title={isCollapsed ? item.label : undefined}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all group relative ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-[#162e4e]'
                }`}
              >
                <Icon
                  className={`w-5 h-5 shrink-0 transition-colors ${
                    isActive
                      ? 'text-white'
                      : item.highlight
                      ? 'text-amber-400 group-hover:text-amber-300'
                      : 'text-slate-400 group-hover:text-white'
                  }`}
                />

                {!isCollapsed && (
                  <span className="flex-1 text-left truncate">{item.label}</span>
                )}

                {!isCollapsed && item.badge && (
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                      item.badgeColor || 'bg-slate-700 text-slate-200'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}

                {/* Collapsed Badge Dot Indicator */}
                {isCollapsed && item.badge && (
                  <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-amber-400" />
                )}
              </button>
            );
          })}
        </nav>

        {/* User Role Card at bottom */}
        <div className="p-3 border-t border-[#162e4e] bg-[#071324]/90">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center shrink-0 font-bold text-xs text-amber-300 ring-1 ring-slate-600">
              <ShieldAlert className="w-4 h-4 text-blue-400" />
            </div>

            {!isCollapsed && (
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-white truncate">
                  {currentUser.name}
                </p>
                <p className="text-[10px] text-blue-300 truncate">
                  {currentUser.role}
                </p>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};
