import React from 'react';
import { useApp } from '../../context/AppContext';
import { GlassCard } from '../common/GlassCard';
import { GlassChart } from '../common/GlassChart';
import {
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  ShoppingBag,
  Wrench,
  Users,
  ShieldAlert,
  ChevronRight,
  TrendingUp,
  Sparkles,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';

export const UserDashboard: React.FC = () => {
  const {
    currentUser,
    setCurrentPage,
    transactions,
    orders,
    topupRequests,
    setActiveToolId,
  } = useApp();

  if (!currentUser) return null;

  // Filter user specific items
  const userTransactions = transactions
    .filter((t) => t.userId === currentUser.id)
    .slice(0, 5);

  const pendingBakiCount = topupRequests.filter(
    (r) => r.userId === currentUser.id && r.status === 'PENDING'
  ).length;

  const pendingOrders = orders
    .filter((o) => o.userId === currentUser.id && o.status !== 'COMPLETED')
    .slice(0, 3);

  return (
    <div className="space-y-7 pb-20">
      {/* Top Greeting & User Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-14 h-14 rounded-2xl overflow-hidden glass-panel border border-white/20 p-0.5 shadow-xl shrink-0">
            {currentUser.avatarUrl ? (
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.username}
                className="w-full h-full object-cover rounded-[14px]"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-tr from-amber-600 to-amber-300 rounded-[14px] flex items-center justify-center font-bold text-black text-xl">
                {currentUser.username[0].toUpperCase()}
              </div>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-bold font-display text-white">
                Welcome back, {currentUser.username}
              </h1>
              <span className="px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                {currentUser.role}
              </span>
            </div>
            <p className="text-xs text-white/50 mt-0.5">
              Secure Session active · Member since {currentUser.createdAt.substring(0, 10)}
            </p>
          </div>
        </div>

        {/* Quick Top-Up CTA */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setCurrentPage('balance')}
            className="px-5 py-2.5 rounded-full bg-white hover:bg-white/95 text-black font-semibold text-xs shadow-lg transition-all active:scale-95 flex items-center gap-1.5"
          >
            <ArrowUpRight className="w-4 h-4" />
            <span>Top Up Balance</span>
          </button>
          <button
            onClick={() => setCurrentPage('baki')}
            className="px-4 py-2.5 rounded-full glass-panel hover:bg-white/10 text-white font-medium text-xs border border-white/15 transition-all flex items-center gap-1.5"
          >
            <Clock className="w-4 h-4 text-amber-400" />
            <span>Pending Baki ({pendingBakiCount})</span>
          </button>
        </div>
      </div>

      {/* METRIC STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Available Balance */}
        <GlassCard glow className="relative">
          <div className="flex items-center justify-between text-white/60 mb-2">
            <span className="text-xs font-medium">Available Balance</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-3xl font-display font-bold text-white font-mono tabular-nums">
              ${currentUser.balance.toFixed(2)}
            </p>
            <p className="text-[11px] text-amber-300/80 flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-amber-400" />
              <span>Instant ledger settlement</span>
            </p>
          </div>
        </GlassCard>

        {/* Pending Balance / Baki */}
        <GlassCard hoverEffect onClick={() => setCurrentPage('baki')}>
          <div className="flex items-center justify-between text-white/60 mb-2">
            <span className="text-xs font-medium">Pending Baki</span>
            <div className="w-8 h-8 rounded-xl bg-orange-500/15 text-orange-400 flex items-center justify-center border border-orange-500/30">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-3xl font-display font-bold text-amber-300 font-mono tabular-nums">
              ${currentUser.pendingBalance.toFixed(2)}
            </p>
            <p className="text-[11px] text-white/50">
              {pendingBakiCount} deposit request{pendingBakiCount === 1 ? '' : 's'} in review
            </p>
          </div>
        </GlassCard>

        {/* Total Spent */}
        <GlassCard>
          <div className="flex items-center justify-between text-white/60 mb-2">
            <span className="text-xs font-medium">Total Spent</span>
            <div className="w-8 h-8 rounded-xl bg-sky-500/15 text-sky-400 flex items-center justify-center border border-sky-500/30">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-3xl font-display font-bold text-white font-mono tabular-nums">
              ${currentUser.totalSpent.toFixed(2)}
            </p>
            <p className="text-[11px] text-white/50">
              {orders.filter((o) => o.userId === currentUser.id).length} lifetime orders placed
            </p>
          </div>
        </GlassCard>

        {/* Lifetime Deposited */}
        <GlassCard>
          <div className="flex items-center justify-between text-white/60 mb-2">
            <span className="text-xs font-medium">Lifetime Deposited</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <ArrowDownLeft className="w-4 h-4" />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-3xl font-display font-bold text-white font-mono tabular-nums">
              ${currentUser.totalDeposited.toFixed(2)}
            </p>
            <p className="text-[11px] text-emerald-400/90 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>Verified Account Standing</span>
            </p>
          </div>
        </GlassCard>
      </div>

      {/* UNIQUE INTERACTIVE GLASS CHART */}
      <GlassChart
        title="Personal Balance & Baki Velocity"
        subtitle="Real-time transaction inflow, cleared baki, and automated ledger settlements"
        metricLabel={`$${currentUser.balance.toFixed(2)}`}
      />

      {/* QUICK LAUNCH SHORTCUTS BAR */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <button
          onClick={() => setCurrentPage('marketplace')}
          className="p-4 rounded-2xl glass-panel hover:border-amber-400/30 text-left transition-all group active:scale-[0.98]"
        >
          <div className="w-9 h-9 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <ShoppingBag className="w-4 h-4" />
          </div>
          <p className="text-sm font-bold text-white group-hover:text-amber-300">Marketplace</p>
          <p className="text-[11px] text-white/50 mt-0.5">Explore hardware & tools</p>
        </button>

        <button
          onClick={() => setCurrentPage('tools')}
          className="p-4 rounded-2xl glass-panel hover:border-amber-400/30 text-left transition-all group active:scale-[0.98]"
        >
          <div className="w-9 h-9 rounded-xl bg-yellow-500/15 text-yellow-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <Wrench className="w-4 h-4" />
          </div>
          <p className="text-sm font-bold text-white group-hover:text-yellow-300">9 Utilities</p>
          <p className="text-[11px] text-white/50 mt-0.5">TOTP, IP, Password, etc.</p>
        </button>

        <button
          onClick={() => setCurrentPage('chat')}
          className="p-4 rounded-2xl glass-panel hover:border-amber-400/30 text-left transition-all group active:scale-[0.98]"
        >
          <div className="w-9 h-9 rounded-xl bg-sky-500/15 text-sky-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <Users className="w-4 h-4" />
          </div>
          <p className="text-sm font-bold text-white group-hover:text-sky-300">Live Chat</p>
          <p className="text-[11px] text-white/50 mt-0.5">Join real-time syndicates</p>
        </button>

        <button
          onClick={() => setCurrentPage('balance')}
          className="p-4 rounded-2xl glass-panel hover:border-amber-400/30 text-left transition-all group active:scale-[0.98]"
        >
          <div className="w-9 h-9 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <Wallet className="w-4 h-4" />
          </div>
          <p className="text-sm font-bold text-white group-hover:text-emerald-300">Top-Up Desk</p>
          <p className="text-[11px] text-white/50 mt-0.5">Deposit via USDT, Wire</p>
        </button>
      </div>

      {/* TWO COLUMN CONTENT: RECENT TRANSACTIONS + PENDING BAKI / ORDERS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Recent Transactions */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold font-display text-white">Recent Transactions</h2>
            <button
              onClick={() => setCurrentPage('balance')}
              className="text-xs text-amber-400 hover:underline flex items-center gap-1"
            >
              <span>View all ledger</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {userTransactions.length === 0 ? (
              <div className="p-8 text-center glass-panel rounded-2xl text-white/50 text-xs">
                No transactions recorded yet.
              </div>
            ) : (
              userTransactions.map((tx) => {
                const isDeposit = tx.type === 'DEPOSIT';
                const isPending = tx.status === 'PENDING';
                return (
                  <div
                    key={tx.id}
                    className="p-4 rounded-2xl glass-panel flex items-center justify-between gap-3 border border-white/10 hover:border-white/20 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                          isDeposit
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                            : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                        }`}
                      >
                        {isDeposit ? (
                          <ArrowDownLeft className="w-4 h-4" />
                        ) : (
                          <ArrowUpRight className="w-4 h-4" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-white truncate">{tx.description}</p>
                        <p className="text-[10px] text-white/50 mt-0.5 font-mono">
                          {tx.referenceId} · {tx.createdAt.substring(0, 10)}
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <p
                        className={`text-xs font-bold font-mono tabular-nums ${
                          isDeposit ? 'text-emerald-400' : 'text-white'
                        }`}
                      >
                        {isDeposit ? '+' : ''}${Math.abs(tx.amount).toFixed(2)}
                      </p>
                      <span
                        className={`text-[9px] font-semibold uppercase tracking-wider ${
                          isPending ? 'text-amber-400' : 'text-white/40'
                        }`}
                      >
                        {tx.status}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Pending Baki & Active Orders */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold font-display text-white">Active Orders & Baki</h2>
            <button
              onClick={() => setCurrentPage('baki')}
              className="text-xs text-amber-400 hover:underline flex items-center gap-1"
            >
              <span>Manage baki</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {pendingOrders.length === 0 ? (
              <div className="p-6 rounded-2xl glass-panel text-center text-xs text-white/50">
                No active processing orders.
              </div>
            ) : (
              pendingOrders.map((order) => (
                <div
                  key={order.id}
                  className="p-4 rounded-2xl glass-panel border border-white/10 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white truncate max-w-[200px]">
                      {order.itemTitle}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      {order.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-white/60">
                    <span>Order #{order.id}</span>
                    <span className="font-mono text-white font-semibold">${order.price.toFixed(2)}</span>
                  </div>
                  {order.licenseKey && (
                    <div className="p-2 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between">
                      <span className="text-[10px] text-white/50 font-mono truncate max-w-[180px]">
                        Key: {order.licenseKey}
                      </span>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(order.licenseKey || '');
                        }}
                        className="text-[10px] text-amber-400 hover:underline"
                      >
                        Copy
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}

            {/* Quick TOTP Shortcut Card */}
            <div className="p-4 rounded-2xl glass-panel border border-amber-500/20 bg-amber-500/5 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-white">2FA TOTP Generator</p>
                <p className="text-[11px] text-white/60 mt-0.5">Quickly generate 30s security codes</p>
              </div>
              <button
                onClick={() => {
                  setActiveToolId('totp');
                  setCurrentPage('tools');
                }}
                className="px-3 py-1.5 rounded-full bg-amber-500 text-black text-xs font-semibold hover:bg-amber-400"
              >
                Open Tool
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
