import React from 'react';
import { useApp, ToolId } from '../../context/AppContext';
import { GlassCard } from '../common/GlassCard';
import {
  Globe,
  FileCheck,
  Mail,
  CopyCheck,
  BookMarked,
  Sparkles,
  Lock,
  KeyRound,
  ArrowRight,
  Home,
} from 'lucide-react';

import { IpCheckerTool } from './IpCheckerTool';
import { ReportCheckerTool } from './ReportCheckerTool';
import { EmailOrganizerTool } from './EmailOrganizerTool';
import { DuplicateCheckerTool } from './DuplicateCheckerTool';
import { NameStoreTool } from './NameStoreTool';
import { NameGeneratorTool } from './NameGeneratorTool';
import { PasswordGeneratorTool } from './PasswordGeneratorTool';
import { TotpTool } from './TotpTool';

export const ToolsHub: React.FC = () => {
  const { activeToolId, setActiveToolId, setCurrentPage, currentUser } = useApp();

  // The 8 tools explicitly requested by the user
  const toolDefinitions: Array<{
    id: ToolId;
    title: string;
    description: string;
    category: string;
    icon: React.ComponentType<{ className?: string }>;
    accentColor: string;
  }> = [
    {
      id: 'ip-checker',
      title: 'IP Checker',
      description: 'Inspect public gateway, routing ASN, latency ping response, and user agent telemetry.',
      category: 'Network',
      icon: Globe,
      accentColor: 'text-sky-400 bg-sky-500/15 border-sky-500/30',
    },
    {
      id: 'report-checker',
      title: 'Report Checker',
      description: 'Look up security audit tickets, transaction AML clearance hashes, and compliance certificates.',
      category: 'Compliance',
      icon: FileCheck,
      accentColor: 'text-violet-400 bg-violet-500/15 border-violet-500/30',
    },
    {
      id: 'duplicate-checker',
      title: 'Duplicated Checker',
      description: 'Paste text or datasets to isolate duplicate lines, serial numbers, or identifiers with occurrence metrics.',
      category: 'Data Utility',
      icon: CopyCheck,
      accentColor: 'text-yellow-400 bg-yellow-500/15 border-yellow-500/30',
    },
    {
      id: 'email-organizer',
      title: 'Email Organizer',
      description: 'Clean raw email lists, deduplicate, filter by provider domain, sort alphabetically, and export CSV.',
      category: 'Data Utility',
      icon: Mail,
      accentColor: 'text-orange-400 bg-orange-500/15 border-orange-500/30',
    },
    {
      id: 'name-store',
      title: 'Name Store',
      description: 'Personal encrypted vault to store, categorize, search, and recall brand names, handles, and server aliases.',
      category: 'Productivity',
      icon: BookMarked,
      accentColor: 'text-pink-400 bg-pink-500/15 border-pink-500/30',
    },
    {
      id: 'name-generator',
      title: 'Name and Email Generator',
      description: 'Algorithmic synthesizer for distinctive tech/crypto brand names and disposable sandbox test emails.',
      category: 'Productivity & QA',
      icon: Sparkles,
      accentColor: 'text-teal-400 bg-teal-500/15 border-teal-500/30',
    },
    {
      id: 'password-generator',
      title: 'Password Generator',
      description: 'Browser-side high-entropy cryptographic password generator utilizing window.crypto hardware seed.',
      category: 'Security',
      icon: Lock,
      accentColor: 'text-emerald-400 bg-emerald-500/15 border-emerald-500/30',
    },
    {
      id: 'totp',
      title: '2FA Key',
      description: 'Standard RFC 6238 Time-based One-Time Password generator with 30s countdown and zero cloud logging.',
      category: 'Security',
      icon: KeyRound,
      accentColor: 'text-amber-400 bg-amber-500/15 border-amber-500/30',
    },
  ];

  // Render individual tool view if activeToolId is set
  if (activeToolId) {
    const handleClose = () => setActiveToolId(null);
    return (
      <div className="space-y-6 pb-20">
        {activeToolId === 'ip-checker' && <IpCheckerTool onClose={handleClose} />}
        {activeToolId === 'report-checker' && <ReportCheckerTool onClose={handleClose} />}
        {activeToolId === 'duplicate-checker' && <DuplicateCheckerTool onClose={handleClose} />}
        {activeToolId === 'email-organizer' && <EmailOrganizerTool onClose={handleClose} />}
        {activeToolId === 'name-store' && <NameStoreTool onClose={handleClose} />}
        {activeToolId === 'name-generator' && <NameGeneratorTool onClose={handleClose} />}
        {activeToolId === 'password-generator' && <PasswordGeneratorTool onClose={handleClose} />}
        {activeToolId === 'totp' && <TotpTool onClose={handleClose} />}
      </div>
    );
  }

  // Otherwise, render full 8 Tools Hub Directory
  return (
    <div className="space-y-7 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-white">
            Productivity & Security Tools
          </h1>
          <p className="text-xs text-white/50 mt-1">
            Eight essential client-side utilities engineered for maximum performance, privacy, and zero cloud tracking.
          </p>
        </div>

        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/5 text-amber-300 border border-white/10 self-start sm:self-auto">
          8 of 8 Tools Active
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {toolDefinitions.map((tool) => {
          const Icon = tool.icon;
          return (
            <div
              key={tool.id}
              onClick={() => setActiveToolId(tool.id)}
              className="p-5 rounded-3xl glass-panel border border-white/10 hover:border-amber-400/40 flex flex-col justify-between space-y-4 glass-card-hover cursor-pointer group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center border ${tool.accentColor}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[9px] font-semibold text-white/40 uppercase tracking-wider">
                    {tool.category}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                  {tool.title}
                </h3>
                <p className="text-[11px] text-white/60 leading-relaxed mt-1">
                  {tool.description}
                </p>
              </div>

              <div className="pt-2.5 border-t border-white/5 flex items-center justify-between text-xs text-amber-400 font-semibold group-hover:translate-x-0.5 transition-transform">
                <span>Launch Tool</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
