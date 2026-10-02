import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { GlassCard } from '../common/GlassCard';
import { Tools1Logo } from '../common/Tools1Logo';
import {
  Shield,
  Zap,
  Lock,
  ArrowRight,
  Sparkles,
  ShoppingBag,
  Wallet,
  Wrench,
  Users,
  Check,
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { setCurrentPage, login, activeTheme, setActiveTheme } = useApp();

  // Interactive Reference Card State (Inspired by the user's reference images)
  const [selectedFocus, setSelectedFocus] = useState<number>(2); // Default to "Music helps me focus"
  const [currentStep, setCurrentStep] = useState<number>(3);
  const [interactiveNotice, setInteractiveNotice] = useState<string>('');

  const themeAssets = {
    nordic: {
      desktop: '/src/assets/images/nordic_lake_granite_desktop_1790870586674.jpg',
      mobile: '/src/assets/images/nordic_lake_granite_mobile_1790870602614.jpg',
      alt: 'Misty Alpine Lake & Granite Shoreline',
      name: 'Nordic Lake & Pier',
      glow1: 'bg-amber-500/20',
      glow2: 'bg-cyan-600/15',
    },
    botanical: {
      desktop: '/src/assets/images/nature_flora_amber_desktop_1790869305725.jpg',
      mobile: '/src/assets/images/nature_flora_amber_mobile_1790869319493.jpg',
      alt: 'Lush Botanical Bokeh & Orange Tulips',
      name: 'Botanical Flora Bokeh',
      glow1: 'bg-amber-500/25',
      glow2: 'bg-emerald-500/20',
    },
    sunset: {
      desktop: '/src/assets/images/tenex_ambient_sunset_1790868072264.jpg',
      mobile: '/src/assets/images/tenex_ambient_sunset_1790868072264.jpg',
      alt: 'Dusk Sunset Horizon Atmosphere',
      name: 'Dusk Sunset',
      glow1: 'bg-orange-500/25',
      glow2: 'bg-amber-600/20',
    },
  };

  const currentTheme = themeAssets[activeTheme] || themeAssets.nordic;

  const focusOptions = [
    { id: 0, emoji: '🤫', label: 'Quiet space' },
    { id: 1, emoji: '🌧️', label: 'Soft background sound' },
    { id: 2, emoji: '🎧', label: 'Music helps me focus' },
    { id: 3, emoji: '🌍', label: 'I adapt anywhere' },
  ];

  const handleContinue = () => {
    setInteractiveNotice(`Preference saved: "${focusOptions[selectedFocus].label}". Entering Tenex Console...`);
    setTimeout(() => {
      login('alexthorne');
    }, 600);
  };

  return (
    <div className="relative min-h-screen text-white overflow-hidden">
      {/* Dynamic Theme Backdrop */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <picture key={activeTheme}>
          <source media="(max-width: 768px)" srcSet={currentTheme.mobile} />
          <img
            src={currentTheme.desktop}
            alt={currentTheme.alt}
            className="w-full h-full object-cover object-center opacity-95 scale-105 transition-opacity duration-700"
            referrerPolicy="no-referrer"
          />
        </picture>
        {/* Crystal-clear scrim ensuring scenery bleeds through the glass */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/15 to-black/65" />
        {/* Ambient glow orbs */}
        <div className={`absolute top-1/4 right-1/4 w-[480px] h-[480px] rounded-full ${currentTheme.glow1} blur-[140px] pointer-events-none`} />
        <div className={`absolute top-1/2 left-10 w-[420px] h-[420px] rounded-full ${currentTheme.glow2} blur-[160px] pointer-events-none`} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-14 pb-24">
        {/* HERO SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center pt-4 sm:pt-10">
          {/* Left Column: Platform Intro */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Minimal unboxed status metadata + 1-Click Theme Switcher */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-medium text-amber-300 backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Next-Gen Glassmorphic Operations Hub</span>
                <span className="text-white/40">·</span>
                <span className="text-white/90 font-semibold">{currentTheme.name}</span>
              </div>

              {/* Theme quick pills */}
              <div className="inline-flex items-center p-0.5 rounded-full bg-black/40 border border-white/15 backdrop-blur-md text-[11px]">
                <button
                  onClick={() => setActiveTheme('nordic')}
                  className={`px-2.5 py-0.5 rounded-full transition-all ${
                    activeTheme === 'nordic'
                      ? 'bg-amber-400 text-black font-bold shadow'
                      : 'text-white/70 hover:text-white'
                  }`}
                >
                  🏞️ Nordic
                </button>
                <button
                  onClick={() => setActiveTheme('botanical')}
                  className={`px-2.5 py-0.5 rounded-full transition-all ${
                    activeTheme === 'botanical'
                      ? 'bg-amber-400 text-black font-bold shadow'
                      : 'text-white/70 hover:text-white'
                  }`}
                >
                  🌺 Flora
                </button>
                <button
                  onClick={() => setActiveTheme('sunset')}
                  className={`px-2.5 py-0.5 rounded-full transition-all ${
                    activeTheme === 'sunset'
                      ? 'bg-amber-400 text-black font-bold shadow'
                      : 'text-white/70 hover:text-white'
                  }`}
                >
                  🌅 Sunset
                </button>
              </div>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-extrabold tracking-tight leading-[1.08] text-balance">
              Unified digital operations with <span className="bg-gradient-to-r from-amber-200 via-orange-300 to-amber-500 bg-clip-text text-transparent">glass precision</span>.
            </h1>

            <p className="text-base sm:text-lg text-white/75 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
              Tools1 unites high-security infrastructure, decentralized marketplace orders, balance & baki clearing, real-time syndicate chat, and 9 essential cryptographic utilities in one responsive glass canvas.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
              <button
                onClick={() => login('alexthorne')}
                className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-white text-black font-semibold hover:bg-white/90 shadow-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <span>Launch Console</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCurrentPage('marketplace')}
                className="w-full sm:w-auto px-7 py-3.5 rounded-full glass-panel hover:bg-white/10 text-white font-medium border border-white/20 transition-all flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4 text-amber-400" />
                <span>Explore Marketplace</span>
              </button>
              <button
                onClick={() => login('admin_master', 'ADMIN')}
                className="w-full sm:w-auto px-5 py-3.5 rounded-full bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-semibold border border-amber-500/35 transition-all text-xs flex items-center justify-center gap-1.5 backdrop-blur-md"
              >
                <Shield className="w-3.5 h-3.5 text-amber-400" />
                <span>Instant Admin Demo</span>
              </button>
            </div>

            {/* Proof metrics */}
            <div className="pt-6 border-t border-white/10 grid grid-cols-3 gap-4 max-w-lg mx-auto lg:mx-0 text-left">
              <div>
                <p className="text-2xl font-bold font-display text-white">$14.2M</p>
                <p className="text-xs text-white/60 mt-0.5">Cleared Volume</p>
              </div>
              <div>
                <p className="text-2xl font-bold font-display text-white">99.98%</p>
                <p className="text-xs text-white/60 mt-0.5">Uptime SLA</p>
              </div>
              <div>
                <p className="text-2xl font-bold font-display text-white">Sub-10ms</p>
                <p className="text-xs text-white/60 mt-0.5">Engine Latency</p>
              </div>
            </div>
          </div>

          {/* Right Column: Live Interactive Frosted Glass Card (Capturing the Exact Aesthetics from Reference) */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-[400px]">
              {/* Warm glow aura behind the frosted glass card */}
              <div className="absolute -inset-3 bg-gradient-to-tr from-amber-500/25 via-orange-600/20 to-emerald-500/15 rounded-[40px] blur-2xl pointer-events-none" />

              {/* The Signature Glass Card */}
              <div className="relative rounded-[32px] glass-panel border border-white/25 p-6 sm:p-8 shadow-2xl backdrop-blur-3xl overflow-hidden">
                {/* Specular glass gleam across top */}
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />

                {/* Top Header of Card: 4K RESOLUTION badge + ✱ Star glyph */}
                <div className="flex items-center justify-between mb-6">
                  <div className="px-3 py-1 rounded-full border border-white/30 bg-white/5 text-[11px] font-semibold text-white/90 tracking-wider">
                    4K RESOLUTION
                  </div>

                  {/* Iconic geometric asterisk/star emblem from reference */}
                  <div className="text-white text-2xl font-black leading-none drop-shadow-[0_0_12px_rgba(255,255,255,0.6)]">
                    ✱
                  </div>
                </div>

                {/* Card Title inspired directly by reference: ELEVATE ASSETS WITH GLASS EFFECTS */}
                <div className="space-y-3 mb-6">
                  <h3 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight leading-[1.12]">
                    ELEVATE ASSETS WITH GLASS EFFECTS
                  </h3>

                  <div className="flex items-center gap-1.5 text-xs text-white/80 font-medium">
                    <span className="text-amber-400">→</span>
                    <span className="uppercase tracking-wider text-[11px]">FEATURING FULLY EDITABLE LAYERS</span>
                  </div>
                </div>

                {/* Interactive Focus Options from Reference 1 */}
                <div className="space-y-2 mb-6">
                  {focusOptions.map((opt) => {
                    const isSelected = selectedFocus === opt.id;
                    return (
                      <button
                        key={opt.id}
                        onClick={() => setSelectedFocus(opt.id)}
                        className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-left transition-all ${
                          isSelected
                            ? 'glass-item-active text-white border-amber-400/50 shadow-lg'
                            : 'glass-item text-white/80 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-lg" role="img" aria-label={opt.label}>
                            {opt.emoji}
                          </span>
                          <span className="text-xs sm:text-sm font-medium">{opt.label}</span>
                        </div>
                        {isSelected && (
                          <div className="w-5 h-5 rounded-full flex items-center justify-center text-white">
                            <Check className="w-4 h-4 text-white" strokeWidth={3} />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Action button */}
                <button
                  onClick={handleContinue}
                  className="w-full py-3.5 rounded-full bg-white hover:bg-white/95 text-black font-semibold text-sm shadow-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2 mb-5"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                {/* Bottom metadata footer matching Reference 2 */}
                <div className="pt-3 border-t border-white/15 flex items-center justify-between text-[10px] text-white/70 font-mono tracking-wider">
                  <span>2500×3200 DIMENSIONS</span>

                  <button
                    onClick={() => login('alexthorne')}
                    className="w-6 h-6 rounded-full border border-white/40 flex items-center justify-center hover:bg-white/20 transition-colors text-white"
                    title="Enter platform"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>

                  <span>READY FOR WEB USE</span>
                </div>

                {interactiveNotice && (
                  <p className="text-[11px] text-amber-300 text-center mt-3 animate-in fade-in">
                    {interactiveNotice}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* FEATURES OVERVIEW SECTION */}
        <div className="mt-28 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-white">
              Engineered for absolute control
            </h2>
            <p className="text-white/70 text-sm sm:text-base">
              Explore the modular pillars built into Tenex to power high-throughput web operations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <GlassCard hoverEffect onClick={() => setCurrentPage('marketplace')}>
              <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-5">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Curated Marketplace</h3>
              <p className="text-sm text-white/70 leading-relaxed">
                Direct access to cryptographic hardware, isolated cloud runners, high-speed mesh nodes, and audited UI tokens with instant server-side settlement.
              </p>
            </GlassCard>

            <GlassCard hoverEffect onClick={() => setCurrentPage('balance')}>
              <div className="w-12 h-12 rounded-2xl bg-orange-500/15 border border-orange-500/30 flex items-center justify-center text-orange-400 mb-5">
                <Wallet className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Balance & Baki Ledger</h3>
              <p className="text-sm text-white/70 leading-relaxed">
                Multi-channel deposit requests (USDT, BTC, Bank Wire), pending baki tracking, and idempotent credit verification with full audit protection.
              </p>
            </GlassCard>

            <GlassCard hoverEffect onClick={() => setCurrentPage('tools')}>
              <div className="w-12 h-12 rounded-2xl bg-yellow-500/15 border border-yellow-500/30 flex items-center justify-center text-yellow-400 mb-5">
                <Wrench className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">9 Cryptographic Tools</h3>
              <p className="text-sm text-white/70 leading-relaxed">
                Zero-setup client-side tools: RFC 6238 TOTP generator, high-entropy password creator, IP diagnostic inspector, email organizer, and duplicate cleaner.
              </p>
            </GlassCard>

            <GlassCard hoverEffect onClick={() => setCurrentPage('chat')}>
              <div className="w-12 h-12 rounded-2xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-400 mb-5">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Real-Time Syndicates</h3>
              <p className="text-sm text-white/70 leading-relaxed">
                Topic-based groups, private channels, typing indicators, and instant operational dispatches built on an event-driven architecture.
              </p>
            </GlassCard>

            <GlassCard hoverEffect onClick={() => login('admin_master', 'ADMIN')}>
              <div className="w-12 h-12 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 mb-5">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Role-Based Access Control</h3>
              <p className="text-sm text-white/70 leading-relaxed">
                Strict separation between USER and ADMIN roles. Full administrative command console with user suspension, top-up approval, and audit logs.
              </p>
            </GlassCard>

            <GlassCard hoverEffect onClick={() => setCurrentPage('tools', 'totp')}>
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-5">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Zero-Knowledge Security</h3>
              <p className="text-sm text-white/70 leading-relaxed">
                TOTP secrets and passwords are generated securely in the browser's cryptographic sandbox (`window.crypto`). No plain text logging.
              </p>
            </GlassCard>
          </div>
        </div>

        {/* BOTTOM CTA */}
        <div className="mt-28 relative rounded-3xl glass-panel p-8 sm:p-12 text-center overflow-hidden border border-white/25">
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-white">
              Ready to experience modern glassmorphism?
            </h2>
            <p className="text-white/75 text-sm sm:text-base">
              Join Tools1 today or launch the interactive live demo instantly with pre-configured User and Admin accounts.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => setCurrentPage('register')}
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-white text-black font-semibold hover:bg-white/90 transition-all shadow-xl"
              >
                Create Free Account
              </button>
              <button
                onClick={() => login('alexthorne')}
                className="w-full sm:w-auto px-8 py-3.5 rounded-full glass-panel hover:bg-white/10 text-white font-medium border border-white/20"
              >
                Enter User Demo
              </button>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <footer className="mt-24 pt-8 border-t border-white/15 flex flex-col sm:flex-row items-center justify-between text-xs text-white/60 gap-4">
          <div className="flex items-center gap-3">
            <Tools1Logo size="sm" />
            <span>·</span>
            <span>© 2026 Tools1. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-5">
            <button onClick={() => setCurrentPage('marketplace')} className="hover:text-white transition-colors">
              Marketplace
            </button>
            <button onClick={() => setCurrentPage('tools')} className="hover:text-white transition-colors">
              Tools
            </button>
            <button onClick={() => login('admin_master', 'ADMIN')} className="hover:text-amber-400 transition-colors">
              Admin Gateway
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
};
