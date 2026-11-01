import React, { useState } from 'react';
import {
  Settings,
  RotateCcw,
  ShieldCheck,
  Sliders,
  UserCheck,
  Lock,
  Database,
  Info,
  CheckCircle2,
  AlertTriangle,
  Server,
  FileCode,
} from 'lucide-react';
import { useComplaints, DEMO_ROLES } from '../../context/ComplaintContext';
import type { SLAConfig, UserRole } from '../../types';

export const SettingsView: React.FC = () => {
  const {
    complaints,
    slaConfig,
    updateSLAConfig,
    currentUser,
    setCurrentUser,
    resetDemoData,
  } = useComplaints();

  const [slaForm, setSlaForm] = useState<SLAConfig>(slaConfig);
  const [successMsg, setSuccessMsg] = useState('');
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleSlaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSLAConfig(slaForm);
    setSuccessMsg('SLA configuration updated successfully across the platform.');
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handleRoleSelect = (role: UserRole) => {
    setCurrentUser(role);
    setSuccessMsg(`Session role switched to ${role.role} (${role.name}).`);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handleConfirmReset = () => {
    resetDemoData();
    setSlaForm({ Urgent: 7, High: 15, Medium: 30, Low: 45 });
    setShowResetConfirm(false);
    setSuccessMsg('All 32+ demo complaints, timeline logs, and notes have been reset to pristine baseline state.');
    setTimeout(() => setSuccessMsg(''), 5000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-800 border border-blue-200 mb-2">
              <Settings className="w-3.5 h-3.5 text-blue-600" />
              <span>System & Sandbox Administration</span>
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight font-sans">
              Portal Settings & Prototype Controls
            </h1>
            <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
              Configure simulated SLA escalation intervals, switch demo officer roles, review security safeguards, or reset the sample dataset anytime.
            </p>
          </div>

          <button
            onClick={() => setShowResetConfirm(true)}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors flex items-center gap-2 shrink-0"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Demo Data</span>
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="p-3.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Grid: SLA Settings & Role Switcher */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: SLA Thresholds Form (6 Cols) */}
        <div className="lg:col-span-6 bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="pb-3 border-b border-slate-100 flex items-center gap-2">
            <Sliders className="w-4 h-4 text-blue-600" />
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Citizen Charter SLA Thresholds
            </h2>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Specify the maximum allowed resolution turnaround days before a complaint triggers automated statutory delays and show-cause notice recommendations.
          </p>

          <form onSubmit={handleSlaSubmit} className="space-y-3.5 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Urgent Priority (Ragging / Severe):
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={slaForm.Urgent}
                    onChange={(e) => setSlaForm({ ...slaForm, Urgent: Number(e.target.value) })}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 font-mono"
                  />
                  <span className="absolute right-3 top-2 text-slate-400 text-xs">days</span>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  High Priority (Capitation / Certificates):
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    max="60"
                    value={slaForm.High}
                    onChange={(e) => setSlaForm({ ...slaForm, High: Number(e.target.value) })}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 font-mono"
                  />
                  <span className="absolute right-3 top-2 text-slate-400 text-xs">days</span>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Medium Priority (Faculty / Fee):
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    max="90"
                    value={slaForm.Medium}
                    onChange={(e) => setSlaForm({ ...slaForm, Medium: Number(e.target.value) })}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 font-mono"
                  />
                  <span className="absolute right-3 top-2 text-slate-400 text-xs">days</span>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Low Priority (General Inquiries):
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    max="120"
                    value={slaForm.Low}
                    onChange={(e) => setSlaForm({ ...slaForm, Low: Number(e.target.value) })}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 font-mono"
                  />
                  <span className="absolute right-3 top-2 text-slate-400 text-xs">days</span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg font-semibold shadow-xs transition-colors"
              >
                Save SLA Benchmarks
              </button>
            </div>
          </form>
        </div>

        {/* Right: Simulated Role Switcher (6 Cols) */}
        <div className="lg:col-span-6 bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-blue-600" />
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Authorized Demo Persona
              </h2>
            </div>
            <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono">
              Role-Based Access
            </span>
          </div>

          <div className="space-y-2 text-xs">
            {DEMO_ROLES.map((r) => {
              const isSelected = currentUser.role === r.role;
              return (
                <div
                  key={r.role}
                  onClick={() => handleRoleSelect(r)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/70 ring-1 ring-blue-600 shadow-xs'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{r.role}</span>
                      {isSelected && (
                        <span className="text-[10px] font-bold text-blue-700 bg-white px-2 py-0.2 rounded border border-blue-200">
                          Active
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-600 mt-0.5">
                      {r.name} • <span className="font-mono text-slate-400">{r.email}</span>
                    </p>
                  </div>
                  {isSelected ? (
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  ) : (
                    <span className="text-[11px] font-semibold text-blue-700">Switch</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Security & Data Privacy Compliance Card (Required by Prompt) */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5 text-slate-900 pb-3 border-b border-slate-100">
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
          <h2 className="text-sm font-bold uppercase tracking-wider">
            Security, Privacy & Architecture Standards (SIH26264)
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-600">
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
            <span className="font-bold text-slate-800 flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-blue-600" />
              <span>Synthetic Fictional Data</span>
            </span>
            <p className="text-[11px] leading-relaxed">
              All institution names, complainant identities, registration codes, and documents in this portal are synthetic test records created solely for Smart India Hackathon evaluation. No real citizen PII is exposed.
            </p>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
            <span className="font-bold text-slate-800 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-blue-600" />
              <span>Zero Hardcoded Secrets</span>
            </span>
            <p className="text-[11px] leading-relaxed">
              No private backend API keys, JWT master secrets, or privileged service-account credentials are bundled inside client-side source code. Real production deployment requires server-side OAuth2 and mTLS.
            </p>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
            <span className="font-bold text-slate-800 flex items-center gap-1.5">
              <Server className="w-3.5 h-3.5 text-blue-600" />
              <span>Backend Agnostic Prototype</span>
            </span>
            <p className="text-[11px] leading-relaxed">
              The front-end state management is decoupled so that Firebase Firestore, PostgreSQL, or NIC National Data Centre REST APIs can be plugged in without refactoring UI components.
            </p>
          </div>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-6 border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-2.5 text-red-600 mb-3">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="text-base font-bold text-slate-900">
                Confirm Factory Reset
              </h3>
            </div>
            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              Are you sure you want to reset all data? This will restore all 32+ original sample complaints, remove added internal notes, and revert modified statuses.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReset}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-xs"
              >
                Yes, Reset All Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
