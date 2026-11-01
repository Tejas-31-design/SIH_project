import React, { useState } from 'react';
import {
  Building2,
  Users,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Mail,
  Shield,
  FileText,
  Activity,
  ArrowRight,
} from 'lucide-react';
import { useComplaints } from '../../context/ComplaintContext';
import { AICTE_BUREAUS, AICTE_OFFICERS } from '../../data/initialComplaints';
import type { BureauCell } from '../../types';

interface BureauManagementViewProps {
  onSelectBureauFilter: (bureau: BureauCell) => void;
}

export const BureauManagementView: React.FC<BureauManagementViewProps> = ({
  onSelectBureauFilter,
}) => {
  const { complaints } = useComplaints();
  const [selectedBureau, setSelectedBureau] = useState<BureauCell>('Approval Bureau');

  // Compute live metrics per bureau from the complaint dataset
  const bureauStats = AICTE_BUREAUS.map((b) => {
    const bureauComplaints = complaints.filter((c) => c.bureau === b.name);
    const total = bureauComplaints.length;
    const pending = bureauComplaints.filter(
      (c) => c.status !== 'Resolved' && c.status !== 'Closed'
    ).length;
    const resolved = bureauComplaints.filter(
      (c) => c.status === 'Resolved' || c.status === 'Closed'
    ).length;
    const overdue = bureauComplaints.filter(
      (c) => c.isOverdue && c.status !== 'Resolved' && c.status !== 'Closed'
    ).length;

    // Average resolution time in days (simulated realistic formula)
    const avgDays = total > 0 ? Math.round(12 + (overdue * 3) + (pending * 0.8)) : b.targetSLADays;

    // Workload index
    let workloadStatus: 'Normal' | 'Moderate' | 'Heavy' = 'Normal';
    if (pending > 5) workloadStatus = 'Heavy';
    else if (pending > 3) workloadStatus = 'Moderate';

    return {
      ...b,
      total,
      pending,
      resolved,
      overdue,
      avgDays,
      workloadStatus,
      officers: AICTE_OFFICERS.filter((o) => o.bureau === b.name),
    };
  });

  const activeBureauData = bureauStats.find((b) => b.name === selectedBureau) || bureauStats[0];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-800 border border-blue-200 mb-2">
              <Building2 className="w-3.5 h-3.5 text-blue-600" />
              <span>AICTE Structural Governance</span>
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight font-sans">
              Bureau & Specialized Cell Oversight
            </h1>
            <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
              Monitoring case distribution, officer assignment density, turnaround efficiency, and pending backlogs across all 6 AICTE bureaus and specialized redressal cells.
            </p>
          </div>
        </div>
      </div>

      {/* 6 Bureaus Metric Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {bureauStats.map((b) => {
          const isSelected = selectedBureau === b.name;
          return (
            <div
              key={b.name}
              onClick={() => setSelectedBureau(b.name)}
              className={`bg-white rounded-xl border p-5 transition-all cursor-pointer ${
                isSelected
                  ? 'border-blue-600 ring-2 ring-blue-600/30 shadow-md'
                  : 'border-slate-200 hover:border-slate-300 shadow-xs'
              }`}
            >
              {/* Bureau Title and Workload Badge */}
              <div className="flex items-start justify-between gap-2 mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      {b.shortCode}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900">
                      {b.name}
                    </h3>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Head: <strong className="text-slate-700">{b.head}</strong>
                  </p>
                </div>

                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    b.workloadStatus === 'Heavy'
                      ? 'bg-red-50 text-red-700 border-red-200 animate-pulse'
                      : b.workloadStatus === 'Moderate'
                      ? 'bg-amber-50 text-amber-700 border-amber-200'
                      : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  }`}
                >
                  {b.workloadStatus} Load
                </span>
              </div>

              {/* Bureau Stats Grid */}
              <div className="grid grid-cols-4 gap-2 pt-3 border-t border-slate-100 text-center">
                <div className="p-2 bg-slate-50 rounded-lg">
                  <span className="block text-[10px] text-slate-500 uppercase font-semibold">
                    Total
                  </span>
                  <span className="text-base font-extrabold text-slate-900 font-mono">
                    {b.total}
                  </span>
                </div>

                <div className="p-2 bg-blue-50 rounded-lg">
                  <span className="block text-[10px] text-blue-700 uppercase font-semibold">
                    Pending
                  </span>
                  <span className="text-base font-extrabold text-blue-800 font-mono">
                    {b.pending}
                  </span>
                </div>

                <div className="p-2 bg-emerald-50 rounded-lg">
                  <span className="block text-[10px] text-emerald-700 uppercase font-semibold">
                    Resolved
                  </span>
                  <span className="text-base font-extrabold text-emerald-800 font-mono">
                    {b.resolved}
                  </span>
                </div>

                <div className="p-2 bg-red-50 rounded-lg">
                  <span className="block text-[10px] text-red-700 uppercase font-semibold">
                    Overdue
                  </span>
                  <span className="text-base font-extrabold text-red-800 font-mono">
                    {b.overdue}
                  </span>
                </div>
              </div>

              {/* Avg Resolution Time Footer */}
              <div className="mt-3.5 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Avg Turnaround: <strong>{b.avgDays} days</strong></span>
                </span>
                <span className="text-[11px] font-semibold text-blue-700 hover:text-blue-800">
                  Inspect Bureau →
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Bureau Detailed Breakdown Panel */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-blue-600" />
              <h2 className="text-base font-bold text-slate-900">
                {activeBureauData.name} ({activeBureauData.shortCode})
              </h2>
            </div>
            <p className="text-xs text-slate-600 mt-1">
              {activeBureauData.description}
            </p>
          </div>

          <button
            onClick={() => onSelectBureauFilter(activeBureauData.name)}
            className="px-3.5 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 shrink-0 shadow-xs"
          >
            <span>View All {activeBureauData.name} Cases ({activeBureauData.total})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Bureau Officers Rosters */}
        <div>
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
            Assigned Investigating Officers & Workload Allocation
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {activeBureauData.officers.map((off) => (
              <div
                key={off.id}
                className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-xs shrink-0">
                    {off.name.charAt(0)}
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block">{off.name}</span>
                    <span className="text-[11px] text-slate-500 font-mono block">
                      {off.designation} • {off.email}
                    </span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="font-mono text-xs font-extrabold text-blue-800 bg-white px-2 py-0.5 rounded border border-slate-200 block">
                    {off.activeCases} active
                  </span>
                  <span className="text-[10px] text-slate-400">cases</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
