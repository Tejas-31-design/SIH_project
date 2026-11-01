import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Bell,
  Clock,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  UserCheck,
  ChevronDown,
  Menu,
  Shield,
  ExternalLink,
} from 'lucide-react';
import { useComplaints, DEMO_ROLES } from '../../context/ComplaintContext';

interface NavbarProps {
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar }) => {
  const {
    complaints,
    notifications,
    currentUser,
    setCurrentUser,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    setSelectedComplaintId,
    setActiveView,
    resetDemoData,
  } = useComplaints();

  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [currentTime, setCurrentTime] = useState<string>('');

  const searchRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  // Live IST Clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleDateString('en-IN', {
          weekday: 'short',
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        }) +
          ' | ' +
          now.toLocaleTimeString('en-IN', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true,
          }) +
          ' IST'
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchResults(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifDropdown(false);
      }
      if (userRef.current && !userRef.current.contains(event.target as Node)) {
        setShowUserDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadNotifs = notifications.filter((n) => !n.read);

  // Search filter
  const matchingComplaints = searchQuery.trim()
    ? complaints
        .filter(
          (c) =>
            c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.refToken.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.institution.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.subject.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .slice(0, 6)
    : [];

  const handleSelectComplaint = (id: string) => {
    setSelectedComplaintId(id);
    setActiveView('complaints');
    setSearchQuery('');
    setShowSearchResults(false);
  };

  const handleNotificationClick = (complaintId?: string, notifId?: string) => {
    if (notifId) markNotificationAsRead(notifId);
    if (complaintId) {
      setSelectedComplaintId(complaintId);
      setActiveView('complaints');
    }
    setShowNotifDropdown(false);
  };

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-xs">
      {/* Top Tricolor Brand Strip */}
      <div className="h-1 bg-gradient-to-r from-orange-500 via-white to-emerald-600" />

      <div className="px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4">
        {/* Left: Mobile Toggle & Problem Statement Branding */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={onToggleSidebar}
            aria-label="Toggle navigation menu"
            className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 lg:hidden focus:outline-hidden focus:ring-2 focus:ring-blue-500"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              SIH26264
            </span>
            <span className="hidden 2xl:inline-flex items-center text-xs font-medium text-slate-500">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 mr-1.5" />
              Complaint360 Gateway
            </span>
          </div>
        </div>

        {/* Center: Search Bar with Autocomplete */}
        <div ref={searchRef} className="relative flex-1 max-w-xl min-w-[220px] hidden md:block">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              placeholder="Search by ID, college name, token, or issue..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSearchResults(true);
              }}
              onFocus={() => setShowSearchResults(true)}
              className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-slate-400 hover:text-slate-600"
              >
                Clear
              </button>
            )}
          </div>

          {/* Search Dropdown Results */}
          {showSearchResults && searchQuery.trim().length > 0 && (
            <div className="absolute left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg overflow-hidden z-50">
              <div className="p-2 border-b border-slate-100 bg-slate-50 text-[11px] font-semibold text-slate-500 flex justify-between">
                <span>Matching Complaints ({matchingComplaints.length})</span>
                <span>Press Esc to close</span>
              </div>
              {matchingComplaints.length === 0 ? (
                <div className="p-4 text-center text-xs text-slate-500">
                  No complaints found matching "{searchQuery}".
                </div>
              ) : (
                <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                  {matchingComplaints.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleSelectComplaint(item.id)}
                      className="w-full text-left p-2.5 hover:bg-blue-50 transition-colors flex items-start gap-2.5 group"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-blue-700">
                            {item.id}
                          </span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border">
                            {item.status}
                          </span>
                          <span className="text-[11px] text-slate-400">
                            {item.bureau}
                          </span>
                        </div>
                        <p className="text-xs font-semibold text-slate-800 truncate mt-0.5">
                          {item.institution.name}
                        </p>
                        <p className="text-[11px] text-slate-500 truncate">
                          {item.subject}
                        </p>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 shrink-0 mt-1" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Action Icons: Live Time, Notifications, User Menu, Reset */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Current Live Time */}
          <div className="hidden xl:flex items-center gap-1.5 text-xs font-medium text-slate-600 bg-slate-100/80 px-2.5 py-1 rounded-md border border-slate-200">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <span className="font-mono">{currentTime}</span>
          </div>

          {/* Reset Demo Data Button */}
          <div className="relative">
            <button
              onClick={() => setShowResetConfirm(true)}
              title="Reset sample complaints and demo state"
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-600 hover:text-red-700 hover:bg-red-50 rounded-lg border border-slate-200 hover:border-red-200 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset Demo</span>
            </button>

            {/* Reset Confirmation Modal */}
            {showResetConfirm && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
                <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-5 border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
                  <div className="flex items-center gap-3 text-red-600 mb-3">
                    <div className="p-2 bg-red-100 rounded-full">
                      <AlertTriangle className="w-5 h-5" />
                    </div>
                    <h3 className="text-base font-bold text-slate-900">
                      Reset Demo Data?
                    </h3>
                  </div>
                  <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                    This will restore all 32+ original sample complaints, clear any demo edits, status transitions, notes, and reset SLA thresholds back to default.
                  </p>
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setShowResetConfirm(false)}
                      className="px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        resetDemoData();
                        setShowResetConfirm(false);
                      }}
                      className="px-3.5 py-1.5 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-xs"
                    >
                      Yes, Reset Data
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Notifications Dropdown */}
          <div ref={notifRef} className="relative">
            <button
              onClick={() => setShowNotifDropdown(!showNotifDropdown)}
              aria-label="View system notifications"
              className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            >
              <Bell className="w-5 h-5" />
              {unreadNotifs.length > 0 && (
                <span className="absolute top-1 right-1 flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-red-600 rounded-full ring-2 ring-white animate-pulse">
                  {unreadNotifs.length}
                </span>
              )}
            </button>

            {showNotifDropdown && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden z-50">
                <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-800">
                      Notifications & Alerts
                    </span>
                    {unreadNotifs.length > 0 && (
                      <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                        {unreadNotifs.length} new
                      </span>
                    )}
                  </div>
                  {unreadNotifs.length > 0 && (
                    <button
                      onClick={markAllNotificationsAsRead}
                      className="text-[11px] font-semibold text-blue-600 hover:text-blue-800"
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-xs text-slate-500">
                      No notifications at this moment.
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => handleNotificationClick(n.complaintId, n.id)}
                        className={`p-3 text-left hover:bg-slate-50 cursor-pointer transition-colors ${
                          !n.read ? 'bg-blue-50/50' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-xs font-semibold text-slate-900">
                            {n.title}
                          </p>
                          <span className="text-[10px] text-slate-400 shrink-0">
                            {n.timestamp}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 mt-1 line-clamp-2">
                          {n.message}
                        </p>
                        {n.complaintId && (
                          <div className="mt-1.5 flex items-center gap-1 text-[11px] font-mono font-medium text-blue-600">
                            <span>Open case {n.complaintId}</span>
                            <span>→</span>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>

                <div className="p-2 bg-slate-50 border-t border-slate-100 text-center">
                  <button
                    onClick={() => {
                      setActiveView('notifications');
                      setShowNotifDropdown(false);
                    }}
                    className="text-xs font-semibold text-slate-700 hover:text-blue-700"
                  >
                    View All Audit Logs & Alerts
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Profile & Demo Role Switcher */}
          <div ref={userRef} className="relative">
            <button
              onClick={() => setShowUserDropdown(!showUserDropdown)}
              className="flex items-center gap-2 p-1.5 text-slate-700 hover:bg-slate-100 rounded-lg border border-transparent hover:border-slate-200 transition-colors"
            >
              <div className="w-7 h-7 rounded-full bg-blue-700 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                {currentUser.name.charAt(0)}
              </div>
              <div className="hidden xl:block text-left">
                <p className="text-xs font-bold text-slate-800 leading-tight">
                  {currentUser.name.split('(')[0].trim()}
                </p>
                <p className="text-[10px] text-slate-500 leading-tight">
                  {currentUser.role}
                </p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {showUserDropdown && (
              <div className="absolute right-0 mt-2 w-72 bg-white border border-slate-200 rounded-xl shadow-xl p-2 z-50">
                <div className="p-3 border-b border-slate-100 bg-slate-50 rounded-lg mb-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                    <Shield className="w-4 h-4 text-blue-600" />
                    <span>Active Session Profile</span>
                  </div>
                  <p className="text-xs font-semibold text-slate-800 mt-1">
                    {currentUser.name}
                  </p>
                  <p className="text-[11px] text-slate-500 font-mono">
                    {currentUser.email}
                  </p>
                  <p className="text-[10px] text-blue-700 font-medium mt-1">
                    Role: {currentUser.role}
                  </p>
                </div>

                <div className="px-2 py-1 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Switch Demo Role:
                </div>
                <div className="space-y-1">
                  {DEMO_ROLES.map((r) => (
                    <button
                      key={r.role}
                      onClick={() => {
                        setCurrentUser(r);
                        setShowUserDropdown(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs rounded-lg flex items-center justify-between transition-colors ${
                        currentUser.role === r.role
                          ? 'bg-blue-50 text-blue-800 font-semibold border border-blue-200'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div>
                        <div className="font-medium">{r.role}</div>
                        <div className="text-[10px] text-slate-500">{r.name}</div>
                      </div>
                      {currentUser.role === r.role && (
                        <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                      )}
                    </button>
                  ))}
                </div>

                <div className="mt-2 pt-2 border-t border-slate-100 text-[10px] text-slate-400 px-2 text-center">
                  Simulated role authorization for SIH26264 evaluation
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
