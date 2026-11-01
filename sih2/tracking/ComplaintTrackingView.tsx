import React, { useState } from 'react';
import {
  SearchCode,
  Search,
  CheckCircle2,
  Clock,
  Building,
  User,
  Shield,
  FileText,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  Copy,
  Check,
} from 'lucide-react';
import { useComplaints } from '../../context/ComplaintContext';
import { StatusBadge } from '../common/StatusBadge';
import { PriorityBadge } from '../common/PriorityBadge';
import type { ComplaintStatus } from '../../types';

interface ComplaintTrackingViewProps {
  onSelectComplaint: (id: string) => void;
}

export const ComplaintTrackingView: React.FC<ComplaintTrackingViewProps> = ({
  onSelectComplaint,
}) => {
  const { complaints } = useComplaints();

  const [searchToken, setSearchToken] = useState('AICTE-2026-B101');
  const [copied, setCopied] = useState(false);

  // Find complaint matching ID or Token
  const matchedComplaint = complaints.find(
    (c) =>
      c.id.toLowerCase() === searchToken.trim().toLowerCase() ||
      c.refToken.toLowerCase() === searchToken.trim().toLowerCase()
  );

  const trackingSteps: { status: ComplaintStatus; label: string; desc: string }[] = [
    { status: 'Submitted', label: '1. Ingestion', desc: 'Case received via portal' },
    { status: 'Under Review', label: '2. Screening', desc: 'Central triage scrutiny' },
    { status: 'Assigned', label: '3. Bureau Assigned', desc: 'Allocated to officer' },
    { status: 'Awaiting Information', label: '4. Clarification', desc: 'Notice/Evidence audit' },
    { status: 'Resolved', label: '5. Action Taken', desc: 'Redressal finalized' },
    { status: 'Closed', label: '6. Closed', desc: 'ATR filed & archived' },
  ];

  const getStepState = (stepStatus: ComplaintStatus, currentStatus: ComplaintStatus) => {
    const order: ComplaintStatus[] = [
      'Submitted',
      'Under Review',
      'Assigned',
      'Awaiting Information',
      'Resolved',
      'Closed',
    ];

    const currentIdx = order.indexOf(currentStatus);
    const stepIdx = order.indexOf(stepStatus);

    if (currentIdx > stepIdx) return 'completed';
    if (currentIdx === stepIdx) return 'active';
    return 'pending';
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-800 border border-blue-200 mb-2">
              <SearchCode className="w-3.5 h-3.5 text-blue-600" />
              <span>Real-Time Case Dossier Lookup</span>
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight font-sans">
              Complaint Tracking & Milestone Verification
            </h1>
            <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
              Verify lifecycle progress, active milestones, investigating officer assignment, and statutory SLA compliance using either the official AICTE Case ID or the public citizen tracking token.
            </p>
          </div>
        </div>

        {/* Search Bar & Quick Demo Chips */}
        <div className="mt-5 space-y-3">
          <div className="relative max-w-xl">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              placeholder="Enter Case ID (e.g., AICTE-2026-B101) or Token (e.g., TRK-981201)..."
              value={searchToken}
              onChange={(e) => setSearchToken(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-mono focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600 shadow-xs"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-500 font-medium">Demo Samples:</span>
            {['AICTE-2026-B101', 'AICTE-2026-B104', 'AICTE-2026-B106', 'AICTE-2026-B107', 'TRK-221101'].map((sample) => (
              <button
                key={sample}
                onClick={() => setSearchToken(sample)}
                className="px-2.5 py-1 font-mono text-[11px] bg-slate-100 hover:bg-blue-50 hover:text-blue-700 rounded-md border border-slate-200 transition-colors"
              >
                {sample}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Case Tracking Results Card */}
      {!matchedComplaint ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-500 space-y-3 shadow-xs">
          <SearchCode className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-sm font-bold text-slate-800">No Record Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            No active complaint found matching "{searchToken}". Verify the reference number or pick one of the sample cases above.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
          
          {/* Top Case Summary Ribbon */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-100">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-base font-extrabold font-mono text-blue-700">
                  {matchedComplaint.id}
                </span>
                <button
                  onClick={() => handleCopy(matchedComplaint.id)}
                  title="Copy Case ID"
                  className="p-1 text-slate-400 hover:text-slate-700 rounded"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
                <StatusBadge status={matchedComplaint.status} size="md" />
                <PriorityBadge priority={matchedComplaint.priority} size="md" />
              </div>
              <h2 className="text-sm font-bold text-slate-900 mt-2">
                {matchedComplaint.subject}
              </h2>
              <p className="text-xs text-slate-600 mt-0.5">
                Target Institution: <strong>{matchedComplaint.institution.name}</strong> ({matchedComplaint.institution.city}, {matchedComplaint.institution.state})
              </p>
            </div>

            <button
              onClick={() => onSelectComplaint(matchedComplaint.id)}
              className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors flex items-center gap-2 shrink-0"
            >
              <span>Open Complete Case Dossier</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Visual Milestone Stepper */}
          <div>
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4">
              Lifecycle Progress Stepper
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {trackingSteps.map((step) => {
                const state = getStepState(step.status, matchedComplaint.status);

                return (
                  <div
                    key={step.status}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      state === 'completed'
                        ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950'
                        : state === 'active'
                        ? 'bg-blue-50 border-blue-600 ring-2 ring-blue-600/20 text-blue-950 shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[11px] font-bold">
                        {step.label}
                      </span>
                      {state === 'completed' ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      ) : state === 'active' ? (
                        <div className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-ping shrink-0" />
                      ) : (
                        <div className="w-2 h-2 rounded-full bg-slate-300 shrink-0" />
                      )}
                    </div>
                    <p className="text-[10px] leading-tight opacity-80">
                      {step.desc}
                    </p>
                    {state === 'active' && (
                      <span className="inline-block mt-2 text-[9px] font-bold text-blue-700 uppercase tracking-wider bg-white px-1.5 py-0.2 rounded border border-blue-200">
                        Current Stage
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Case Details & SLA Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-100 text-xs">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500 block text-[11px]">Jurisdiction Bureau</span>
              <span className="font-bold text-slate-800 text-sm mt-0.5 block">
                {matchedComplaint.bureau}
              </span>
              <span className="text-slate-600 text-[11px] mt-1 block">
                Assigned: {matchedComplaint.assignedOfficer}
              </span>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500 block text-[11px]">Submission & Aging</span>
              <span className="font-bold text-slate-800 text-sm mt-0.5 block">
                {matchedComplaint.submissionDate}
              </span>
              <span className="text-slate-600 text-[11px] mt-1 block">
                {matchedComplaint.daysPending} days since intake
              </span>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500 block text-[11px]">Citizen Charter SLA</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="font-bold text-slate-800 text-sm">
                  {matchedComplaint.slaTargetDays} Days Target
                </span>
                <span className="text-[11px] text-slate-500 font-mono">
                  ({matchedComplaint.slaTargetDate})
                </span>
              </div>
              <div className="mt-1 text-[11px]">
                {matchedComplaint.isOverdue ? (
                  <span className="text-red-700 font-bold flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Overdue by {matchedComplaint.daysPending - matchedComplaint.slaTargetDays} days
                  </span>
                ) : (
                  <span className="text-emerald-700 font-semibold">
                    Within approved target window
                  </span>
                )}
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};
