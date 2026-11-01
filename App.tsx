import React, { useState } from 'react';
import { ComplaintProvider, useComplaints } from './context/ComplaintContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { Footer } from './components/layout/Footer';
import { LoginPage } from './components/auth/LoginPage';
import { OverviewDashboard } from './components/dashboard/OverviewDashboard';
import { ComplaintTable } from './components/complaints/ComplaintTable';
import { ComplaintDetailModal } from './components/complaints/ComplaintDetailModal';
import { DuplicateDetectionView } from './components/duplicates/DuplicateDetectionView';
import { DelayMonitoringView } from './components/delay/DelayMonitoringView';
import { BureauManagementView } from './components/bureaus/BureauManagementView';
import { AnalyticsView } from './components/analytics/AnalyticsView';
import { ReportsView } from './components/reports/ReportsView';
import { NotificationsView } from './components/notifications/NotificationsModal';
import { ComplaintTrackingView } from './components/tracking/ComplaintTrackingView';
import { SettingsView } from './components/settings/SettingsView';
import type { BureauCell } from './types';

const MainLayout: React.FC = () => {
  const {
    activeView,
    setActiveView,
    selectedComplaintId,
    setSelectedComplaintId,
  } = useComplaints();

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(true); // Default authenticated for effortless testing

  if (!isAuthenticated) {
    return <LoginPage onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800 antialiased selection:bg-blue-600 selection:text-white">
      {/* Sidebar (Desktop Collapsible & Mobile Drawer) */}
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        isMobileOpen={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${
          isSidebarCollapsed ? 'lg:pl-20' : 'lg:pl-72'
        }`}
      >
        {/* Top Navbar */}
        <Navbar
          onToggleSidebar={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          isSidebarOpen={isMobileMenuOpen}
        />

        {/* View Routing Outlet */}
        <main className="flex-1 p-4 sm:p-6 max-w-7xl w-full mx-auto">
          {activeView === 'dashboard' && (
            <OverviewDashboard
              onNavigate={(view) => setActiveView(view)}
              onSelectComplaint={(id) => setSelectedComplaintId(id)}
            />
          )}

          {activeView === 'complaints' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200">
                <div>
                  <h1 className="text-xl font-bold text-slate-900 tracking-tight font-sans">
                    Complaint Management Central
                  </h1>
                  <p className="text-xs text-slate-500">
                    Search, filter, review and export technical institution grievances
                  </p>
                </div>
              </div>
              <ComplaintTable
                onSelectComplaint={(id) => setSelectedComplaintId(id)}
              />
            </div>
          )}

          {activeView === 'tracking' && (
            <ComplaintTrackingView
              onSelectComplaint={(id) => setSelectedComplaintId(id)}
            />
          )}

          {activeView === 'bureaus' && (
            <BureauManagementView
              onSelectBureauFilter={(bureau: BureauCell) => {
                setActiveView('complaints');
              }}
            />
          )}

          {activeView === 'duplicates' && (
            <DuplicateDetectionView
              onSelectComplaint={(id) => setSelectedComplaintId(id)}
            />
          )}

          {activeView === 'delay' && (
            <DelayMonitoringView
              onSelectComplaint={(id) => setSelectedComplaintId(id)}
            />
          )}

          {activeView === 'analytics' && <AnalyticsView />}

          {activeView === 'reports' && <ReportsView />}

          {activeView === 'notifications' && (
            <NotificationsView
              onSelectComplaint={(id) => setSelectedComplaintId(id)}
            />
          )}

          {activeView === 'settings' && <SettingsView />}
        </main>

        {/* Footer */}
        <Footer />
      </div>

      {/* Global Complaint Details Modal */}
      {selectedComplaintId && (
        <ComplaintDetailModal
          complaintId={selectedComplaintId}
          onClose={() => setSelectedComplaintId(null)}
        />
      )}
    </div>
  );
};

export default function App() {
  return (
    <ComplaintProvider>
      <MainLayout />
    </ComplaintProvider>
  );
}
