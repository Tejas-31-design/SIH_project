import React, { useState } from 'react';
import {
  GraduationCap,
  ShieldCheck,
  AlertTriangle,
  Lock,
  Mail,
  ArrowRight,
  Info,
  CheckCircle2,
  Building,
  User,
  ExternalLink,
} from 'lucide-react';
import { DEMO_ROLES, useComplaints } from '../../context/ComplaintContext';
import type { UserRole } from '../../types';

interface LoginPageProps {
  onLoginSuccess: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const { setCurrentUser } = useComplaints();

  const [selectedRole, setSelectedRole] = useState<UserRole>(DEMO_ROLES[0]);
  const [email, setEmail] = useState<string>(DEMO_ROLES[0].email);
  const [password, setPassword] = useState<string>('••••••••••••');
  const [error, setError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setEmail(role.email);
    setPassword('••••••••••••');
    setError('');
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Please provide an official official email address.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setCurrentUser(selectedRole);
      setIsSubmitting(false);
      onLoginSuccess();
    }, 400);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-between selection:bg-blue-600 selection:text-white">
      {/* Top Govt Bar */}
      <div className="bg-white border-b border-slate-200">
        <div className="h-1 bg-gradient-to-r from-orange-500 via-white to-emerald-600" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#0b1e36] text-white flex items-center justify-center font-bold shadow-xs">
              <GraduationCap className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm sm:text-base text-slate-900 tracking-tight font-sans">
                  AICTE COMPLAINT360
                </span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                  SIH 2026: SIH26264
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                All India Council for Technical Education • Ministry of Education, Govt. of India
              </p>
            </div>
          </div>

          <div className="text-right hidden md:block">
            <span className="text-xs font-semibold text-slate-700 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200">
              Authorized Personnel Portal
            </span>
          </div>
        </div>
      </div>

      {/* Main Login Card Centerpiece */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 my-4">
        <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          
          {/* Left Column: Official Context & Overview */}
          <div className="lg:col-span-5 bg-[#0b1e36] text-white p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden">
            {/* Background pattern */}
            <div className="absolute -right-16 -bottom-16 w-56 h-56 rounded-full bg-blue-600/10 pointer-events-none blur-2xl" />

            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-200 border border-blue-400/30 mb-6">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Centralized Bureau Governance</span>
              </div>

              <h1 className="text-2xl font-bold leading-tight tracking-tight text-white font-sans">
                Unified Institution Grievance Oversight
              </h1>
              <p className="text-xs text-slate-300 mt-3 leading-relaxed">
                Complaint360 connects all AICTE Bureaus, Regional Offices, and Specialized Cells into a single transparent operating picture.
              </p>

              {/* Feature Highlights */}
              <div className="mt-8 space-y-3.5">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-md bg-blue-900/80 flex items-center justify-center shrink-0 text-blue-300 text-xs">
                    ✓
                  </div>
                  <div>
                    <h2 className="text-xs font-bold text-white">Smart Duplicate Detection</h2>
                    <p className="text-[11px] text-slate-400">Algorithmic similarity scoring across colleges & issues.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-md bg-blue-900/80 flex items-center justify-center shrink-0 text-blue-300 text-xs">
                    ✓
                  </div>
                  <div>
                    <h2 className="text-xs font-bold text-white">SLA Delay & Escalation Engine</h2>
                    <p className="text-[11px] text-slate-400">Automated breach alerts and show-cause recommendations.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-md bg-blue-900/80 flex items-center justify-center shrink-0 text-blue-300 text-xs">
                    ✓
                  </div>
                  <div>
                    <h2 className="text-xs font-bold text-white">End-to-End Activity Audit</h2>
                    <p className="text-[11px] text-slate-400">Strict transition state validation & officer accountability.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-700/60 text-[11px] text-slate-400">
              Smart India Hackathon 2026 Senior Edition
            </div>
          </div>

          {/* Right Column: Sign-in Form & Role Selector */}
          <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between">
            <div>
              {/* Disclaimer Banner Required by Prompt */}
              <div className="mb-6 p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2.5 text-xs text-amber-900">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Prototype Demonstration: </span>
                  This is an interactive evaluation prototype for SIH 2026. Real citizen or institution data is not collected or stored. Select a simulated role below to test portal capabilities.
                </div>
              </div>

              <div className="mb-4">
                <h2 className="text-lg font-bold text-slate-900">Official Sign-In</h2>
                <p className="text-xs text-slate-500">
                  Select a demonstration persona or enter your test credentials:
                </p>
              </div>

              {/* Role Cards Grid */}
              <div className="grid grid-cols-2 gap-2 mb-5">
                {DEMO_ROLES.map((r) => {
                  const isSelected = selectedRole.role === r.role;
                  return (
                    <button
                      key={r.role}
                      type="button"
                      onClick={() => handleRoleSelect(r)}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50/70 ring-1 ring-blue-600 shadow-xs'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[11px] font-bold text-slate-900 truncate">
                          {r.role}
                        </span>
                        {isSelected && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        )}
                      </div>
                      <p className="text-[10px] text-slate-600 truncate">{r.name}</p>
                      <span className="text-[9px] text-slate-400 truncate block mt-0.5 font-mono">
                        {r.bureau || r.region}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Credential Form */}
              <form onSubmit={handleLoginSubmit} className="space-y-3.5">
                {error && (
                  <div className="p-2.5 bg-red-50 text-red-700 border border-red-200 rounded-lg text-xs">
                    {error}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    AICTE Official Email ID
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="officer@aicte-india.org"
                      className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Official Password / Security Token
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600 font-mono"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-semibold shadow-md transition-colors disabled:opacity-50"
                  >
                    <span>
                      {isSubmitting ? 'Authenticating Session...' : `Enter Dashboard as ${selectedRole.role}`}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </div>

            <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
              <span>National Informatics Centre (NIC) Simulated Node</span>
              <span className="font-mono">SSL 256-Bit Mock</span>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Footer */}
      <div className="py-3 text-center text-xs text-slate-500 bg-white border-t border-slate-200">
        AICTE COMPLAINT360 • Smart India Hackathon 2026 Prototype • Problem Statement SIH26264
      </div>
    </div>
  );
};
