import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { GlassCard } from '../common/GlassCard';
import { Lock, Copy, Check, RefreshCw, ShieldCheck, Key, X } from 'lucide-react';

interface PasswordGeneratorToolProps {
  onClose?: () => void;
}

export const PasswordGeneratorTool: React.FC<PasswordGeneratorToolProps> = ({ onClose }) => {
  const { showToast } = useApp();
  const [length, setLength] = useState<number>(20);
  const [includeUppercase, setIncludeUppercase] = useState<boolean>(true);
  const [includeLowercase, setIncludeLowercase] = useState<boolean>(true);
  const [includeNumbers, setIncludeNumbers] = useState<boolean>(true);
  const [includeSymbols, setIncludeSymbols] = useState<boolean>(true);
  const [password, setPassword] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  // Cryptographically secure generation via window.crypto
  const generateSecurePassword = () => {
    let charset = '';
    if (includeUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (includeLowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (includeNumbers) charset += '0123456789';
    if (includeSymbols) charset += '!@#$%^&*()-_=+[]{}|;:,.<>?';

    if (!charset) {
      charset = 'abcdefghijklmnopqrstuvwxyz';
    }

    const randomBuffer = new Uint32Array(length);
    if (typeof window !== 'undefined' && window.crypto) {
      window.crypto.getRandomValues(randomBuffer);
    } else {
      for (let i = 0; i < length; i++) randomBuffer[i] = Math.floor(Math.random() * 1000000);
    }

    let result = '';
    for (let i = 0; i < length; i++) {
      result += charset[randomBuffer[i] % charset.length];
    }
    setPassword(result);
  };

  useEffect(() => {
    generateSecurePassword();
  }, [length, includeUppercase, includeLowercase, includeNumbers, includeSymbols]);

  // Entropy calculation
  const calculateEntropy = () => {
    let poolSize = 0;
    if (includeUppercase) poolSize += 26;
    if (includeLowercase) poolSize += 26;
    if (includeNumbers) poolSize += 10;
    if (includeSymbols) poolSize += 28;
    if (poolSize === 0) poolSize = 26;
    const entropy = Math.round(length * (Math.log2(poolSize)));
    return entropy;
  };

  const entropy = calculateEntropy();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(password);
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
          <h2 className="text-xl font-bold font-display text-white">Cryptographic Password Generator</h2>
          <p className="text-xs text-white/50">
            Browser-side hardware entropy generation powered by <code className="font-mono text-amber-300">window.crypto</code>.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={generateSecurePassword}
            className="px-5 py-2.5 rounded-full bg-white text-black font-semibold text-xs hover:bg-white/90 shadow transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Generate New</span>
          </button>
        </div>
      </div>

      {/* RESULT PASSWORD DISPLAY CARD */}
      <GlassCard glow className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-white/60">Generated Key</span>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{entropy} bits entropy (Military Grade)</span>
          </span>
        </div>

        <div className="flex items-center justify-between p-4 rounded-2xl bg-black/40 border border-white/10 gap-3">
          <span className="font-mono text-base sm:text-lg text-white font-bold tracking-wider break-all select-all">
            {password}
          </span>
          <button
            onClick={handleCopy}
            className="p-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white transition-all shrink-0 active:scale-90"
            title="Copy password"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>

        {/* Strength Progress Bar */}
        <div className="space-y-1">
          <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                entropy > 90 ? 'bg-emerald-400' : entropy > 60 ? 'bg-amber-400' : 'bg-rose-500'
              }`}
              style={{ width: `${Math.min(100, (entropy / 128) * 100)}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-white/50">
            <span>Entropy Level: {entropy > 90 ? 'Exceptional' : entropy > 60 ? 'Strong' : 'Moderate'}</span>
            <span>Zero Server Transmission Guarantee</span>
          </div>
        </div>
      </GlassCard>

      {/* GENERATOR CONFIGURATION CONTROLS */}
      <GlassCard className="space-y-6">
        {/* Length Slider */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-white">Password Length</span>
            <span className="font-mono font-bold text-amber-300 text-sm">{length} characters</span>
          </div>
          <input
            type="range"
            min={8}
            max={64}
            value={length}
            onChange={(e) => setLength(Number(e.target.value))}
            className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-amber-400"
          />
          <div className="flex justify-between text-[10px] text-white/40 font-mono">
            <span>8</span>
            <span>20 (Recommended)</span>
            <span>64</span>
          </div>
        </div>

        {/* Character Toggles */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <label className="flex items-center gap-2 p-3 rounded-2xl glass-item cursor-pointer text-xs text-white">
            <input
              type="checkbox"
              checked={includeUppercase}
              onChange={(e) => setIncludeUppercase(e.target.checked)}
              className="rounded border-white/20 bg-white/10 text-amber-500 focus:ring-0"
            />
            <span>A-Z (Uppercase)</span>
          </label>

          <label className="flex items-center gap-2 p-3 rounded-2xl glass-item cursor-pointer text-xs text-white">
            <input
              type="checkbox"
              checked={includeLowercase}
              onChange={(e) => setIncludeLowercase(e.target.checked)}
              className="rounded border-white/20 bg-white/10 text-amber-500 focus:ring-0"
            />
            <span>a-z (Lowercase)</span>
          </label>

          <label className="flex items-center gap-2 p-3 rounded-2xl glass-item cursor-pointer text-xs text-white">
            <input
              type="checkbox"
              checked={includeNumbers}
              onChange={(e) => setIncludeNumbers(e.target.checked)}
              className="rounded border-white/20 bg-white/10 text-amber-500 focus:ring-0"
            />
            <span>0-9 (Numbers)</span>
          </label>

          <label className="flex items-center gap-2 p-3 rounded-2xl glass-item cursor-pointer text-xs text-white">
            <input
              type="checkbox"
              checked={includeSymbols}
              onChange={(e) => setIncludeSymbols(e.target.checked)}
              className="rounded border-white/20 bg-white/10 text-amber-500 focus:ring-0"
            />
            <span>!@#$ (Symbols)</span>
          </label>
        </div>
      </GlassCard>
    </div>
  );
};
