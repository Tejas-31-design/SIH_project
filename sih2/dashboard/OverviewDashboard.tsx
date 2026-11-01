import React from 'react';
import {
  FileText,
  AlertOctagon,
  Clock,
  CheckCircle2,
  Users,
  CopyCheck,
  Building2,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  ShieldAlert,
  Calendar,
} from 'lucide-react';
import { useComplaints } from '../../context/ComplaintContext';
import { StatCard } from '../common/StatCard';
import { StatusBadge } from '../common/StatusBadge';
import { PriorityBadge } from '../common/PriorityBadge';
import { AICTE_BUREAUS } from '../../data/initialComplaints';

interface OverviewDashboardProps {
  onNavigate: (view: string) => void;
  onSelectComplaint: (id: string) => void;
}

export const OverviewDashboard: React.FC<OverviewDashboardProps> = ({
  onNavigate,
  onSelectComplaint,
}) => {
  const { complaints, currentUser } = useComplaints();

  // Statistics calculation from live complaints dataset
  const totalCount = complaints.length;
  const newCount = complaints.filter((c) => c.status === 'Submitted').length;
  const underReviewCount = complaints.filter((c) => c.status === 'Under Review').length;
  const pendingCount = complaints.filter(
    (c) => c.status === 'Assigned' || c.status === 'Awaiting Information'
  ).length;
  const resolvedCount = complaints.filter(
    (c) => c.status === 'Resolved' || c.status === 'Closed'
  ).length;
  const overdueCount = complaints.filter(
    (c) => c.isOverdue && c.status !== 'Resolved' && c.status !== 'Closed'
  ).length;

  const resolutionRate = totalCount > 0 ? Math.round((resolvedCount / totalCount) * 100) : 0;

  // Recent 6 complaints
  const recentComplaints = complaints.slice(0, 6);

  // Overdue urgent cases needing immediate attention
  const urgentBreaches = complaints
    .filter((c) => c.isOverdue && c.status !== 'Resolved' && c.status !== 'Closed')
    .slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Welcome & Context Banner */}
      <div className="bg-gradient-to-r from-[#0b1e36] to-[#162e4e] text-white rounded-2xl p-6 shadow-md border border-[#162e4e] relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-400/30 mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              SIH 2026 Problem Statement ID: SIH26264
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-sans">
              Welcome, {currentUser.name}
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              AICTE Complaint360 centralizes complaint monitoring, cross-bureau case assignments, smart duplicate detection, and automated SLA delay tracking across all technical education cells.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={() => onNavigate('complaints')}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors flex items-center gap-2"
            >
              <span>Manage Complaints</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onNavigate('delay')}
              className="px-3.5 py-2 bg-red-600/90 hover:bg-red-600 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>SLA Escalations ({overdueCount})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Primary KPI Stat Cards (6 Statistics required by prompt) */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4">
        <StatCard
          title="Total Complaints"
          count={totalCount}
          subtitle="All bureaus"
          icon={FileText}
          iconBgColor="bg-slate-100"
          iconColor="text-slate-800"
          trendText={`${resolutionRate}% resolved`}
          trendType="neutral"
          onClick={() => onNavigate('complaints')}
        />

        <StatCard
          title="New / Submitted"
          count={newCount}
          subtitle="Awaiting triage"
          icon={Clock}
          iconBgColor="bg-blue-50"
          iconColor="text-blue-600"
          trendText="Action Needed"
          trendType="neutral"
          onClick={() => onNavigate('complaints')}
        />

        <StatCard
          title="Under Review"
          count={underReviewCount}
          subtitle="Screening active"
          icon={AlertOctagon}
          iconBgColor="bg-amber-50"
          iconColor="text-amber-600"
          trendText="In Screening"
          trendType="neutral"
          onClick={() => onNavigate('complaints')}
        />

        <StatCard
          title="Pending / Action"
          count={pendingCount}
          subtitle="Assigned to officers"
          icon={Users}
          iconBgColor="bg-purple-50"
          iconColor="text-purple-600"
          trendText="In Inquiry"
          trendType="neutral"
          onClick={() => onNavigate('complaints')}
        />

        <StatCard
          title="Resolved Cases"
          count={resolvedCount}
          subtitle="Disposed & closed"
          icon={CheckCircle2}
          iconBgColor="bg-emerald-50"
          iconColor="text-emerald-600"
          trendText="ATR Disposed"
          trendType="positive"
          onClick={() => onNavigate('complaints')}
        />

        <StatCard
          title="Overdue (SLA)"
          count={overdueCount}
          subtitle="Breached targets"
          icon={AlertTriangle}
          iconBgColor="bg-red-50"
          iconColor="text-red-600"
          trendText="Breach Alert"
          trendType="urgent"
          onClick={() => onNavigate('delay')}
        />
      </div>

      {/* Urgent SLA Breach Alert Box if cases exceed SLA */}
      {overdueCount > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-red-100 rounded-lg text-red-700 shrink-0 mt-0.5">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-red-900">
                  Critical SLA Delays Detected ({overdueCount} cases requiring statutory escalation)
                </h3>
                <p className="text-xs text-red-700 mt-0.5 leading-relaxed">
                  Complaints against institutions such as <strong>Apex Institute of Technology</strong> and <strong>Vidyapeeth Polytechnic</strong> have exceeded their resolution deadlines. Review recommendations for show-cause notice issuance.
                </p>
              </div>
            </div>
            <button
              onClick={() => onNavigate('delay')}
              className="px-3.5 py-1.5 bg-red-700 hover:bg-red-800 text-white rounded-lg text-xs font-semibold shrink-0 transition-colors"
            >
              Open Delay Monitor
            </button>
          </div>
        </div>
      )}

      {/* Main Grid: Recent Complaints + Quick Modules Spotlight */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Recent Complaints Table (8 Cols) */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Recent Complaint Cases
              </h2>
              <p className="text-[11px] text-slate-500">
                Latest submissions across technical institutions
              </p>
            </div>
            <button
              onClick={() => onNavigate('complaints')}
              className="text-xs font-semibold text-blue-700 hover:text-blue-800 flex items-center gap-1"
            >
              <span>View All ({complaints.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 text-[11px]">
                  <th className="py-2.5 px-4">Case ID</th>
                  <th className="py-2.5 px-4">Institution Name</th>
                  <th className="py-2.5 px-4">Bureau</th>
                  <th className="py-2.5 px-4">Priority</th>
                  <th className="py-2.5 px-4">Status</th>
                  <th className="py-2.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentComplaints.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-blue-700">
                      {item.id}
                    </td>
                    <td className="py-3 px-4 max-w-[220px]">
                      <div className="font-semibold text-slate-800 truncate" title={item.institution.name}>
                        {item.institution.name}
                      </div>
                      <div className="text-[10px] text-slate-500 truncate">
                        {item.institution.city}, {item.institution.state}
                      </div>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap text-slate-600 text-[11px]">
                      {item.bureau}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <PriorityBadge priority={item.priority} size="sm" />
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <StatusBadge status={item.status} size="sm" />
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => onSelectComplaint(item.id)}
                        className="px-2.5 py-1 text-xs font-semibold text-blue-700 hover:text-white bg-blue-50 hover:bg-blue-700 rounded-md border border-blue-200 transition-colors"
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: AICTE Bureau Distribution & Quick Features (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Smart Duplicate Detection Spotlight */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <CopyCheck className="w-4 h-4 text-amber-600" />
                <h3 className="text-xs font-bold text-slate-900">
                  Smart Duplicate Triaging
                </h3>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 font-bold">
                3 Clusters Detected
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Algorithmic engine discovered multi-student complaints against <strong>Apex Pune</strong> with 94% similarity on capitation fee issues.
            </p>
            <button
              onClick={() => onNavigate('duplicates')}
              className="mt-3 w-full py-1.5 px-3 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>Review Duplicate Clusters</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Bureau Workload Summary */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-blue-600" />
                <h3 className="text-xs font-bold text-slate-900">
                  Bureaus & Cells Workload
                </h3>
              </div>
              <button
                onClick={() => onNavigate('bureaus')}
                className="text-[11px] font-semibold text-blue-700 hover:text-blue-800"
              >
                View Cells
              </button>
            </div>

            <div className="space-y-2.5">
              {AICTE_BUREAUS.slice(0, 4).map((b) => {
                const count = complaints.filter((c) => c.bureau === b.name).length;
                const percentage = Math.round((count / complaints.length) * 100);

                return (
                  <div key={b.name} className="text-xs">
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="font-semibold text-slate-800 truncate" title={b.name}>
                        {b.name}
                      </span>
                      <span className="text-slate-500 font-mono">
                        {count} cases ({percentage}%)
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-600 rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
