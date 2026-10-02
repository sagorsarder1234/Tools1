import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { GlassCard } from '../common/GlassCard';
import { Copy, Check, Trash2, Layers, AlertCircle, X } from 'lucide-react';

interface DuplicateCheckerToolProps {
  onClose?: () => void;
}

export const DuplicateCheckerTool: React.FC<DuplicateCheckerToolProps> = ({ onClose }) => {
  const { showToast } = useApp();
  const [inputText, setInputText] = useState(
    `ITEM-9021\nITEM-4412\nITEM-9021\nITEM-7721\nITEM-9021\nITEM-1029\nITEM-4412\nITEM-8819\nITEM-3301`
  );
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [copied, setCopied] = useState(false);

  // Process text lines
  const rawLines = inputText
    .split('\n')
    .map((l) => (caseSensitive ? l.trim() : l.trim().toLowerCase()))
    .filter((l) => l.length > 0);

  const totalCount = rawLines.length;

  // Count occurrences
  const counts: Record<string, number> = {};
  rawLines.forEach((item) => {
    counts[item] = (counts[item] || 0) + 1;
  });

  const uniqueKeys = Object.keys(counts);
  const uniqueCount = uniqueKeys.length;
  const duplicateCount = totalCount - uniqueCount;

  // Items that occurred > 1 time
  const duplicatesOnly = uniqueKeys.filter((k) => counts[k] > 1);

  const copyUnique = async () => {
    try {
      await navigator.clipboard.writeText(uniqueKeys.join('\n'));
      setCopied(true);
      showToast('Copied to clipboard', 'success');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      showToast('Copy failed', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-display text-white">Duplicate Records Inspector</h2>
          <p className="text-xs text-white/50">Analyze text lines, tokens, or identifiers for duplicate redundancy.</p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={copyUnique}
            className="px-4 py-2 rounded-full bg-white text-black text-xs font-semibold hover:bg-white/90 shadow flex items-center gap-1.5 cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>Copy Unique Values</span>
          </button>
        </div>
      </div>

      {/* METRIC CARDS */}
      <div className="grid grid-cols-3 gap-3">
        <div className="p-4 rounded-2xl glass-panel text-center">
          <span className="text-[10px] text-white/50 block">Total Records</span>
          <span className="text-2xl font-bold font-mono text-white">{totalCount}</span>
        </div>
        <div className="p-4 rounded-2xl glass-panel text-center border-emerald-500/20">
          <span className="text-[10px] text-white/50 block">Unique Records</span>
          <span className="text-2xl font-bold font-mono text-emerald-400">{uniqueCount}</span>
        </div>
        <div className="p-4 rounded-2xl glass-panel text-center border-amber-500/20">
          <span className="text-[10px] text-white/50 block">Duplicate Redundancy</span>
          <span className="text-2xl font-bold font-mono text-amber-300">{duplicateCount}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <GlassCard className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-white/80">Input Records (One Per Line)</span>
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
            rows={10}
            className="w-full p-4 rounded-2xl glass-item border border-white/15 focus:border-amber-400 focus:outline-none text-white text-xs font-mono resize-none leading-relaxed"
          />

          <div className="pt-2 flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-white/70">
              <input
                type="checkbox"
                checked={caseSensitive}
                onChange={(e) => setCaseSensitive(e.target.checked)}
                className="rounded border-white/20 bg-white/10 text-amber-500 focus:ring-0"
              />
              <span>Case Sensitive Comparison</span>
            </label>
          </div>
        </GlassCard>

        <GlassCard className="space-y-3">
          <span className="text-xs font-semibold text-white/80 block">
            Detected Duplicates ({duplicatesOnly.length} items repeated)
          </span>

          <div className="max-h-72 overflow-y-auto space-y-2 p-2 rounded-2xl bg-black/30 border border-white/10">
            {duplicatesOnly.length === 0 ? (
              <div className="p-6 text-center text-xs text-white/50">
                No duplicate records found in the current dataset.
              </div>
            ) : (
              duplicatesOnly.map((key) => (
                <div
                  key={key}
                  className="flex items-center justify-between p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs font-mono"
                >
                  <span className="text-white font-medium">{key}</span>
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold">
                    Repeated {counts[key]}×
                  </span>
                </div>
              ))
            )}
          </div>
        </GlassCard>
      </div>
    </div>
  );
};
