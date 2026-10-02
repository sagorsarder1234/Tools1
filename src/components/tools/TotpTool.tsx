import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { GlassCard } from '../common/GlassCard';
import { KeyRound, Copy, Check, Clock, X, RotateCcw } from 'lucide-react';

interface TotpToolProps {
  onClose?: () => void;
}

export const TotpTool: React.FC<TotpToolProps> = () => {
  const { showToast } = useApp();
  const [secretKey, setSecretKey] = useState<string>('');
  const [totpCode, setTotpCode] = useState<string>('------');
  const [timeLeft, setTimeLeft] = useState<number>(30);
  const [copied, setCopied] = useState<boolean>(false);

  // Standard Base32 decoding per RFC 4648
  const base32ToBuffer = (str: string): Uint8Array => {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    const cleaned = str.toUpperCase().replace(/[\s=-]/g, '');
    let bits = '';
    for (let i = 0; i < cleaned.length; i++) {
      const val = alphabet.indexOf(cleaned[i]);
      if (val === -1) continue;
      bits += val.toString(2).padStart(5, '0');
    }
    const bytes = new Uint8Array(Math.floor(bits.length / 8));
    for (let i = 0; i < bytes.length; i++) {
      bytes[i] = parseInt(bits.substring(i * 8, (i + 1) * 8), 2);
    }
    return bytes;
  };

  // Compute 6-digit TOTP using RFC 6238 / RFC 4226 standard
  const computeTotp = async (secret: string) => {
    const cleaned = secret.trim();
    const epochSeconds = Math.floor(Date.now() / 1000);
    const timeStep = 30;
    const remaining = timeStep - (epochSeconds % timeStep);
    setTimeLeft(remaining);

    if (!cleaned) {
      setTotpCode('------');
      return;
    }

    try {
      const counter = Math.floor(epochSeconds / timeStep);
      const counterBuffer = new ArrayBuffer(8);
      const counterView = new DataView(counterBuffer);
      counterView.setBigUint64(0, BigInt(counter));

      const keyBytes = base32ToBuffer(cleaned);
      if (keyBytes.length === 0) {
        setTotpCode('INVALID');
        return;
      }

      const cryptoKey = await window.crypto.subtle.importKey(
        'raw',
        keyBytes as unknown as BufferSource,
        { name: 'HMAC', hash: 'SHA-1' },
        false,
        ['sign']
      );

      const signature = await window.crypto.subtle.sign('HMAC', cryptoKey, counterBuffer);
      const hmacResult = new Uint8Array(signature);

      const offset = hmacResult[hmacResult.length - 1] & 0x0f;
      const binaryCode =
        ((hmacResult[offset] & 0x7f) << 24) |
        ((hmacResult[offset + 1] & 0xff) << 16) |
        ((hmacResult[offset + 2] & 0xff) << 8) |
        (hmacResult[offset + 3] & 0xff);

      const otp = binaryCode % 1000000;
      setTotpCode(otp.toString().padStart(6, '0'));
    } catch {
      setTotpCode('INVALID');
    }
  };

  // Timer loop
  useEffect(() => {
    computeTotp(secretKey);
    const interval = setInterval(() => {
      computeTotp(secretKey);
    }, 1000);
    return () => clearInterval(interval);
  }, [secretKey]);

  const handleCopyCode = async () => {
    if (!totpCode || totpCode === '------' || totpCode === 'INVALID') {
      showToast('Please enter a valid 2FA Secret Key first', 'error');
      return;
    }

    try {
      await navigator.clipboard.writeText(totpCode);
      setCopied(true);
      showToast('OTP copied to clipboard!', 'success');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      showToast('Copy failed', 'error');
    }
  };

  const handleClear = () => {
    setSecretKey('');
    setTotpCode('------');
    showToast('2FA token cleared', 'info');
  };

  return (
    <div className="space-y-6">
      {/* HEADER WITHOUT NEW SECRET KEY BUTTON AND WITHOUT EXTRA CROSS BUTTON */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold font-display text-white">2FA Key / TOTP Authenticator</h2>
        <p className="text-xs text-white/50 mt-1">
          Standard RFC 6238 Time-based One-Time Password generator. Zero secrets stored or logged.
        </p>
      </div>

      {/* 1. FIRST: 2FA TOKEN / SECRET KEY INPUT BOX WITH CLEAR OPTION */}
      <GlassCard className="space-y-3 p-5 rounded-3xl">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-white/80 flex items-center gap-1.5">
            <KeyRound className="w-4 h-4 text-amber-400" />
            <span>2FA Secret Key / Token</span>
          </label>
          {secretKey && (
            <button
              type="button"
              onClick={handleClear}
              className="text-xs text-rose-400 hover:text-rose-300 font-medium flex items-center gap-1 cursor-pointer transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            value={secretKey}
            onChange={(e) => setSecretKey(e.target.value.toUpperCase().replace(/\s/g, ''))}
            placeholder="Paste or enter 2FA secret key (e.g. JBSWY3DPEHPK3PXP)..."
            className="flex-1 px-4 py-3 rounded-2xl glass-item border border-white/15 focus:border-amber-400 focus:outline-none text-white text-sm font-mono tracking-wider placeholder:text-white/30"
          />
          {secretKey && (
            <button
              type="button"
              onClick={handleClear}
              className="px-4 py-3 rounded-2xl bg-white/10 hover:bg-rose-500/20 text-white/80 hover:text-white text-xs font-semibold flex items-center gap-1.5 border border-white/10 transition-all cursor-pointer shrink-0 active:scale-95"
              title="Clear 2FA Key"
            >
              <X className="w-4 h-4 text-rose-400" />
              <span>Clear</span>
            </button>
          )}
        </div>
        <p className="text-[11px] text-white/40">
          Compatible with Google Authenticator, Microsoft Authenticator, Authy, and RFC 6238.
        </p>
      </GlassCard>

      {/* 2. THEN: OTP DISPLAY AND OTP COPY OPTION */}
      <GlassCard glow className="text-center space-y-6 py-8 rounded-3xl">
        <div className="flex items-center justify-center gap-2">
          <Clock className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-semibold text-white/60 tracking-wider uppercase">
            One-Time Password (OTP)
          </span>
        </div>

        {/* Big Digit Box */}
        <div className="flex items-center justify-center gap-3">
          <span className="text-4xl sm:text-6xl font-mono font-extrabold tracking-widest text-white tabular-nums drop-shadow-[0_0_25px_rgba(251,191,36,0.3)]">
            {totpCode.length === 6
              ? `${totpCode.slice(0, 3)} ${totpCode.slice(3, 6)}`
              : totpCode}
          </span>
        </div>

        {/* Circular Countdown Progress & Copy OTP Button */}
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <div className="relative w-8 h-8 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-white/10"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className={timeLeft <= 5 ? 'text-rose-400' : 'text-amber-400'}
                strokeDasharray={`${(timeLeft / 30) * 100}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="absolute text-[10px] font-mono font-bold text-white">
              {timeLeft}
            </span>
          </div>

          <span className="text-xs text-white/60">
            Expires in <strong className="text-white font-mono">{timeLeft}s</strong>
          </span>

          {/* Copy OTP Option */}
          <button
            type="button"
            onClick={handleCopyCode}
            disabled={!secretKey || totpCode === '------' || totpCode === 'INVALID'}
            className="ml-2 px-5 py-2.5 rounded-full bg-amber-400 hover:bg-amber-300 text-black text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 shadow-lg shadow-amber-500/20 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            title="Copy 6-digit OTP code"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-950 font-bold" /> : <Copy className="w-4 h-4 text-black" />}
            <span>{copied ? 'Copied!' : 'Copy OTP'}</span>
          </button>
        </div>
      </GlassCard>
    </div>
  );
};
