import React, { useState } from 'react';
import {
  CopyCheck,
  AlertTriangle,
  Building,
  CheckCircle,
  XCircle,
  Eye,
  Info,
  Sparkles,
  Layers,
  ArrowRight,
  ExternalLink,
  SlidersHorizontal,
} from 'lucide-react';
import { useComplaints } from '../../context/ComplaintContext';
import { StatusBadge } from '../common/StatusBadge';
import { PriorityBadge } from '../common/PriorityBadge';
import type { Complaint } from '../../types';

interface DuplicateDetectionViewProps {
  onSelectComplaint: (id: string) => void;
}

export const DuplicateDetectionView: React.FC<DuplicateDetectionViewProps> = ({
  onSelectComplaint,
}) => {
  const { complaints, updateDuplicateResolution } = useComplaints();

  const [minThreshold, setMinThreshold] = useState<number>(75);
  const [selectedClusterId, setSelectedClusterId] = useState<string>('DUP-101');
  const [resolutionNotice, setResolutionNotice] = useState<string>('');

  // Group complaints with duplicateGroupId
  const duplicateClusters = [
    {
      id: 'DUP-101',
      institutionName: 'Apex Institute of Technology & Engineering, Pune',
      institutionId: '1-3329011',
      category: 'Capitation / Excess Fee Demand',
      similarityScore: 94,
      scoreBreakdown: {
        institutionMatch: 40, // exact PID match
        categoryMatch: 30, // identical category
        semanticOverlap: 24, // description keywords: "1.5 Lakhs", "cash", "counseling"
      },
      rationale:
        '3 distinct students/parents reported illegal demand of ₹1,50,000 cash for B.Tech CSE counseling within 4 days.',
      cases: complaints.filter((c) => c.duplicateGroupId === 'DUP-101'),
    },
    {
      id: 'DUP-102',
      institutionName: 'Vidyapeeth Polytechnic Institute, Bengaluru',
      institutionId: '1-4412090',
      category: 'Withholding Original Certificates',
      similarityScore: 91,
      scoreBreakdown: {
        institutionMatch: 40,
        categoryMatch: 30,
        semanticOverlap: 21,
      },
      rationale:
        '2 separate students reported original 10th and 12th mark sheets withheld upon course withdrawal contrary to AICTE handbook guidelines.',
      cases: complaints.filter((c) => c.duplicateGroupId === 'DUP-102'),
    },
    {
      id: 'DUP-103',
      institutionName: 'Delhi Northern Valley College of Engineering, Delhi',
      institutionId: '1-6671289',
      category: 'Faculty Non-Payment / Harassment',
      similarityScore: 84,
      scoreBreakdown: {
        institutionMatch: 40,
        categoryMatch: 30,
        semanticOverlap: 14,
      },
      rationale:
        'Both Associate Professor and Assistant Professor filed complaints regarding 5-7 months unpaid salaries and unlawful termination.',
      cases: complaints.filter((c) => c.duplicateGroupId === 'DUP-103'),
    },
  ];

  const activeCluster =
    duplicateClusters.find((cl) => cl.id === selectedClusterId) || duplicateClusters[0];

  const handleResolveDuplicate = (caseId: string, resolution: 'Confirmed Duplicate' | 'Not Duplicate') => {
    updateDuplicateResolution(caseId, resolution);
    setResolutionNotice(`Case ${caseId} marked as "${resolution}". Retained in official record.`);
    setTimeout(() => setResolutionNotice(''), 4500);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>AICTE Automated Similarity Engine</span>
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight font-sans">
              Smart Duplicate Complaint Detection
            </h1>
            <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
              Detects repeat filings, coordinated group grievances, and identical fraud patterns against technical institutions using multi-dimensional entity matching and semantic text similarity.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
            <SlidersHorizontal className="w-4 h-4 text-slate-500" />
            <div className="text-xs">
              <span className="text-slate-500 block text-[10px] font-semibold uppercase">
                Threshold: {minThreshold}%
              </span>
              <input
                type="range"
                min="60"
                max="95"
                value={minThreshold}
                onChange={(e) => setMinThreshold(Number(e.target.value))}
                className="w-28 accent-blue-600 cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Mandatory Advisory Notice required by prompt */}
      <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3 text-xs text-amber-900 shadow-xs">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold">
            Advisory Notice on Algorithmic Similarity Scores:
          </p>
          <p className="leading-relaxed">
            Similarity scores are automated advisory suggestions to assist AICTE screening officers. They do <strong>not</strong> constitute definitive proof of duplication. In accordance with AICTE principles of natural justice, no complaints are ever automatically merged, altered, or deleted without explicit officer verification.
          </p>
        </div>
      </div>

      {resolutionNotice && (
        <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{resolutionNotice}</span>
        </div>
      )}

      {/* Main Cluster Comparison Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Clusters List (4 Cols) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Detected Duplicate Groups ({duplicateClusters.length})
            </span>
            <span className="text-[11px] text-slate-400 font-mono">
              Algorithmic Pass
            </span>
          </div>

          <div className="space-y-2.5">
            {duplicateClusters.map((cluster) => {
              const isSelected = cluster.id === activeCluster.id;
              return (
                <button
                  key={cluster.id}
                  onClick={() => setSelectedClusterId(cluster.id)}
                  className={`w-full text-left p-4 rounded-xl border transition-all ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/80 shadow-md ring-1 ring-blue-600'
                      : 'border-slate-200 bg-white hover:border-slate-300 shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="font-mono text-xs font-bold text-blue-700">
                      {cluster.id}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                        cluster.similarityScore >= 90
                          ? 'bg-red-100 text-red-800 border border-red-200'
                          : 'bg-amber-100 text-amber-800 border border-amber-200'
                      }`}
                    >
                      {cluster.similarityScore}% Match
                    </span>
                  </div>

                  <h3 className="text-xs font-bold text-slate-800 line-clamp-1">
                    {cluster.institutionName}
                  </h3>

                  <p className="text-[11px] text-slate-600 mt-1 line-clamp-2">
                    {cluster.rationale}
                  </p>

                  <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px] text-slate-500">
                    <span>{cluster.cases.length} Linked Complaints</span>
                    <span className="font-medium text-blue-700">Review Group →</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Transparent Similarity Score Logic Explainer */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-slate-800">
              <Info className="w-3.5 h-3.5 text-blue-600" />
              <span>Transparent Scoring Formula</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Total Score = Institution PID Match (40%) + Grievance Category Weight (30%) + Cosine / N-Gram Description Token Overlap (30%).
            </p>
            <p className="text-[10px] text-slate-400 italic">
              Designed for modular drop-in replacement with real PyTorch or HuggingFace sentence transformer models.
            </p>
          </div>
        </div>

        {/* Right: Selected Cluster Investigation & Action (8 Cols) */}
        <div className="lg:col-span-8 space-y-5">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-bold text-slate-900">
                    Cluster Analysis: {activeCluster.id}
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
                    Score: {activeCluster.similarityScore}%
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-0.5">
                  Target Institution: <strong>{activeCluster.institutionName}</strong>
                </p>
              </div>

              {/* Score Breakdown Bar */}
              <div className="flex items-center gap-2 text-[11px] bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
                <span>PID: <strong>{activeCluster.scoreBreakdown.institutionMatch}%</strong></span>
                <span>•</span>
                <span>Category: <strong>{activeCluster.scoreBreakdown.categoryMatch}%</strong></span>
                <span>•</span>
                <span>Semantic: <strong>{activeCluster.scoreBreakdown.semanticOverlap}%</strong></span>
              </div>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-200">
              <strong>Investigation Summary: </strong>
              {activeCluster.rationale}
            </p>

            {/* Side-by-Side Cases within Cluster */}
            <div className="space-y-4 pt-2">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Matching Complaints in this Cluster ({activeCluster.cases.length})
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeCluster.cases.map((c, index) => (
                  <div
                    key={c.id}
                    className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 shadow-xs flex flex-col justify-between space-y-3"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-xs font-bold text-blue-700">
                            {c.id}
                          </span>
                          {index === 0 && (
                            <span className="text-[10px] font-bold px-1.5 py-0.2 bg-blue-100 text-blue-800 rounded">
                              Master Case
                            </span>
                          )}
                        </div>
                        <StatusBadge status={c.status} size="sm" />
                      </div>

                      <h4 className="text-xs font-bold text-slate-800 line-clamp-2">
                        {c.subject}
                      </h4>

                      <p className="text-[11px] text-slate-600 mt-2 bg-slate-50 p-2.5 rounded border border-slate-100 leading-relaxed line-clamp-3">
                        {c.description}
                      </p>

                      <div className="mt-3 text-[11px] text-slate-500 space-y-0.5">
                        <div>Complainant: <strong>{c.complainant.name}</strong> ({c.complainant.type})</div>
                        <div>Date: <span className="font-mono">{c.submissionDate}</span></div>
                        {c.duplicateResolution && (
                          <div className="pt-1">
                            Status:{' '}
                            <strong className={c.duplicateResolution === 'Confirmed Duplicate' ? 'text-amber-700' : 'text-slate-700'}>
                              {c.duplicateResolution}
                            </strong>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Officer Review Actions */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                      <button
                        onClick={() => onSelectComplaint(c.id)}
                        className="p-1.5 text-xs text-slate-600 hover:text-blue-700 hover:bg-slate-100 rounded flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Dossier</span>
                      </button>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleResolveDuplicate(c.id, 'Not Duplicate')}
                          title="Dismiss similarity - Mark as independent case"
                          className="px-2.5 py-1 text-[11px] font-medium text-slate-700 hover:bg-slate-100 border border-slate-200 rounded-md transition-colors"
                        >
                          Not Duplicate
                        </button>
                        <button
                          onClick={() => handleResolveDuplicate(c.id, 'Confirmed Duplicate')}
                          title="Confirm duplicate and link to master case"
                          className="px-2.5 py-1 text-[11px] font-semibold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-300 rounded-md transition-colors"
                        >
                          Confirm Duplicate
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
