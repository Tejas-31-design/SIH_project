import React, { useState } from 'react';
import {
  X,
  Building,
  User,
  Clock,
  Shield,
  FileText,
  Paperclip,
  CheckCircle,
  AlertTriangle,
  Send,
  Lock,
  ArrowRight,
  ExternalLink,
  Printer,
  Calendar,
  MessageSquare,
  History,
  AlertOctagon,
  RefreshCw,
} from 'lucide-react';
import type { Complaint, ComplaintStatus, BureauCell } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { PriorityBadge } from '../common/PriorityBadge';
import { useComplaints, VALID_TRANSITIONS } from '../../context/ComplaintContext';
import { AICTE_BUREAUS, AICTE_OFFICERS } from '../../data/initialComplaints';

interface ComplaintDetailModalProps {
  complaintId: string;
  onClose: () => void;
}

export const ComplaintDetailModal: React.FC<ComplaintDetailModalProps> = ({
  complaintId,
  onClose,
}) => {
  const {
    complaints,
    currentUser,
    updateComplaintStatus,
    assignComplaint,
    addInternalNote,
    triggerEscalation,
  } = useComplaints();

  const complaint = complaints.find((c) => c.id === complaintId);

  const [activeTab, setActiveTab] = useState<'details' | 'timeline' | 'notes' | 'actions'>('details');
  const [targetStatus, setTargetStatus] = useState<ComplaintStatus | ''>('');
  const [statusRemark, setStatusRemark] = useState('');
  const [statusError, setStatusError] = useState('');
  const [showStatusConfirm, setShowStatusConfirm] = useState(false);

  // Reassignment state
  const [targetBureau, setTargetBureau] = useState<BureauCell | ''>('');
  const [targetOfficer, setTargetOfficer] = useState('');
  const [assignRemark, setAssignRemark] = useState('');
  const [assignSuccess, setAssignSuccess] = useState('');

  // Internal note state
  const [noteText, setNoteText] = useState('');
  const [isConfidential, setIsConfidential] = useState(true);

  if (!complaint) return null;

  const allowedTransitions = VALID_TRANSITIONS[complaint.status] || [];

  const handleStatusChangeClick = () => {
    if (!targetStatus) {
      setStatusError('Please choose a valid next status.');
      return;
    }
    if (!statusRemark.trim()) {
      setStatusError('Mandatory remark is required for official audit tracking.');
      return;
    }
    setStatusError('');
    setShowStatusConfirm(true);
  };

  const confirmStatusUpdate = () => {
    if (!targetStatus) return;
    const res = updateComplaintStatus(complaint.id, targetStatus, statusRemark);
    if (res.success) {
      setShowStatusConfirm(false);
      setTargetStatus('');
      setStatusRemark('');
    } else {
      setStatusError(res.message);
      setShowStatusConfirm(false);
    }
  };

  const handleAssignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetBureau || !targetOfficer) return;
    assignComplaint(complaint.id, targetOfficer, targetBureau, assignRemark);
    setAssignSuccess('Case successfully re-assigned to officer.');
    setAssignRemark('');
    setTimeout(() => setAssignSuccess(''), 4000);
  };

  const handleAddNoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteText.trim()) return;
    addInternalNote(complaint.id, noteText, isConfidential);
    setNoteText('');
  };

  const availableOfficers = targetBureau
    ? AICTE_OFFICERS.filter((o) => o.bureau === targetBureau)
    : AICTE_OFFICERS;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-700 text-white flex items-center justify-center font-mono font-bold text-sm shadow-xs">
              AICTE
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900 font-mono">
                  {complaint.id}
                </h2>
                <StatusBadge status={complaint.status} size="sm" />
                <PriorityBadge priority={complaint.priority} size="sm" />
                {complaint.isOverdue && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-800 border border-red-200 animate-pulse">
                    SLA Breached ({complaint.daysPending}d)
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Ref Token: <span className="font-mono text-slate-700 font-semibold">{complaint.refToken}</span> • Registered on {complaint.submissionDate}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              title="Print Case Dossier"
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 rounded-lg transition-colors"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="px-6 border-b border-slate-200 bg-white flex items-center gap-6 text-xs font-semibold shrink-0">
          <button
            onClick={() => setActiveTab('details')}
            className={`py-3 border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'details'
                ? 'border-blue-600 text-blue-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Case Overview & Institution</span>
          </button>

          <button
            onClick={() => setActiveTab('timeline')}
            className={`py-3 border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'timeline'
                ? 'border-blue-600 text-blue-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <History className="w-4 h-4" />
            <span>Activity Audit Trail ({complaint.activityTimeline.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('notes')}
            className={`py-3 border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'notes'
                ? 'border-blue-600 text-blue-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Confidential Notes ({complaint.internalNotes.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('actions')}
            className={`py-3 border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'actions'
                ? 'border-blue-600 text-blue-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <RefreshCw className="w-4 h-4 text-amber-500" />
            <span>Workflow Actions & Reassignment</span>
          </button>
        </div>

        {/* Modal Body / Scrollable Content */}
        <div className="p-6 overflow-y-auto flex-1 bg-slate-50/50 space-y-6">

          {/* TAB 1: CASE DETAILS & INSTITUTION */}
          {activeTab === 'details' && (
            <div className="space-y-6">
              {/* Institution Card */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                  <div className="flex items-center gap-2">
                    <Building className="w-5 h-5 text-blue-600" />
                    <h3 className="text-sm font-bold text-slate-900">
                      Technical Institution Information
                    </h3>
                  </div>
                  <span className="text-xs font-mono font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                    AICTE PID: {complaint.institution.id}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-slate-500 block text-[11px]">Institute Name</span>
                    <span className="font-semibold text-slate-800 text-sm">
                      {complaint.institution.name}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Location & State</span>
                    <span className="font-medium text-slate-800">
                      {complaint.institution.city}, {complaint.institution.state}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Institution Category</span>
                    <span className="font-medium text-slate-800">
                      {complaint.institution.type} • {complaint.institution.accreditation}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Head of Institution</span>
                    <span className="font-medium text-slate-800">
                      {complaint.institution.headName} ({complaint.institution.headEmail})
                    </span>
                  </div>
                </div>
              </div>

              {/* Grievance Summary & Complainant */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    {complaint.category}
                  </span>
                  <h4 className="text-base font-bold text-slate-900 mt-2">
                    {complaint.subject}
                  </h4>
                  <p className="text-xs text-slate-700 mt-2 leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-200">
                    {complaint.description}
                  </p>
                </div>

                {/* Complainant Privacy Info */}
                <div className="pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <span className="text-slate-500 block text-[11px]">Complainant Type</span>
                    <span className="font-semibold text-slate-800">
                      {complaint.complainant.type} {complaint.complainant.anonymized && '(Whistleblower Identity Protected)'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Complainant Name</span>
                    <span className="font-medium text-slate-800">
                      {complaint.complainant.name}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Contact Record</span>
                    <span className="font-mono text-slate-700">
                      {complaint.complainant.email}
                    </span>
                  </div>
                </div>

                {/* Evidence Attachments */}
                <div className="pt-3 border-t border-slate-100">
                  <span className="text-xs font-bold text-slate-700 block mb-2">
                    Supporting Verification Documents ({complaint.attachments.length})
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {complaint.attachments.map((file, idx) => (
                      <div
                        key={idx}
                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-lg text-xs text-slate-700 hover:text-blue-700 transition-colors cursor-pointer"
                      >
                        <Paperclip className="w-3.5 h-3.5 text-blue-600" />
                        <span className="font-medium font-mono">{file.name}</span>
                        <span className="text-[10px] text-slate-400">({file.size})</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bureau Assignment & SLA Target */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                  <span className="text-slate-500 text-[11px] block">Assigned AICTE Bureau</span>
                  <span className="font-bold text-slate-900 text-sm mt-0.5 block">
                    {complaint.bureau}
                  </span>
                  <span className="text-xs text-slate-600 mt-1 block">
                    Investigating Officer: <strong>{complaint.assignedOfficer}</strong>
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono block">
                    {complaint.officerDesignation} • {complaint.officerEmail}
                  </span>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                  <span className="text-slate-500 text-[11px] block">SLA Target & Urgency</span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="font-bold text-slate-900 text-sm">
                      {complaint.slaTargetDays} Days Resolution Target
                    </span>
                    <span className="text-xs text-slate-500">
                      (Due: {complaint.slaTargetDate})
                    </span>
                  </div>
                  <div className="mt-2 text-xs">
                    {complaint.isOverdue ? (
                      <span className="text-red-600 font-semibold flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        Breached by {complaint.daysPending - complaint.slaTargetDays} days
                      </span>
                    ) : (
                      <span className="text-emerald-700 font-semibold flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5" />
                        Within permissible SLA window
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ACTIVITY AUDIT TRAIL */}
          {activeTab === 'timeline' && (
            <div className="space-y-4">
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 flex items-center gap-2">
                <Shield className="w-4 h-4 text-blue-600 shrink-0" />
                <span>
                  All actions, reassignments, and state transitions are cryptographically timestamped in accordance with AICTE grievance audit standards.
                </span>
              </div>

              <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                {complaint.activityTimeline.map((item) => (
                  <div key={item.id} className="relative group">
                    {/* Timeline Node Icon */}
                    <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-white border-2 border-blue-600 group-hover:scale-110 transition-transform shadow-xs flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h5 className="text-xs font-bold text-slate-900">
                          {item.action}
                        </h5>
                        <span className="text-[11px] font-mono text-slate-500">
                          {item.timestamp}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        {item.details}
                      </p>
                      <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                        <span>Action Actor: <strong className="text-slate-600">{item.actor}</strong></span>
                        {item.toStatus && (
                          <span className="font-semibold text-blue-700">
                            Status: {item.toStatus}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: CONFIDENTIAL INTERNAL NOTES */}
          {activeTab === 'notes' && (
            <div className="space-y-6">
              {/* Add Note Form */}
              <form onSubmit={handleAddNoteSubmit} className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-amber-600" />
                    <span>Add Official Confidential Remark / Note</span>
                  </h4>
                  <label className="flex items-center gap-1.5 text-xs text-slate-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isConfidential}
                      onChange={(e) => setIsConfidential(e.target.checked)}
                      className="rounded text-blue-600 focus:ring-blue-500"
                    />
                    <span>Confidential (Officers Only)</span>
                  </label>
                </div>

                <textarea
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder="Record verification notes, telephonic inquiry remarks, or regional office instructions..."
                  rows={3}
                  className="w-full text-xs p-3 border border-slate-300 rounded-lg bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600 text-slate-800"
                />

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={!noteText.trim()}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-700 hover:bg-blue-800 disabled:opacity-50 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Log Note to Case</span>
                  </button>
                </div>
              </form>

              {/* Existing Notes Thread */}
              <div className="space-y-3">
                {complaint.internalNotes.length === 0 ? (
                  <div className="text-center py-8 bg-white rounded-xl border border-dashed border-slate-200 text-xs text-slate-500">
                    No internal notes logged on this case yet. Use the form above to add an observation.
                  </div>
                ) : (
                  complaint.internalNotes.map((note) => (
                    <div
                      key={note.id}
                      className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs"
                    >
                      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-slate-800">
                            {note.officerName}
                          </span>
                          <span className="text-[10px] text-slate-500">
                            ({note.officerRole})
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {note.isConfidential && (
                            <span className="px-1.5 py-0.2 text-[9px] font-bold rounded bg-amber-100 text-amber-800 border border-amber-200">
                              Confidential
                            </span>
                          )}
                          <span className="text-[10px] font-mono text-slate-400">
                            {note.timestamp}
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-slate-700 mt-2 leading-relaxed">
                        {note.text}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 4: WORKFLOW STATUS UPDATE & REASSIGNMENT */}
          {activeTab === 'actions' && (
            <div className="space-y-6">
              {/* Section A: Status Transition */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">
                      Controlled Status Transition
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Current Case Status: <strong className="text-blue-700">{complaint.status}</strong>
                    </p>
                  </div>
                  <span className="text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded font-mono">
                    State Machine Guard Active
                  </span>
                </div>

                {statusError && (
                  <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-lg text-xs">
                    {statusError}
                  </div>
                )}

                <div className="space-y-3">
                  <label className="block text-xs font-semibold text-slate-700">
                    Select Next Valid Status:
                  </label>
                  
                  {allowedTransitions.length === 0 ? (
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600">
                      This complaint has reached its terminal state ({complaint.status}). No standard transitions are available unless formally reopened by Member Secretary.
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {allowedTransitions.map((st) => (
                        <button
                          key={st}
                          type="button"
                          onClick={() => setTargetStatus(st)}
                          className={`p-2.5 text-xs font-semibold rounded-lg border text-left transition-all ${
                            targetStatus === st
                              ? 'border-blue-600 bg-blue-50 text-blue-800 ring-1 ring-blue-600 shadow-xs'
                              : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span>{st}</span>
                            {targetStatus === st && (
                              <CheckCircle className="w-3.5 h-3.5 text-blue-600" />
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Mandatory Transition Audit Remark:
                    </label>
                    <textarea
                      value={statusRemark}
                      onChange={(e) => setStatusRemark(e.target.value)}
                      placeholder="Explain justification for this status change (e.g., 'Institution submitted compliance documents', 'Show-cause notice answered')..."
                      rows={2}
                      className="w-full text-xs p-2.5 border border-slate-300 rounded-lg bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600 text-slate-800"
                    />
                  </div>

                  {allowedTransitions.length > 0 && (
                    <button
                      type="button"
                      onClick={handleStatusChangeClick}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
                    >
                      <span>Apply Status Transition</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Status Change Confirmation Modal */}
              {showStatusConfirm && (
                <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
                  <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
                    <div className="flex items-center gap-3 text-amber-600 mb-3">
                      <AlertOctagon className="w-6 h-6" />
                      <h4 className="text-base font-bold text-slate-900">
                        Confirm Status Transition
                      </h4>
                    </div>
                    <p className="text-xs text-slate-600 mb-2 leading-relaxed">
                      You are about to change the official status of case <strong>{complaint.id}</strong> from{' '}
                      <span className="font-semibold text-slate-800">"{complaint.status}"</span> to{' '}
                      <span className="font-semibold text-blue-700">"{targetStatus}"</span>.
                    </p>
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono text-slate-700 mb-4">
                      Remark: "{statusRemark}"
                    </div>
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setShowStatusConfirm(false)}
                        className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={confirmStatusUpdate}
                        className="px-4 py-1.5 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg shadow-xs"
                      >
                        Yes, Confirm Change
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Section B: Reassign Bureau / Officer */}
              <form onSubmit={handleAssignSubmit} className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
                <div className="pb-3 border-b border-slate-100">
                  <h4 className="text-xs font-bold text-slate-900">
                    Re-assign AICTE Bureau / Investigating Officer
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Transfer case jurisdiction to a different specialized cell.
                  </p>
                </div>

                {assignSuccess && (
                  <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs">
                    {assignSuccess}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Target AICTE Bureau / Cell:
                    </label>
                    <select
                      value={targetBureau}
                      onChange={(e) => {
                        setTargetBureau(e.target.value as BureauCell);
                        setTargetOfficer('');
                      }}
                      className="w-full text-xs p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800"
                    >
                      <option value="">-- Choose Bureau --</option>
                      {AICTE_BUREAUS.map((b) => (
                        <option key={b.name} value={b.name}>
                          {b.name} ({b.shortCode})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Target Investigating Officer:
                    </label>
                    <select
                      value={targetOfficer}
                      onChange={(e) => setTargetOfficer(e.target.value)}
                      disabled={!targetBureau}
                      className="w-full text-xs p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 disabled:opacity-50"
                    >
                      <option value="">-- Choose Officer --</option>
                      {availableOfficers.map((o) => (
                        <option key={o.id} value={o.name}>
                          {o.name} ({o.designation})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Reassignment Rationale:
                  </label>
                  <input
                    type="text"
                    value={assignRemark}
                    onChange={(e) => setAssignRemark(e.target.value)}
                    placeholder="e.g. Case involves faculty 7th CPC violations outside standard approvals scope"
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-lg bg-slate-50 focus:bg-white text-slate-800"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={!targetBureau || !targetOfficer}
                    className="px-4 py-2 bg-blue-700 hover:bg-blue-800 disabled:opacity-50 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
                  >
                    Execute Bureau Reassignment
                  </button>
                </div>
              </form>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <span>AICTE Complaint360 • SIH26264 Protocol</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 font-semibold text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
          >
            Close Dossier
          </button>
        </div>

      </div>
    </div>
  );
};
