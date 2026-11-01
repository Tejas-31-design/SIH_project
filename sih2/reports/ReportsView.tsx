import React, { useState, useMemo } from 'react';
import {
  FileText,
  Printer,
  Download,
  Calendar,
  Building,
  CheckCircle2,
  Clock,
  Shield,
  Layers,
  GraduationCap,
} from 'lucide-react';
import { useComplaints } from '../../context/ComplaintContext';
import { AICTE_BUREAUS } from '../../data/initialComplaints';
import type { ComplaintStatus } from '../../types';

export const ReportsView: React.FC = () => {
  const { complaints } = useComplaints();

  const [dateRange, setDateRange] = useState<'All' | 'Last30' | 'Last90'>('All');
  const [reportBureau, setReportBureau] = useState<string>('All');

  const filteredComplaints = useMemo(() => {
    return complaints.filter((c) => {
      if (reportBureau !== 'All' && c.bureau !== reportBureau) return false;
      if (dateRange === 'Last30') {
        const d = new Date(c.submissionDate);
        const cutoff = new Date('2026-10-01');
        if (d < cutoff) return false;
      } else if (dateRange === 'Last90') {
        const d = new Date(c.submissionDate);
        const cutoff = new Date('2026-08-01');
        if (d < cutoff) return false;
      }
      return true;
    });
  }, [complaints, reportBureau, dateRange]);

  const total = filteredComplaints.length;
  const resolved = filteredComplaints.filter((c) => c.status === 'Resolved' || c.status === 'Closed').length;
  const pending = total - resolved;
  const overdue = filteredComplaints.filter(
    (c) => c.isOverdue && c.status !== 'Resolved' && c.status !== 'Closed'
  ).length;
  const resolutionRate = total > 0 ? Math.round((resolved / total) * 100) : 0;

  // Status breakdown
  const statusCounts: Record<ComplaintStatus, number> = {
    Submitted: 0,
    'Under Review': 0,
    Assigned: 0,
    'Awaiting Information': 0,
    Resolved: 0,
    Closed: 0,
  };
  filteredComplaints.forEach((c) => {
    statusCounts[c.status] = (statusCounts[c.status] || 0) + 1;
  });

  // Bureau summary table
  const bureauBreakdown = AICTE_BUREAUS.map((b) => {
    const list = filteredComplaints.filter((c) => c.bureau === b.name);
    const bResolved = list.filter((c) => c.status === 'Resolved' || c.status === 'Closed').length;
    const bPending = list.length - bResolved;
    const bOverdue = list.filter((c) => c.isOverdue && c.status !== 'Resolved' && c.status !== 'Closed').length;
    const rate = list.length > 0 ? Math.round((bResolved / list.length) * 100) : 0;
    return {
      name: b.name,
      code: b.shortCode,
      head: b.head,
      total: list.length,
      pending: bPending,
      resolved: bResolved,
      overdue: bOverdue,
      rate,
    };
  });

  const handlePrint = () => {
    window.print();
  };

  const exportReportCSV = () => {
    const headers = [
      'Bureau / Cell',
      'Short Code',
      'Bureau Head',
      'Total Cases',
      'Pending Cases',
      'Resolved Cases',
      'Overdue Cases',
      'Disposal Rate (%)',
    ];

    const rows = bureauBreakdown.map((b) => [
      `"${b.name}"`,
      b.code,
      `"${b.head}"`,
      b.total,
      b.pending,
      b.resolved,
      b.overdue,
      `${b.rate}%`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csvContent));
    link.setAttribute('download', `AICTE_Executive_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Controls Bar (Hidden in Print) */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs no-print">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-800 border border-blue-200 mb-2">
              <FileText className="w-3.5 h-3.5 text-blue-600" />
              <span>Official Executive Governance Docket</span>
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight font-sans">
              Statutory Complaints & Redressal Report
            </h1>
            <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
              Generate and print consolidated institutional complaint summaries formatted for high-level AICTE Council meetings, regional reviews, and parliamentary inquiry submissions.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={exportReportCSV}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg shadow-xs transition-colors"
            >
              <Download className="w-4 h-4 text-blue-600" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg shadow-xs transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Print Official Report</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 mt-4 border-t border-slate-100 text-xs">
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Select AICTE Bureau Scope:
            </label>
            <select
              value={reportBureau}
              onChange={(e) => setReportBureau(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
            >
              <option value="All">All Bureaus & Specialized Cells</option>
              {AICTE_BUREAUS.map((b) => (
                <option key={b.name} value={b.name}>
                  {b.name} ({b.shortCode})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Select Time Horizon:
            </label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value as any)}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
            >
              <option value="All">Cumulative Year-to-Date (2026)</option>
              <option value="Last30">Last 30 Days (Current Month)</option>
              <option value="Last90">Last 90 Days (Quarterly Audit)</option>
            </select>
          </div>
        </div>
      </div>

      {/* PRINT-READY OFFICIAL REPORT DOCUMENT */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-6 sm:p-10 space-y-8 print:p-0 print:border-none print:shadow-none">
        
        {/* Official Letterhead Header */}
        <div className="border-b-2 border-slate-900 pb-5 text-center space-y-1">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-[#0b1e36] text-white flex items-center justify-center font-bold text-base shadow-xs print:border print:border-black">
              <GraduationCap className="w-7 h-7 text-amber-400" />
            </div>
            <div className="text-left">
              <div className="text-base font-extrabold uppercase tracking-wide text-slate-900">
                All India Council for Technical Education
              </div>
              <div className="text-xs font-semibold text-slate-600">
                Ministry of Education, Government of India • New Delhi - 110070
              </div>
            </div>
          </div>

          <h2 className="text-lg font-bold text-slate-900 uppercase tracking-tight pt-2">
            Integrated Institution Grievance Monitoring & Redressal Report
          </h2>
          <p className="text-xs text-slate-500 font-mono">
            Document Reference: AICTE/COMP360/SIH26264/REP-2026 • Generated on {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}
          </p>
        </div>

        {/* Executive Summary Metrics */}
        <div>
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
            1. Executive Key Performance Summary
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-[10px] text-slate-500 uppercase font-bold block">
                Total Complaints
              </span>
              <span className="text-xl font-extrabold text-slate-900 font-mono mt-0.5 block">
                {total}
              </span>
            </div>

            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
              <span className="text-[10px] text-emerald-800 uppercase font-bold block">
                Resolved & Disposed
              </span>
              <span className="text-xl font-extrabold text-emerald-900 font-mono mt-0.5 block">
                {resolved} ({resolutionRate}%)
              </span>
            </div>

            <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl">
              <span className="text-[10px] text-blue-800 uppercase font-bold block">
                Pending Investigation
              </span>
              <span className="text-xl font-extrabold text-blue-900 font-mono mt-0.5 block">
                {pending}
              </span>
            </div>

            <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
              <span className="text-[10px] text-red-800 uppercase font-bold block">
                Overdue (SLA Breached)
              </span>
              <span className="text-xl font-extrabold text-red-900 font-mono mt-0.5 block">
                {overdue}
              </span>
            </div>
          </div>
        </div>

        {/* Status Distribution Grid */}
        <div>
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
            2. Stage-Wise Workflow Breakdown
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-xs">
            {Object.entries(statusCounts).map(([st, cnt]) => (
              <div key={st} className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-[10px] text-slate-500 block truncate">{st}</span>
                <span className="text-sm font-bold text-slate-900 font-mono mt-0.5 block">
                  {cnt} cases
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Bureau-wise Comparison Table */}
        <div>
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
            3. Bureau & Specialized Cell Performance Ledger
          </h3>
          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 text-[11px]">
                  <th className="py-2.5 px-3">Bureau / Cell</th>
                  <th className="py-2.5 px-3">Lead Official</th>
                  <th className="py-2.5 px-3 text-center">Total</th>
                  <th className="py-2.5 px-3 text-center">Pending</th>
                  <th className="py-2.5 px-3 text-center">Resolved</th>
                  <th className="py-2.5 px-3 text-center">Overdue</th>
                  <th className="py-2.5 px-3 text-right">Disposal Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {bureauBreakdown.map((row) => (
                  <tr key={row.name} className="hover:bg-slate-50/60">
                    <td className="py-2.5 px-3 font-semibold text-slate-900">
                      {row.name} ({row.code})
                    </td>
                    <td className="py-2.5 px-3 text-slate-600">
                      {row.head}
                    </td>
                    <td className="py-2.5 px-3 text-center font-mono font-bold">
                      {row.total}
                    </td>
                    <td className="py-2.5 px-3 text-center font-mono text-blue-700 font-bold">
                      {row.pending}
                    </td>
                    <td className="py-2.5 px-3 text-center font-mono text-emerald-700 font-bold">
                      {row.resolved}
                    </td>
                    <td className="py-2.5 px-3 text-center font-mono text-red-600 font-bold">
                      {row.overdue}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-800">
                      {row.rate}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Official Sign-off Block for Print */}
        <div className="pt-8 border-t border-slate-200 grid grid-cols-2 gap-8 text-xs text-slate-700">
          <div>
            <div className="h-10 border-b border-slate-300 w-48 mb-1" />
            <span className="font-bold block">Prof. Alok Ranjan</span>
            <span className="text-[11px] text-slate-500">Member Secretary, AICTE</span>
          </div>
          <div className="text-right">
            <div className="h-10 border-b border-slate-300 w-48 ml-auto mb-1" />
            <span className="font-bold block">Prof. Rajeev Kumar Sharma</span>
            <span className="text-[11px] text-slate-500">Chief Coordinator, Grievance Oversight Wing</span>
          </div>
        </div>

        {/* Disclaimer Footer */}
        <div className="pt-4 border-t border-slate-100 text-[10px] text-slate-400 text-center">
          Generated via AICTE Complaint360 Integrated Portal • SIH 2026 Evaluation Prototype (Problem ID: SIH26264) • Simulated Data
        </div>

      </div>
    </div>
  );
};
