import React, { useState, useMemo } from 'react';
import {
  ClockAlert,
  AlertTriangle,
  ShieldAlert,
  Send,
  Building,
  CheckCircle,
  Clock,
  ArrowRight,
  Eye,
  Sliders,
  BellRing,
  FileCheck,
} from 'lucide-react';
import { useComplaints } from '../../context/ComplaintContext';
import { StatusBadge } from '../common/StatusBadge';
import { PriorityBadge } from '../common/PriorityBadge';
import type { SLAConfig } from '../../types';

interface DelayMonitoringViewProps {
  onSelectComplaint: (id: string) => void;
}

export const DelayMonitoringView: React.FC<DelayMonitoringViewProps> = ({
  onSelectComplaint,
}) => {
  const { complaints, slaConfig, updateSLAConfig, triggerEscalation } = useComplaints();

  const [localSla, setLocalSla] = useState<SLAConfig>(slaConfig);
  const [selectedEscalationCase, setSelectedEscalationCase] = useState<string | null>(null);
  const [escalationType, setEscalationType] = useState<'Notice Issued' | 'Surprise Inspection Scheduled'>('Notice Issued');
  const [escalationRemark, setEscalationRemark] = useState<string>('');
  const [escalationNotice, setEscalationNotice] = useState<string>('');
  const [filterPriority, setFilterPriority] = useState<string>('All');

  // Filter complaints that are overdue or nearing deadline (< 3 days left)
  const overdueCases = useMemo(() => {
    return complaints.filter((c) => {
      if (c.status === 'Resolved' || c.status === 'Closed') return false;
      if (filterPriority !== 'All' && c.priority !== filterPriority) return false;
      return c.isOverdue || c.daysPending >= c.slaTargetDays - 2;
    });
  }, [complaints, filterPriority]);

  const strictlyOverdue = overdueCases.filter((c) => c.isOverdue);
  const nearingBreach = overdueCases.filter((c) => !c.isOverdue && c.daysPending >= c.slaTargetDays - 2);

  const handleSaveSLA = (e: React.FormEvent) => {
    e.preventDefault();
    updateSLAConfig(localSla);
    setEscalationNotice('SLA configuration updated and applied across all active complaint queues.');
    setTimeout(() => setEscalationNotice(''), 4000);
  };

  const handleTriggerEscalationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEscalationCase) return;
    triggerEscalation(selectedEscalationCase, escalationType, escalationRemark);
    setEscalationNotice(`Official escalation (${escalationType}) successfully logged for case ${selectedEscalationCase}.`);
    setSelectedEscalationCase(null);
    setEscalationRemark('');
    setTimeout(() => setEscalationNotice(''), 4500);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-red-800 border border-red-200 mb-2">
              <ClockAlert className="w-3.5 h-3.5 text-red-600 animate-pulse" />
              <span>SLA Compliance & Statutory Escalation Engine</span>
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight font-sans">
              Smart Delay & Overdue Case Monitoring
            </h1>
            <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
              Automated surveillance of complaint resolution timelines against configured AICTE Citizen Charter benchmarks. Triggers statutory escalation recommendations when institutions or bureaus exceed permissible turnaround.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-lg bg-red-100 text-red-800 font-bold text-xs border border-red-200">
              {strictlyOverdue.length} Cases Breached
            </span>
            <span className="px-3 py-1.5 rounded-lg bg-amber-100 text-amber-800 font-bold text-xs border border-amber-200">
              {nearingBreach.length} Near Breach (&lt;3d)
            </span>
          </div>
        </div>
      </div>

      {/* Mandatory Disclaimer Required by Prompt */}
      <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3 text-xs text-amber-900 shadow-xs">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Demonstration Notice: </span>
          The SLA threshold intervals shown below (7, 15, 30, 45 days) are simulated demo configurations for the SIH26264 prototype and do not represent official AICTE statutory policies or gazetted regulations.
        </div>
      </div>

      {escalationNotice && (
        <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{escalationNotice}</span>
        </div>
      )}

      {/* SLA Thresholds Bar */}
      <form
        onSubmit={handleSaveSLA}
        className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs"
      >
        <div className="flex items-center gap-2 font-bold text-slate-800">
          <Sliders className="w-4 h-4 text-blue-600" />
          <span>Configurable SLA Resolution Benchmarks (Days):</span>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="text-red-700 font-semibold">Urgent:</span>
            <input
              type="number"
              min="1"
              max="30"
              value={localSla.Urgent}
              onChange={(e) => setLocalSla({ ...localSla, Urgent: Number(e.target.value) })}
              className="w-14 p-1 text-center font-mono font-bold bg-slate-50 border border-slate-300 rounded"
            />
            <span className="text-slate-500 text-[11px]">days</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-orange-700 font-semibold">High:</span>
            <input
              type="number"
              min="1"
              max="60"
              value={localSla.High}
              onChange={(e) => setLocalSla({ ...localSla, High: Number(e.target.value) })}
              className="w-14 p-1 text-center font-mono font-bold bg-slate-50 border border-slate-300 rounded"
            />
            <span className="text-slate-500 text-[11px]">days</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-amber-700 font-semibold">Medium:</span>
            <input
              type="number"
              min="1"
              max="90"
              value={localSla.Medium}
              onChange={(e) => setLocalSla({ ...localSla, Medium: Number(e.target.value) })}
              className="w-14 p-1 text-center font-mono font-bold bg-slate-50 border border-slate-300 rounded"
            />
            <span className="text-slate-500 text-[11px]">days</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-emerald-700 font-semibold">Low:</span>
            <input
              type="number"
              min="1"
              max="120"
              value={localSla.Low}
              onChange={(e) => setLocalSla({ ...localSla, Low: Number(e.target.value) })}
              className="w-14 p-1 text-center font-mono font-bold bg-slate-50 border border-slate-300 rounded"
            />
            <span className="text-slate-500 text-[11px]">days</span>
          </div>

          <button
            type="submit"
            className="px-3 py-1.5 bg-blue-700 hover:bg-blue-800 text-white rounded-lg font-semibold transition-colors"
          >
            Save SLA Setting
          </button>
        </div>
      </form>

      {/* Overdue Cases Table with Escalation Recommendations */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Cases Requiring Immediate Statutory Action ({overdueCases.length})
            </h2>
            <p className="text-[11px] text-slate-500">
              Ranked by delay severity and recommended intervention protocol
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500">Filter Priority:</span>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium"
            >
              <option value="All">All Overdue</option>
              <option value="Urgent">Urgent Only</option>
              <option value="High">High Only</option>
              <option value="Medium">Medium Only</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 text-[11px]">
                <th className="py-3 px-4">Case ID</th>
                <th className="py-3 px-4">Institution Name</th>
                <th className="py-3 px-4">Bureau</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Delay Metric</th>
                <th className="py-3 px-4">Recommended AICTE Action</th>
                <th className="py-3 px-4 text-right">Escalate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {overdueCases.map((c) => {
                const daysOver = c.daysPending - c.slaTargetDays;
                const isBreached = daysOver > 0;

                // Determine automated escalation recommendation
                let recommendedAction = 'Issue Formal Show-Cause Notice to Principal';
                if (c.priority === 'Urgent') {
                  recommendedAction = 'Schedule Immediate Regional Office Surprise Inspection';
                } else if (c.category.includes('Capitation') || c.category.includes('Unapproved')) {
                  recommendedAction = 'Direct Suspension of Enrollment Portal & Financial Audit';
                }

                return (
                  <tr key={c.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Case ID */}
                    <td className="py-3 px-4 font-mono font-bold text-blue-700 whitespace-nowrap">
                      <div>{c.id}</div>
                      <div className="text-[10px] text-slate-400 font-mono font-normal">
                        {c.refToken}
                      </div>
                    </td>

                    {/* Institution */}
                    <td className="py-3 px-4 max-w-xs">
                      <div className="font-semibold text-slate-800 truncate" title={c.institution.name}>
                        {c.institution.name}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate">
                        {c.category}
                      </div>
                    </td>

                    {/* Bureau */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="text-[11px] font-medium text-slate-700">
                        {c.bureau}
                      </span>
                      <div className="text-[10px] text-slate-400">
                        Officer: {c.assignedOfficer}
                      </div>
                    </td>

                    {/* Priority */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <PriorityBadge priority={c.priority} size="sm" />
                    </td>

                    {/* Delay Metric */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      {isBreached ? (
                        <div className="space-y-0.5">
                          <span className="inline-flex items-center gap-1 font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded border border-red-200">
                            <ClockAlert className="w-3 h-3 text-red-600 animate-pulse" />
                            {daysOver} days overdue
                          </span>
                          <div className="text-[10px] text-slate-400 font-mono">
                            Pending {c.daysPending}d (Target {c.slaTargetDays}d)
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-0.5">
                          <span className="inline-flex items-center gap-1 font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                            <Clock className="w-3 h-3 text-amber-600" />
                            {c.slaTargetDays - c.daysPending} days left
                          </span>
                          <div className="text-[10px] text-slate-400 font-mono">
                            Target due {c.slaTargetDate}
                          </div>
                        </div>
                      )}
                    </td>

                    {/* Recommendation */}
                    <td className="py-3 px-4 max-w-xs">
                      <div className="p-2 bg-slate-50 rounded-lg border border-slate-200 text-[11px]">
                        <span className="font-bold text-slate-800 block">
                          {recommendedAction}
                        </span>
                        {c.escalationStatus && c.escalationStatus !== 'Normal' ? (
                          <span className="inline-block mt-1 font-semibold text-emerald-700 text-[10px]">
                            ✓ Current State: {c.escalationStatus}
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-500">
                            Statutory recommendation pending officer trigger
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Escalate Action Button */}
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onSelectComplaint(c.id)}
                          className="p-1.5 text-slate-600 hover:text-blue-700 hover:bg-slate-100 rounded"
                          title="View Dossier"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setSelectedEscalationCase(c.id)}
                          className="px-2.5 py-1 text-xs font-semibold text-red-700 hover:text-white bg-red-50 hover:bg-red-700 border border-red-200 hover:border-red-700 rounded-lg transition-colors flex items-center gap-1 shadow-xs"
                        >
                          <BellRing className="w-3 h-3" />
                          <span>Escalate</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Escalation Trigger Modal */}
      {selectedEscalationCase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <form
            onSubmit={handleTriggerEscalationSubmit}
            className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 border border-slate-200 animate-in fade-in zoom-in-95 duration-150 space-y-4"
          >
            <div className="flex items-center gap-2.5 text-red-600 pb-2 border-b border-slate-100">
              <ShieldAlert className="w-5 h-5" />
              <h3 className="text-base font-bold text-slate-900">
                Trigger Statutory Escalation
              </h3>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Case <strong>{selectedEscalationCase}</strong> has exceeded permissible SLA guidelines. Select the official regulatory enforcement action to log in the case audit log:
            </p>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Escalation Protocol:
              </label>
              <select
                value={escalationType}
                onChange={(e) => setEscalationType(e.target.value as any)}
                className="w-full text-xs p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800"
              >
                <option value="Notice Issued">Issue Formal Show-Cause Compliance Notice</option>
                <option value="Surprise Inspection Scheduled">Order Surprise Physical Inspection by Regional Bureau</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Audit Remark & Reference:
              </label>
              <textarea
                value={escalationRemark}
                onChange={(e) => setEscalationRemark(e.target.value)}
                required
                placeholder="e.g. Notice dispatched under AICTE Approval Process Handbook Clause 8.2 for immediate response within 7 working days."
                rows={3}
                className="w-full text-xs p-2.5 border border-slate-300 rounded-lg bg-slate-50 focus:bg-white text-slate-800"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedEscalationCase(null)}
                className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-xs"
              >
                Confirm Escalation Notice
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
