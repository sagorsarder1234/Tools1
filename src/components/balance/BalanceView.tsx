import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TopupRequest } from '../../types';
import { GlassCard } from '../common/GlassCard';
import { GlassChart } from '../common/GlassChart';
import {
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Copy,
  Check,
  Plus,
  QrCode,
  AlertCircle,
} from 'lucide-react';

export const BalanceView: React.FC = () => {
  const {
    currentUser,
    transactions,
    submitTopupRequest,
    setCurrentPage,
    settings,
  } = useApp();

  const [topupModalOpen, setTopupModalOpen] = useState(false);
  const [amount, setAmount] = useState<number>(100);
  const [paymentMethod, setPaymentMethod] = useState<TopupRequest['paymentMethod']>('USDT_TRC20');
  const [referenceId, setReferenceId] = useState('');
  const [copiedAddress, setCopiedAddress] = useState(false);

  if (!currentUser) return null;

  const userTransactions = transactions.filter((t) => t.userId === currentUser.id);

  // Demo destination addresses
  const depositAddresses: Record<TopupRequest['paymentMethod'], { label: string; address: string; note: string }> = {
    USDT_TRC20: {
      label: 'TRON TRC-20 Address',
      address: 'TYas938qN992xKZ810bBvaK189zM3810aQ',
      note: 'Send exact amount. Network confirmations take ~2-5 minutes.',
    },
    BTC: {
      label: 'Bitcoin Bech32 Address',
      address: 'bc1q94819028axncva019283ka81029381k',
      note: 'Requires 2 on-chain blockchain confirmations.',
    },
    BANK_TRANSFER: {
      label: 'Wire Transfer IBAN',
      address: 'CH93 0000 0000 8492 1092 8419',
      note: 'Include your username "alexthorne" in the transfer memo.',
    },
    BKASH_NAGAD: {
      label: 'Merchant Personal Wallet',
      address: '+880 1712 345678 (Personal / Send Money)',
      note: 'Enter Transaction ID (TrxID) below after sending.',
    },
    CREDIT_CARD: {
      label: 'Instant Card Gateway',
      address: 'Stripe Secured Gateway (Live Portal)',
      note: 'Generates instant automated receipt upon submission.',
    },
  };

  const handleTopupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!referenceId.trim()) {
      return;
    }
    submitTopupRequest(amount, paymentMethod, referenceId.trim());
    setTopupModalOpen(false);
    setReferenceId('');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2000);
  };

  return (
    <div className="space-y-7 pb-20">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-white">
            Balance & Financial Ledger
          </h1>
          <p className="text-xs text-white/50 mt-1">
            Real-time balance settlement, secure top-ups, and verified transaction logs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setTopupModalOpen(true)}
            className="px-5 py-2.5 rounded-full bg-white hover:bg-white/95 text-black font-semibold text-xs shadow-xl transition-all active:scale-95 flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Submit Top-Up</span>
          </button>
          <button
            onClick={() => setCurrentPage('baki')}
            className="px-4 py-2.5 rounded-full glass-panel hover:bg-white/10 text-white font-medium text-xs border border-white/15 transition-all flex items-center gap-1.5"
          >
            <Clock className="w-4 h-4 text-amber-400" />
            <span>Baki Pending List</span>
          </button>
        </div>
      </div>

      {/* METRIC OVERVIEW CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <GlassCard glow>
          <div className="flex items-center justify-between text-white/60 mb-2">
            <span className="text-xs font-medium">Available Balance</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-display font-bold text-white font-mono tabular-nums">
            ${currentUser.balance.toFixed(2)}
          </p>
          <p className="text-[11px] text-white/50 mt-1">Ready for marketplace & tools</p>
        </GlassCard>

        <GlassCard hoverEffect onClick={() => setCurrentPage('baki')}>
          <div className="flex items-center justify-between text-white/60 mb-2">
            <span className="text-xs font-medium">Pending Baki</span>
            <div className="w-8 h-8 rounded-xl bg-orange-500/15 text-orange-400 flex items-center justify-center border border-orange-500/30">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-display font-bold text-amber-300 font-mono tabular-nums">
            ${currentUser.pendingBalance.toFixed(2)}
          </p>
          <p className="text-[11px] text-white/50 mt-1">Pending admin confirmation</p>
        </GlassCard>

        <GlassCard>
          <div className="flex items-center justify-between text-white/60 mb-2">
            <span className="text-xs font-medium">Lifetime Deposited</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <ArrowDownLeft className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-display font-bold text-white font-mono tabular-nums">
            ${currentUser.totalDeposited.toFixed(2)}
          </p>
          <p className="text-[11px] text-white/50 mt-1">Total cleared deposits</p>
        </GlassCard>

        <GlassCard>
          <div className="flex items-center justify-between text-white/60 mb-2">
            <span className="text-xs font-medium">Total Spent</span>
            <div className="w-8 h-8 rounded-xl bg-sky-500/15 text-sky-400 flex items-center justify-center border border-sky-500/30">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-display font-bold text-white font-mono tabular-nums">
            ${currentUser.totalSpent.toFixed(2)}
          </p>
          <p className="text-[11px] text-white/50 mt-1">Marketplace & service debits</p>
        </GlassCard>
      </div>

      {/* LIQUIDITY & CLEARING STREAM CHART */}
      <GlassChart
        title="Deposit & Baki Settlement Velocity"
        subtitle="30-day multi-channel top-up trajectory and pending clearance execution rate"
        metricLabel={`$${currentUser.balance.toFixed(2)}`}
      />

      {/* DETAILED TRANSACTION TABLE */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold font-display text-white">Transaction History</h2>
          <span className="text-xs text-white/50">{userTransactions.length} records</span>
        </div>

        <div className="rounded-3xl glass-panel border border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-white/5 border-b border-white/10 text-white/50 font-medium uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4 sm:px-6">Type & Description</th>
                  <th className="py-3.5 px-4">Reference ID</th>
                  <th className="py-3.5 px-4">Amount</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {userTransactions.map((tx) => {
                  const isDeposit = tx.type === 'DEPOSIT';
                  const isPending = tx.status === 'PENDING';
                  return (
                    <tr key={tx.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-3.5 px-4 sm:px-6">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                              isDeposit
                                ? 'bg-emerald-500/20 text-emerald-400'
                                : 'bg-amber-500/20 text-amber-400'
                            }`}
                          >
                            {isDeposit ? <ArrowDownLeft className="w-3.5 h-3.5" /> : <ArrowUpRight className="w-3.5 h-3.5" />}
                          </div>
                          <div>
                            <span className="font-semibold text-white block">{tx.description}</span>
                            <span className="text-[10px] text-white/40">{tx.type.replace('_', ' ')}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-mono text-white/80">
                        {tx.referenceId}
                      </td>

                      <td className="py-3.5 px-4 font-mono font-bold tabular-nums">
                        <span className={isDeposit ? 'text-emerald-400' : 'text-white'}>
                          {isDeposit ? '+' : ''}${Math.abs(tx.amount).toFixed(2)}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            tx.status === 'COMPLETED'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : tx.status === 'PENDING'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          }`}
                        >
                          {tx.status}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 sm:px-6 text-right text-white/50 font-mono">
                        {tx.createdAt.substring(0, 10)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* TOP-UP MODAL */}
      {topupModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xl animate-in fade-in overflow-y-auto">
          <div className="relative w-full max-w-lg rounded-3xl glass-panel border border-white/20 p-6 sm:p-8 shadow-2xl space-y-5 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div>
                <h3 className="text-xl font-bold font-display text-white">Deposit / Top-Up</h3>
                <p className="text-xs text-white/60">Minimum deposit: ${settings.minTopupAmount}</p>
              </div>
              <button
                onClick={() => setTopupModalOpen(false)}
                className="text-white/50 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleTopupSubmit} className="space-y-4">
              {/* Payment Method Selector */}
              <div>
                <label className="block text-xs font-medium text-white/70 mb-2">Select Method</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {(['USDT_TRC20', 'BTC', 'BANK_TRANSFER', 'BKASH_NAGAD', 'CREDIT_CARD'] as const).map(
                    (m) => (
                      <button
                        type="button"
                        key={m}
                        onClick={() => setPaymentMethod(m)}
                        className={`p-2.5 rounded-2xl text-xs font-semibold text-left transition-all border ${
                          paymentMethod === m
                            ? 'bg-amber-500/20 border-amber-400 text-white shadow-lg'
                            : 'glass-item text-white/70 border-white/10 hover:border-white/20'
                        }`}
                      >
                        {m.replace('_', ' ')}
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* Destination Address Card */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <span className="text-[11px] text-white/50 uppercase tracking-wider block font-semibold">
                  {depositAddresses[paymentMethod].label}
                </span>
                <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-black/40 border border-white/10">
                  <span className="font-mono text-xs text-amber-300 break-all select-all">
                    {depositAddresses[paymentMethod].address}
                  </span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(depositAddresses[paymentMethod].address)}
                    className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white/80 shrink-0"
                    title="Copy address"
                  >
                    {copiedAddress ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <p className="text-[11px] text-white/60">
                  {depositAddresses[paymentMethod].note}
                </p>
              </div>

              {/* Amount Input */}
              <div>
                <label className="block text-xs font-medium text-white/70 mb-1.5">
                  Deposit Amount (USD)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min={settings.minTopupAmount}
                    max={settings.maxDailyTopup}
                    step="1"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full px-4 py-3 rounded-2xl glass-item border border-white/15 focus:border-amber-400 focus:outline-none text-white text-sm font-mono"
                    required
                  />
                  <span className="absolute right-3.5 top-3.5 text-xs text-white/50 font-bold">$ USD</span>
                </div>
              </div>

              {/* Reference ID / Hash */}
              <div>
                <label className="block text-xs font-medium text-white/70 mb-1.5">
                  Transaction Hash or Reference ID
                </label>
                <input
                  type="text"
                  value={referenceId}
                  onChange={(e) => setReferenceId(e.target.value)}
                  placeholder="e.g. TX-984920491 or SWIFT-REF-8840"
                  className="w-full px-4 py-3 rounded-2xl glass-item border border-white/15 focus:border-amber-400 focus:outline-none text-white text-sm font-mono"
                  required
                />
                <p className="text-[10px] text-white/40 mt-1">
                  This reference will be verified by the admin team before clearing into your active balance.
                </p>
              </div>

              <div className="flex items-center gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setTopupModalOpen(false)}
                  className="w-1/2 py-3 rounded-full glass-panel text-white text-xs font-semibold hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-3 rounded-full bg-white text-black text-xs font-semibold hover:bg-white/90 shadow-xl"
                >
                  Submit for Clearing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
