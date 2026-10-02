import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { GlassCard } from '../common/GlassCard';
import { Sparkles, Copy, Check, RefreshCw, Mail, Tag, X } from 'lucide-react';

interface NameGeneratorToolProps {
  onClose?: () => void;
}

export const NameGeneratorTool: React.FC<NameGeneratorToolProps> = ({ onClose }) => {
  const { showToast } = useApp();
  const [activeTab, setActiveTab] = useState<'NAME' | 'EMAIL'>('NAME');

  // Name Generator State
  const [style, setStyle] = useState<'TECH_SAAS' | 'CYBERPUNK' | 'MINIMALIST' | 'CRYPTO'>('TECH_SAAS');
  const [includeNumber, setIncludeNumber] = useState(true);
  const [generatedNames, setGeneratedNames] = useState<string[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // Email Generator State
  const [basePrefix, setBasePrefix] = useState('agent.nexus');
  const [emailDomain, setEmailDomain] = useState('tenex.internal');
  const [generatedEmails, setGeneratedEmails] = useState<string[]>([]);
  const [copiedEmailIndex, setCopiedEmailIndex] = useState<number | null>(null);

  const wordBanks = {
    TECH_SAAS: {
      prefixes: ['Hyper', 'Nova', 'Pulse', 'Aether', 'Omni', 'Verve', 'Flux', 'Vertex', 'Apex', 'Synthetix', 'Strata'],
      suffixes: ['Hub', 'Flow', 'Grid', 'Core', 'Stack', 'Base', 'Scale', 'Sync', 'Forge', 'Node', 'Wave'],
    },
    CYBERPUNK: {
      prefixes: ['Neon', 'Chrome', 'Zero', 'Shadow', 'Vector', 'Ghost', 'Rogue', 'Viper', 'Cipher', 'Glitch', 'Krypt'],
      suffixes: ['X', 'Runner', 'Blade', 'Byte', 'Net', 'Shift', 'Sector', 'Matrix', 'Volt', 'Protocol'],
    },
    MINIMALIST: {
      prefixes: ['Tenex', 'Aura', 'Kite', 'Loom', 'Prism', 'Mira', 'Vero', 'Nexo', 'Cael', 'Lyra', 'Sona'],
      suffixes: ['io', 'ai', 'co', 'so', 'ly', 'os', 'ux', 'iq'],
    },
    CRYPTO: {
      prefixes: ['Vault', 'Ledger', 'Block', 'Proof', 'Stake', 'Mint', 'Hash', 'Chain', 'Oracle', 'Token', 'Sol'],
      suffixes: ['Key', 'Zero', 'Mesh', 'Forge', 'Pool', 'Shield', 'Swap', 'Node', 'Trust'],
    },
  };

  const emailDomains = ['tenex.internal', 'devsandbox.org', 'testmail.io', 'qa-runner.net', 'cloudmesh.app'];

  const generateNames = () => {
    const bank = wordBanks[style];
    const results: string[] = [];
    for (let i = 0; i < 8; i++) {
      const p = bank.prefixes[Math.floor(Math.random() * bank.prefixes.length)];
      const s = bank.suffixes[Math.floor(Math.random() * bank.suffixes.length)];
      const num = includeNumber ? Math.floor(Math.random() * 89 + 10).toString() : '';
      results.push(`${p}${s}${num}`);
    }
    setGeneratedNames(results);
  };

  const generateEmails = () => {
    const list: string[] = [];
    for (let i = 0; i < 6; i++) {
      const stamp = Date.now().toString().slice(-4);
      const randHex = Math.random().toString(36).substring(2, 6);
      list.push(`${basePrefix.toLowerCase()}_${stamp}_${randHex}@${emailDomain}`);
    }
    setGeneratedEmails(list);
  };

  useEffect(() => {
    generateNames();
  }, [style, includeNumber]);

  useEffect(() => {
    generateEmails();
  }, [basePrefix, emailDomain]);

  const copyName = async (name: string, index: number) => {
    try {
      await navigator.clipboard.writeText(name);
      setCopiedIndex(index);
      showToast('Copied to clipboard', 'success');
      setTimeout(() => setCopiedIndex(null), 1800);
    } catch {
      showToast('Copy failed', 'error');
    }
  };

  const copyEmail = async (email: string, index: number) => {
    try {
      await navigator.clipboard.writeText(email);
      setCopiedEmailIndex(index);
      showToast('Copied to clipboard', 'success');
      setTimeout(() => setCopiedEmailIndex(null), 1800);
    } catch {
      showToast('Copy failed', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-display text-white">Name & Email Generator</h2>
          <p className="text-xs text-white/50">
            Synthesize distinctive brand names, aliases, and sanitized disposable test email accounts.
          </p>
        </div>

        {/* Tab Toggle between Name and Email */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl glass-panel-subtle border border-white/10 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('NAME')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'NAME'
                ? 'bg-amber-400 text-black font-bold shadow'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <Tag className="w-3.5 h-3.5" />
            <span>Name Generator</span>
          </button>
          <button
            onClick={() => setActiveTab('EMAIL')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'EMAIL'
                ? 'bg-amber-400 text-black font-bold shadow'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Email Generator</span>
          </button>
        </div>
      </div>

      {activeTab === 'NAME' && (
        <div className="space-y-5 animate-in fade-in">
          {/* Controls */}
          <GlassCard className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                {(
                  [
                    { id: 'TECH_SAAS', label: 'Tech & SaaS' },
                    { id: 'CYBERPUNK', label: 'Cyberpunk' },
                    { id: 'MINIMALIST', label: 'Minimalist' },
                    { id: 'CRYPTO', label: 'Crypto & ZeroK' },
                  ] as const
                ).map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setStyle(t.id)}
                    className={`px-3.5 py-1.5 rounded-2xl text-xs font-semibold transition-all ${
                      style === t.id
                        ? 'bg-amber-500 text-black shadow'
                        : 'glass-item text-white/70 hover:text-white'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-white/70">
                  <input
                    type="checkbox"
                    checked={includeNumber}
                    onChange={(e) => setIncludeNumber(e.target.checked)}
                    className="rounded border-white/20 bg-white/10 text-amber-500 focus:ring-0"
                  />
                  <span>Numeric Suffixes</span>
                </label>

                <button
                  onClick={generateNames}
                  className="px-3.5 py-1.5 rounded-xl bg-white text-black font-semibold text-xs hover:bg-white/90 shadow flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Regenerate</span>
                </button>
              </div>
            </div>
          </GlassCard>

          {/* Names Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5">
            {generatedNames.map((name, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl glass-panel border border-white/10 flex items-center justify-between hover:border-amber-400/40 transition-all group"
              >
                <span className="font-bold text-sm text-white font-mono tracking-tight">{name}</span>
                <button
                  onClick={() => copyName(name, idx)}
                  className="p-1.5 rounded-xl bg-white/5 hover:bg-white/20 text-white/60 hover:text-amber-400 transition-colors"
                  title="Copy handle"
                >
                  {copiedIndex === idx ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'EMAIL' && (
        <div className="space-y-5 animate-in fade-in">
          {/* Email Controls */}
          <GlassCard className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-white/70 mb-1">Prefix / Username</label>
                <input
                  type="text"
                  value={basePrefix}
                  onChange={(e) => setBasePrefix(e.target.value.replace(/[^a-zA-Z0-9._-]/g, ''))}
                  className="w-full px-3.5 py-2.5 rounded-xl glass-item border border-white/15 focus:border-amber-400 focus:outline-none text-white text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-white/70 mb-1">Domain</label>
                <select
                  value={emailDomain}
                  onChange={(e) => setEmailDomain(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl glass-item border border-white/15 focus:border-amber-400 focus:outline-none text-white text-xs bg-[#11121a]"
                >
                  {emailDomains.map((d) => (
                    <option key={d} value={d}>
                      @{d}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={generateEmails}
                  className="w-full py-2.5 rounded-xl bg-white text-black font-semibold text-xs hover:bg-white/90 shadow flex items-center justify-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Generate New Batch</span>
                </button>
              </div>
            </div>
          </GlassCard>

          {/* Emails Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {generatedEmails.map((email, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl glass-panel border border-white/10 flex items-center justify-between hover:border-amber-400/40 transition-all"
              >
                <span className="font-mono text-xs text-white truncate max-w-[260px] sm:max-w-xs">
                  {email}
                </span>
                <button
                  onClick={() => copyEmail(email, idx)}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs flex items-center gap-1 shrink-0 ml-2"
                >
                  {copiedEmailIndex === idx ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
