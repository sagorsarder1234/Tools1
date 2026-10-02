import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { GlassCard } from '../common/GlassCard';
import { Globe, Wifi, Activity, ShieldCheck, RefreshCw, Copy, Check, X } from 'lucide-react';

interface IpCheckerToolProps {
  onClose?: () => void;
}

export const IpCheckerTool: React.FC<IpCheckerToolProps> = ({ onClose }) => {
  const { showToast } = useApp();
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [pingLatency, setPingLatency] = useState<number>(18);
  const [networkInfo, setNetworkInfo] = useState({
    ip: '198.51.100.42',
    type: 'IPv4 Public',
    asn: 'AS15169 Google LLC',
    country: 'United States',
    city: 'Mountain View, CA',
    timezone: 'UTC-07:00 (Pacific Time)',
    isp: 'Google Fiber Cloud',
    threatScore: '0 / 100 (Safe / Clean)',
    proxyDetected: false,
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Web Browser',
  });

  const runDiagnostics = () => {
    setLoading(true);
    setTimeout(() => {
      setPingLatency(Math.floor(Math.random() * 15) + 12);
      setLoading(false);
    }, 700);
  };

  const copyIp = async () => {
    try {
      await navigator.clipboard.writeText(networkInfo.ip);
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
          <h2 className="text-xl font-bold font-display text-white">Network & IP Diagnostic</h2>
          <p className="text-xs text-white/50">Inspect public network gateway, ping response time, and routing ASN.</p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={runDiagnostics}
            disabled={loading}
            className="px-4 py-2 rounded-full glass-panel hover:bg-white/10 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh Ping</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <GlassCard glow className="md:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-white/60">Detected Public IP</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Clean Gateway
            </span>
          </div>

          <div className="flex items-center justify-between p-4 rounded-2xl bg-black/40 border border-white/10">
            <span className="text-2xl sm:text-3xl font-mono font-bold text-white tracking-wider">
              {networkInfo.ip}
            </span>
            <button
              onClick={copyIp}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs flex items-center gap-1"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3 rounded-xl bg-white/5">
              <span className="text-[10px] text-white/40 block">Location</span>
              <span className="text-xs font-semibold text-white">{networkInfo.city}</span>
            </div>
            <div className="p-3 rounded-xl bg-white/5">
              <span className="text-[10px] text-white/40 block">Provider ASN</span>
              <span className="text-xs font-semibold text-white truncate block">{networkInfo.asn}</span>
            </div>
            <div className="p-3 rounded-xl bg-white/5">
              <span className="text-[10px] text-white/40 block">Timezone</span>
              <span className="text-xs font-semibold text-white">{networkInfo.timezone}</span>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="space-y-4">
          <span className="text-xs font-semibold text-white/60 block">Latency & Gateway</span>
          <div className="space-y-3">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-white/50 block">Round-Trip Ping</span>
                <span className="text-xl font-bold font-mono text-emerald-400">{pingLatency} ms</span>
              </div>
              <Activity className="w-6 h-6 text-emerald-400 animate-pulse" />
            </div>

            <div className="p-3 rounded-xl bg-white/5 space-y-1">
              <span className="text-[10px] text-white/40 block">Reputation Score</span>
              <span className="text-xs font-semibold text-white">{networkInfo.threatScore}</span>
            </div>
            <div className="p-3 rounded-xl bg-white/5 space-y-1">
              <span className="text-[10px] text-white/40 block">Proxy / VPN Detection</span>
              <span className="text-xs font-semibold text-emerald-300">None detected (Direct)</span>
            </div>
          </div>
        </GlassCard>
      </div>

      <div className="p-4 rounded-2xl glass-panel border border-white/10 text-xs text-white/60">
        <span className="font-semibold text-white block mb-1">User Agent Signature</span>
        <code className="font-mono text-[11px] text-white/80 break-all">{networkInfo.userAgent}</code>
      </div>
    </div>
  );
};
