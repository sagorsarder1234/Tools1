import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { GlassCard } from '../common/GlassCard';
import { Mail, Download, Copy, Check, Filter, Trash2, ArrowUpDown, X } from 'lucide-react';

interface EmailOrganizerToolProps {
  onClose?: () => void;
}

export const EmailOrganizerTool: React.FC<EmailOrganizerToolProps> = ({ onClose }) => {
  const { showToast } = useApp();
  const [inputText, setInputText] = useState(
    `alex.thorne@tenex.io\nsupport@google.com\nelena@frost-security.com\nalex.thorne@tenex.io\nmarcus@cloudcore.net\nsagor@gmail.com\nelena@frost-security.com\noperations@tenex.io\nsagor@gmail.com\ndev@react.org`
  );
  const [domainFilter, setDomainFilter] = useState('ALL');
  const [sortOrder, setSortOrder] = useState<'NONE' | 'ASC' | 'DESC'>('ASC');
  const [copied, setCopied] = useState(false);

  // Parse emails
  const rawList = inputText
    .split(/[\n,; ]+/)
    .map((e) => e.trim().toLowerCase())
    .filter((e) => e.includes('@') && e.includes('.'));

  const totalRawCount = rawList.length;

  // Deduplicate
  const uniqueList = Array.from(new Set(rawList));
  const duplicateCount = totalRawCount - uniqueList.length;

  // Filter by domain
  const filteredList = uniqueList.filter((email) => {
    if (domainFilter === 'ALL') return true;
    return email.endsWith(domainFilter);
  });

  // Sort
  if (sortOrder === 'ASC') {
    filteredList.sort((a, b) => a.localeCompare(b));
  } else if (sortOrder === 'DESC') {
    filteredList.sort((a, b) => b.localeCompare(a));
  }

  // Get available domains
  const availableDomains = Array.from(
    new Set(uniqueList.map((e) => '@' + e.split('@')[1]))
  );

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(filteredList.join('\n'));
      setCopied(true);
      showToast('Copied to clipboard', 'success');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      showToast('Copy failed', 'error');
    }
  };

  const handleExportCSV = () => {
    const csvContent = 'data:text/csv;charset=utf-8,Email,Domain\n' +
      filteredList.map((e) => `"${e}","${e.split('@')[1]}"`).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'organized_emails.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-display text-white">Email List Organizer</h2>
          <p className="text-xs text-white/50">Clean, deduplicate, filter by provider domain, and export clean lists.</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="px-4 py-2 rounded-full glass-panel hover:bg-white/10 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>Copy Clean List</span>
          </button>
          <button
            onClick={handleExportCSV}
            className="px-4 py-2 rounded-full bg-white text-black text-xs font-semibold hover:bg-white/90 shadow flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* METRICS */}
      <div className="grid grid-cols-3 gap-3">
        <div className="p-4 rounded-2xl glass-panel text-center">
          <span className="text-[10px] text-white/50 block">Total Inputs</span>
          <span className="text-2xl font-bold font-mono text-white">{totalRawCount}</span>
        </div>
        <div className="p-4 rounded-2xl glass-panel text-center border-amber-500/20">
          <span className="text-[10px] text-white/50 block">Unique Records</span>
          <span className="text-2xl font-bold font-mono text-amber-300">{uniqueList.length}</span>
        </div>
        <div className="p-4 rounded-2xl glass-panel text-center">
          <span className="text-[10px] text-white/50 block">Duplicates Removed</span>
          <span className="text-2xl font-bold font-mono text-emerald-400">-{duplicateCount}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Left: Raw Text Input Area */}
        <GlassCard className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-white/80">Paste Email Dataset</span>
            <button
              onClick={() => setInputText('')}
              className="text-[11px] text-rose-400 hover:underline flex items-center gap-1"
            >
              <Trash2 className="w-3 h-3" />
              <span>Clear</span>
            </button>
          </div>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            rows={12}
            placeholder="Paste raw email lists separated by newlines, commas, or spaces..."
            className="w-full p-4 rounded-2xl glass-item border border-white/15 focus:border-amber-400 focus:outline-none text-white text-xs font-mono resize-none leading-relaxed"
          />
        </GlassCard>

        {/* Right: Clean Organized Results */}
        <GlassCard className="space-y-3 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-white/10">
              <span className="text-xs font-semibold text-white/80">
                Organized Output ({filteredList.length})
              </span>

              {/* Controls */}
              <div className="flex items-center gap-2">
                <select
                  value={domainFilter}
                  onChange={(e) => setDomainFilter(e.target.value)}
                  className="px-2 py-1 rounded-xl glass-item text-xs text-white bg-[#11121a] border border-white/10 focus:outline-none"
                >
                  <option value="ALL">All Domains</option>
                  {availableDomains.map((dom) => (
                    <option key={dom} value={dom}>
                      {dom}
                    </option>
                  ))}
                </select>

                <button
                  onClick={() => setSortOrder(sortOrder === 'ASC' ? 'DESC' : 'ASC')}
                  className="p-1.5 rounded-xl glass-item text-xs text-white flex items-center gap-1"
                  title="Toggle A-Z Sort"
                >
                  <ArrowUpDown className="w-3 h-3 text-amber-400" />
                  <span>{sortOrder}</span>
                </button>
              </div>
            </div>

            <div className="max-h-72 overflow-y-auto space-y-1.5 p-2 rounded-2xl bg-black/30 border border-white/10">
              {filteredList.map((email, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2 rounded-xl bg-white/5 text-xs font-mono text-white/90 hover:bg-white/10"
                >
                  <span>{email}</span>
                  <span className="text-[10px] text-white/40">#{idx + 1}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-white/50">
            <span>Deduplication algorithm: Set hashing (O(n))</span>
            <span>Zero cloud logging</span>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};
