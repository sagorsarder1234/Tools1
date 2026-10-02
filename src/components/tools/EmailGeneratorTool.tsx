import React, { useState } from 'react';
import { GlassCard } from '../common/GlassCard';
import { Mail, Copy, Check, RefreshCw, Layers } from 'lucide-react';

export const EmailGeneratorTool: React.FC = () => {
  const [basePrefix, setBasePrefix] = useState('qa.tester');
  const [domain, setDomain] = useState('testmail.io');
  const [includeTimestamp, setIncludeTimestamp] = useState(true);
  const [generatedList, setGeneratedList] = useState<string[]>([]);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const domains = ['testmail.io', 'devsandbox.org', 'qa-runner.net', 'example.com', 'staging-tenex.app'];

  const generateEmails = () => {
    const list: string[] = [];
    for (let i = 0; i < 6; i++) {
      const stamp = includeTimestamp ? `_${Date.now().toString().slice(-4)}` : '';
      const randHex = Math.random().toString(36).substring(2, 6);
      list.push(`${basePrefix.toLowerCase()}${stamp}_${randHex}@${domain}`);
    }
    setGeneratedList(list);
  };

  React.useEffect(() => {
    generateEmails();
  }, [basePrefix, domain, includeTimestamp]);

  const copyEmail = (email: string, index: number) => {
    navigator.clipboard.writeText(email);
    setCopiedId(index);
    setTimeout(() => setCopiedId(null), 1800);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-display text-white">Sandbox Email Generator</h2>
          <p className="text-xs text-white/50">Create disposable test aliases for QA testing, staging, and demo validation.</p>
        </div>

        <button
          onClick={generateEmails}
          className="px-5 py-2.5 rounded-full bg-white text-black font-semibold text-xs hover:bg-white/90 shadow transition-all active:scale-95 flex items-center gap-1.5 self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>New Batch</span>
        </button>
      </div>

      <GlassCard className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-[11px] font-medium text-white/70 mb-1">Prefix / Username</label>
            <input
              type="text"
              value={basePrefix}
              onChange={(e) => setBasePrefix(e.target.value.replace(/[^a-zA-Z0-9._-]/g, ''))}
              placeholder="e.g. staging.tester"
              className="w-full px-3.5 py-2.5 rounded-xl glass-item border border-white/15 focus:border-amber-400 focus:outline-none text-white text-xs font-mono"
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium text-white/70 mb-1">Testing Domain</label>
            <select
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl glass-item border border-white/15 focus:border-amber-400 focus:outline-none text-white text-xs bg-[#11121a]"
            >
              {domains.map((d) => (
                <option key={d} value={d}>
                  @{d}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col justify-end">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-white/80 py-2.5">
              <input
                type="checkbox"
                checked={includeTimestamp}
                onChange={(e) => setIncludeTimestamp(e.target.checked)}
                className="rounded border-white/20 bg-white/10 text-amber-500 focus:ring-0"
              />
              <span>Timestamp Entropy</span>
            </label>
          </div>
        </div>
      </GlassCard>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {generatedList.map((email, idx) => (
          <div
            key={idx}
            className="p-4 rounded-2xl glass-panel border border-white/10 flex items-center justify-between hover:border-amber-400/30 transition-all"
          >
            <span className="font-mono text-xs text-white truncate max-w-[260px] sm:max-w-xs">{email}</span>
            <button
              onClick={() => copyEmail(email, idx)}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs flex items-center gap-1 shrink-0 ml-2"
            >
              {copiedId === idx ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
