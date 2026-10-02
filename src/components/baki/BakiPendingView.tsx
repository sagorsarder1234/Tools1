import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { GlassCard } from '../common/GlassCard';
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  ShoppingBag,
  ArrowUpRight,
  Filter,
} from 'lucide-react';

export const BakiPendingView: React.FC = () => {
  const { currentUser, topupRequests, orders, setCurrentPage, showToast } = useApp();
  const [filterType, setFilterType] = useState<'ALL' | 'PAYMENTS' | 'ORDERS'>('ALL');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!currentUser) return null;

  // Pending topup payments (Baki)
  const pendingPayments = topupRequests.filter(
    (r) => r.userId === currentUser.id && r.status === 'PENDING'
  );

  // Pending orders
  const pendingOrders = orders.filter(
    (o) => o.userId === currentUser.id && o.status === 'PROCESSING'
  );

  const copyRef = (ref: string) => {
    navigator.clipboard.writeText(ref);
    setCopiedId(ref);
    showToast('Reference copied to clipboard', 'info');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const totalBakiAmount = pendingPayments.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="space-y-7 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-white">
            Baki & Pending Clearance
          </h1>
          <p className="text-xs text-white/50 mt-1">
            Real-time queue of pending deposits, unconfirmed baki, and processing marketplace orders.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage('balance')}
            className="px-4 py-2 rounded-full bg-white text-black text-xs font-semibold hover:bg-white/90 shadow"
          >
            Add New Deposit
          </button>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <GlassCard glow>
          <div className="flex items-center justify-between text-white/60 mb-2">
            <span className="text-xs font-medium">Total Pending Baki</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-3xl font-display font-bold text-amber-300 font-mono tabular-nums">
            ${totalBakiAmount.toFixed(2)}
          </p>
          <p className="text-[11px] text-white/50 mt-1">
            {pendingPayments.length} pending top-up verification{pendingPayments.length === 1 ? '' : 's'}
          </p>
        </GlassCard>

        <GlassCard>
          <div className="flex items-center justify-between text-white/60 mb-2">
            <span className="text-xs font-medium">Processing Orders</span>
            <ShoppingBag className="w-4 h-4 text-sky-400" />
          </div>
          <p className="text-3xl font-display font-bold text-white font-mono tabular-nums">
            {pendingOrders.length}
          </p>
          <p className="text-[11px] text-white/50 mt-1">Awaiting dispatch or license delivery</p>
        </GlassCard>

        <GlassCard>
          <div className="flex items-center justify-between text-white/60 mb-2">
            <span className="text-xs font-medium">Clearing Status</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-xl font-display font-bold text-emerald-300">
            Active Desk
          </p>
          <p className="text-[11px] text-white/50 mt-1">Automated batch clearance every 15 min</p>
        </GlassCard>
      </div>

      {/* FILTER TABS */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setFilterType('ALL')}
          className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
            filterType === 'ALL'
              ? 'bg-amber-500 text-black shadow'
              : 'glass-panel text-white/70 hover:text-white'
          }`}
        >
          All Pending ({pendingPayments.length + pendingOrders.length})
        </button>
        <button
          onClick={() => setFilterType('PAYMENTS')}
          className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
            filterType === 'PAYMENTS'
              ? 'bg-amber-500 text-black shadow'
              : 'glass-panel text-white/70 hover:text-white'
          }`}
        >
          Pending Deposits / Baki ({pendingPayments.length})
        </button>
        <button
          onClick={() => setFilterType('ORDERS')}
          className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
            filterType === 'ORDERS'
              ? 'bg-amber-500 text-black shadow'
              : 'glass-panel text-white/70 hover:text-white'
          }`}
        >
          Orders Processing ({pendingOrders.length})
        </button>
      </div>

      {/* PENDING ITEMS LIST */}
      <div className="space-y-3">
        {/* Render Pending Payments */}
        {(filterType === 'ALL' || filterType === 'PAYMENTS') &&
          pendingPayments.map((req) => (
            <div
              key={req.id}
              className="p-5 rounded-3xl glass-panel border border-amber-500/20 bg-amber-500/[0.03] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white">
                    Deposit via {req.paymentMethod.replace('_', ' ')}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    PENDING CLEARANCE
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-2 text-xs text-white/50 font-mono">
                  <span>Ref: {req.referenceId}</span>
                  <button
                    onClick={() => copyRef(req.referenceId)}
                    className="text-amber-400 hover:text-white p-0.5"
                    title="Copy reference"
                  >
                    {copiedId === req.referenceId ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                  <span>·</span>
                  <span>Submitted: {req.createdAt.substring(0, 16).replace('T', ' ')}</span>
                </div>
                {req.adminNotes && (
                  <p className="text-[11px] text-amber-300/80 mt-1">
                    Desk note: {req.adminNotes}
                  </p>
                )}
              </div>

              <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-1 shrink-0">
                <span className="text-xl font-bold font-mono text-amber-300 tabular-nums">
                  +${req.amount.toFixed(2)}
                </span>
                <span className="text-[10px] text-white/40">In review</span>
              </div>
            </div>
          ))}

        {/* Render Pending Orders */}
        {(filterType === 'ALL' || filterType === 'ORDERS') &&
          pendingOrders.map((ord) => (
            <div
              key={ord.id}
              className="p-5 rounded-3xl glass-panel border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white">{ord.itemTitle}</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30">
                    ORDER PROCESSING
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-white/50 font-mono">
                  <span>Order ID: #{ord.id}</span>
                  <span>·</span>
                  <span>Date: {ord.createdAt.substring(0, 10)}</span>
                </div>
              </div>

              <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-1 shrink-0">
                <span className="text-xl font-bold font-mono text-white tabular-nums">
                  ${ord.price.toFixed(2)}
                </span>
                <span className="text-[10px] text-white/40">Hardware allocation</span>
              </div>
            </div>
          ))}

        {pendingPayments.length === 0 && pendingOrders.length === 0 && (
          <div className="p-12 text-center glass-panel rounded-3xl text-white/50 text-xs">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
            <p className="font-semibold text-white">All Clear!</p>
            <p className="text-[11px] mt-0.5">You have no pending baki or unprocessed orders.</p>
          </div>
        )}
      </div>
    </div>
  );
};
