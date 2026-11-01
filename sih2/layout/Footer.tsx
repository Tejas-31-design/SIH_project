import React from 'react';
import { Shield, ExternalLink, HelpCircle } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-white text-slate-500 text-xs py-4 px-6 no-print">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 max-w-7xl mx-auto">
        <div className="flex items-center gap-2 text-center sm:text-left">
          <Shield className="w-4 h-4 text-blue-600 shrink-0" />
          <span>
            <strong className="text-slate-800">AICTE COMPLAINT360</strong> • All India Council for Technical Education • SIH 2026 (Problem ID: SIH26264)
          </span>
        </div>

        <div className="flex items-center gap-4 text-slate-500 text-[11px]">
          <span className="bg-amber-50 text-amber-800 px-2 py-0.5 rounded border border-amber-200 font-medium">
            Demo Environment (Simulated Data)
          </span>
          <span className="hidden md:inline">•</span>
          <span className="hidden md:inline">SLA Engine v2.4</span>
          <span className="hidden md:inline">•</span>
          <span className="flex items-center gap-1 hover:text-slate-700 cursor-pointer">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Official Guide</span>
          </span>
        </div>
      </div>
    </footer>
  );
};
