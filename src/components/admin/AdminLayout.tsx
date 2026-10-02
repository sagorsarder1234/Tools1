import React, { useState } from 'react';
import { useApp, AdminTab } from '../../context/AppContext';
import { User, MarketplaceItem, Order, TopupRequest } from '../../types';
import { GlassCard } from '../common/GlassCard';
import { GlassChart } from '../common/GlassChart';
import {
  LayoutDashboard,
  Users,
  ShoppingBag,
  CreditCard,
  Clock,
  MessageSquare,
  Wrench,
  Shield,
  FileText,
  Settings,
  Search,
  Plus,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Lock,
  Unlock,
  Trash2,
  Edit,
  DollarSign,
  TrendingUp,
  Activity,
  UserCheck,
  UserX,
  FileCheck,
} from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const {
    users,
    currentUser,
    activeAdminTab,
    setActiveAdminTab,
    topupRequests,
    approveTopupRequest,
    rejectTopupRequest,
    orders,
    updateOrderStatus,
    marketplaceItems,
    addMarketplaceItem,
    deleteMarketplaceItem,
    updateMarketplaceItem,
    groups,
    auditLogs,
    adjustUserBalance,
    updateUserStatus,
    settings,
    updateSettings,
    transactions,
    showToast,
  } = useApp();

  // Tab State
  const [userSearch, setUserSearch] = useState('');
  const [selectedUserForBalance, setSelectedUserForBalance] = useState<User | null>(null);
  const [balanceAdjustmentAmount, setBalanceAdjustmentAmount] = useState<number>(50);
  const [balanceAdjustmentReason, setBalanceAdjustmentReason] = useState<string>('Discretionary Bonus');

  // Add Item State
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [newItemTitle, setNewItemTitle] = useState('');
  const [newItemDesc, setNewItemDesc] = useState('');
  const [newItemPrice, setNewItemPrice] = useState(99);
  const [newItemCat, setNewItemCat] = useState<MarketplaceItem['category']>('SECURITY');
  const [newItemFeatures, setNewItemFeatures] = useState('Hardware security token, FIDO2 enabled');

  // Admin Navigation Tabs definition
  const adminTabs: Array<{ id: AdminTab; label: string; icon: React.ComponentType<{ className?: string }> }> = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'users', label: 'Users Directory', icon: Users },
    { id: 'payments', label: 'Top-Ups & Baki', icon: CreditCard },
    { id: 'marketplace', label: 'Marketplace Catalog', icon: ShoppingBag },
    { id: 'orders', label: 'Orders & Licenses', icon: FileCheck },
    { id: 'moderation', label: 'Chat & Moderation', icon: MessageSquare },
    { id: 'tools', label: 'Tool Policies', icon: Wrench },
    { id: 'audit-logs', label: 'Audit Trail', icon: FileText },
    { id: 'settings', label: 'Site Settings', icon: Settings },
  ];

  // Calculated Stats
  const totalUsers = users.length;
  const activeUsers = users.filter((u) => u.status === 'ACTIVE').length;
  const suspendedUsers = users.filter((u) => u.status === 'SUSPENDED').length;
  const pendingRequestsCount = topupRequests.filter((r) => r.status === 'PENDING').length;
  const totalSystemBalance = users.reduce((acc, u) => acc + u.balance, 0);

  // Filtered Users
  const filteredUsers = users.filter(
    (u) =>
      u.username.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.role.toLowerCase().includes(userSearch.toLowerCase())
  );

  const handleAdjustBalanceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserForBalance) return;
    adjustUserBalance(
      selectedUserForBalance.id,
      balanceAdjustmentAmount,
      balanceAdjustmentReason
    );
    setSelectedUserForBalance(null);
  };

  const handleAddNewItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemTitle.trim()) return;
    addMarketplaceItem({
      title: newItemTitle.trim(),
      description: newItemDesc.trim() || 'High performance item',
      price: Number(newItemPrice),
      category: newItemCat,
      status: 'AVAILABLE',
      features: newItemFeatures.split(',').map((f) => f.trim()),
    });
    setShowAddItemModal(false);
    setNewItemTitle('');
    setNewItemDesc('');
  };

  return (
    <div className="space-y-7 pb-24">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl glass-panel border border-amber-500/25 bg-amber-500/[0.04]">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold font-display text-white flex items-center gap-2">
              <span>Admin Operations Center</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                ROLE: {currentUser?.role || 'ADMIN'}
              </span>
            </h1>
            <p className="text-xs text-white/50 mt-0.5">
              Privileged system administration, financial authorizations, and immutable audit logs.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-3 py-1.5 rounded-full glass-panel text-white/70">
            Audit Engine: <strong className="text-emerald-400">ENFORCED</strong>
          </span>
        </div>
      </div>

      {/* ADMIN HORIZONTAL TABS BAR */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none p-1.5 rounded-2xl glass-panel-subtle border border-white/10">
        {adminTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeAdminTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveAdminTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-amber-500 text-black shadow-lg font-bold'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              {tab.id === 'payments' && pendingRequestsCount > 0 && (
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[9px] font-bold ${
                    isActive ? 'bg-black text-amber-300' : 'bg-amber-500 text-black'
                  }`}
                >
                  {pendingRequestsCount}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW DASHBOARD */}
      {activeAdminTab === 'dashboard' && (
        <div className="space-y-6 animate-in fade-in">
          {/* STAT CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <GlassCard glow>
              <div className="flex items-center justify-between text-white/60 mb-2">
                <span className="text-xs font-medium">Platform Users</span>
                <Users className="w-4 h-4 text-amber-400" />
              </div>
              <p className="text-3xl font-display font-bold text-white font-mono">{totalUsers}</p>
              <p className="text-[11px] text-white/50 mt-1">
                {activeUsers} active · {suspendedUsers} suspended
              </p>
            </GlassCard>

            <GlassCard>
              <div className="flex items-center justify-between text-white/60 mb-2">
                <span className="text-xs font-medium">Pending Top-Ups (Baki)</span>
                <Clock className="w-4 h-4 text-orange-400" />
              </div>
              <p className="text-3xl font-display font-bold text-amber-300 font-mono">
                {pendingRequestsCount}
              </p>
              <p className="text-[11px] text-white/50 mt-1">Awaiting approval clearance</p>
            </GlassCard>

            <GlassCard>
              <div className="flex items-center justify-between text-white/60 mb-2">
                <span className="text-xs font-medium">Marketplace Orders</span>
                <ShoppingBag className="w-4 h-4 text-sky-400" />
              </div>
              <p className="text-3xl font-display font-bold text-white font-mono">
                {orders.length}
              </p>
              <p className="text-[11px] text-white/50 mt-1">Lifetime fulfilled tokens</p>
            </GlassCard>

            <GlassCard>
              <div className="flex items-center justify-between text-white/60 mb-2">
                <span className="text-xs font-medium">System Ledger Volume</span>
                <DollarSign className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-3xl font-display font-bold text-white font-mono">
                ${totalSystemBalance.toFixed(0)}
              </p>
              <p className="text-[11px] text-emerald-400 mt-1">Aggregated user deposits</p>
            </GlassCard>
          </div>

          {/* ADMIN GLASS THROUGHPUT CHART */}
          <GlassChart
            title="Global Platform Settlement Throughput"
            subtitle="Real-time multi-channel deposits (USDT, BTC, Swift) and order transaction velocities"
            metricLabel={`$${totalSystemBalance.toLocaleString()}`}
          />

          {/* RECENT AUDIT LOGS OVERVIEW */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-white">Recent Security Audit Logs</h2>
              <button
                onClick={() => setActiveAdminTab('audit-logs')}
                className="text-xs text-amber-400 hover:underline"
              >
                View full audit trail →
              </button>
            </div>

            <div className="rounded-2xl glass-panel border border-white/10 divide-y divide-white/5">
              {auditLogs.slice(0, 4).map((log) => (
                <div key={log.id} className="p-3.5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-white/10 text-amber-300">
                      {log.action}
                    </span>
                    <span className="text-white/80">{log.details}</span>
                  </div>
                  <span className="text-white/40 font-mono text-[10px]">{log.timestamp}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: USER MANAGEMENT */}
      {activeAdminTab === 'users' && (
        <div className="space-y-4 animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-lg font-bold font-display text-white">Registered Users Directory</h2>
            <div className="relative w-full sm:w-72">
              <input
                type="text"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                placeholder="Search username, email or role..."
                className="w-full pl-9 pr-3 py-2 rounded-2xl glass-panel border border-white/15 focus:border-amber-400 focus:outline-none text-white text-xs"
              />
              <Search className="w-3.5 h-3.5 text-white/40 absolute left-3 top-2.5 pointer-events-none" />
            </div>
          </div>

          <div className="rounded-3xl glass-panel border border-white/10 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-white/5 border-b border-white/10 text-white/50 font-medium uppercase tracking-wider">
                  <tr>
                    <th className="py-3.5 px-4 sm:px-6">User / Handle</th>
                    <th className="py-3.5 px-4">Role</th>
                    <th className="py-3.5 px-4">Balance</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Joined</th>
                    <th className="py-3.5 px-4 sm:px-6 text-right">Admin Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-3.5 px-4 sm:px-6">
                        <div>
                          <p className="font-semibold text-white">{u.username}</p>
                          <p className="text-[10px] text-white/50 font-mono">{u.email}</p>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            u.role === 'ADMIN'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : 'bg-white/10 text-white/70'
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-white">
                        ${u.balance.toFixed(2)}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            u.status === 'ACTIVE'
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : 'bg-rose-500/20 text-rose-300'
                          }`}
                        >
                          {u.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-white/50 font-mono">
                        {u.createdAt.substring(0, 10)}
                      </td>
                      <td className="py-3.5 px-4 sm:px-6 text-right space-x-2">
                        {/* Adjust balance trigger */}
                        <button
                          onClick={() => setSelectedUserForBalance(u)}
                          className="px-2.5 py-1 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-semibold text-[11px]"
                        >
                          Adjust Bal
                        </button>
                        {/* Suspend / Activate toggle */}
                        {u.id !== currentUser?.id && (
                          <button
                            onClick={() =>
                              updateUserStatus(
                                u.id,
                                u.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE'
                              )
                            }
                            className={`px-2.5 py-1 rounded-xl font-semibold text-[11px] ${
                              u.status === 'ACTIVE'
                                ? 'bg-rose-500/20 hover:bg-rose-500/30 text-rose-300'
                                : 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300'
                            }`}
                          >
                            {u.status === 'ACTIVE' ? 'Suspend' : 'Activate'}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PAYMENTS & TOP-UPS (BAKI APPROVAL) */}
      {activeAdminTab === 'payments' && (
        <div className="space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold font-display text-white">
              Pending Top-Up & Baki Requests
            </h2>
            <span className="text-xs text-amber-300 font-mono">
              {pendingRequestsCount} pending requests
            </span>
          </div>

          <div className="space-y-3">
            {topupRequests.map((req) => {
              const isPending = req.status === 'PENDING';
              return (
                <div
                  key={req.id}
                  className={`p-5 rounded-3xl glass-panel border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    isPending ? 'border-amber-500/30 bg-amber-500/[0.03]' : 'border-white/10'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">
                        User @{req.userName} ({req.userEmail})
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          req.status === 'APPROVED'
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : req.status === 'PENDING'
                            ? 'bg-amber-500/20 text-amber-300'
                            : 'bg-rose-500/20 text-rose-300'
                        }`}
                      >
                        {req.status}
                      </span>
                    </div>

                    <p className="text-xs text-white/60">
                      Method: <strong className="text-white">{req.paymentMethod}</strong> · Ref ID:{' '}
                      <code className="text-amber-300 font-mono">{req.referenceId}</code>
                    </p>
                    <span className="text-[10px] text-white/40 block">
                      Submitted: {req.createdAt.substring(0, 19).replace('T', ' ')}
                    </span>
                    {req.adminNotes && (
                      <p className="text-[11px] text-white/50 italic">Note: {req.adminNotes}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-2xl font-bold font-mono text-emerald-400">
                      ${req.amount.toFixed(2)}
                    </span>

                    {isPending && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => approveTopupRequest(req.id, 'Approved by admin')}
                          className="px-4 py-2 rounded-full bg-emerald-500 text-black font-semibold text-xs hover:bg-emerald-400 shadow transition-all active:scale-95 flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Approve & Credit</span>
                        </button>

                        <button
                          onClick={() => rejectTopupRequest(req.id, 'Unconfirmed deposit hash')}
                          className="px-3 py-2 rounded-full bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 font-semibold text-xs transition-all active:scale-95"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 4: MARKETPLACE MANAGEMENT */}
      {activeAdminTab === 'marketplace' && (
        <div className="space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold font-display text-white">Marketplace Catalog Management</h2>
            <button
              onClick={() => setShowAddItemModal(true)}
              className="px-4 py-2 rounded-full bg-white text-black text-xs font-semibold hover:bg-white/90 shadow flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Product</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {marketplaceItems.map((item) => (
              <div
                key={item.id}
                className="p-5 rounded-3xl glass-panel border border-white/10 flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white">{item.title}</h3>
                    <span className="font-mono font-bold text-amber-300">${item.price.toFixed(2)}</span>
                  </div>
                  <p className="text-xs text-white/60 mt-1 line-clamp-2">{item.description}</p>
                </div>

                <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/10 text-white/70">
                    {item.category}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        updateMarketplaceItem(item.id, {
                          status: item.status === 'AVAILABLE' ? 'OUT_OF_STOCK' : 'AVAILABLE',
                        })
                      }
                      className="px-2.5 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-white text-[11px]"
                    >
                      Status: {item.status}
                    </button>
                    <button
                      onClick={() => deleteMarketplaceItem(item.id)}
                      className="p-1 rounded-xl text-white/30 hover:text-rose-400"
                      title="Delete Product"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: ORDERS & LICENSES */}
      {activeAdminTab === 'orders' && (
        <div className="space-y-4 animate-in fade-in">
          <h2 className="text-lg font-bold font-display text-white">All Platform Orders</h2>
          <div className="rounded-3xl glass-panel border border-white/10 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-white/5 border-b border-white/10 text-white/50 font-medium uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4 sm:px-6">Order ID</th>
                    <th className="py-3 px-4">User</th>
                    <th className="py-3 px-4">Product</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 sm:px-6 text-right">Update</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {orders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-white/5">
                      <td className="py-3 px-4 sm:px-6 font-mono text-white/80">#{ord.id}</td>
                      <td className="py-3 px-4 font-semibold text-white">@{ord.userName}</td>
                      <td className="py-3 px-4 text-white/90">{ord.itemTitle}</td>
                      <td className="py-3 px-4 font-mono font-bold text-white">${ord.price.toFixed(2)}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            ord.status === 'COMPLETED'
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : ord.status === 'PROCESSING'
                              ? 'bg-amber-500/20 text-amber-300'
                              : 'bg-white/10 text-white/60'
                          }`}
                        >
                          {ord.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 sm:px-6 text-right space-x-1.5">
                        <button
                          onClick={() => updateOrderStatus(ord.id, 'COMPLETED')}
                          className="px-2 py-1 rounded bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-[10px] font-semibold"
                        >
                          Complete
                        </button>
                        <button
                          onClick={() => updateOrderStatus(ord.id, 'CANCELLED')}
                          className="px-2 py-1 rounded bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-[10px] font-semibold"
                        >
                          Cancel
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: CHAT MODERATION */}
      {activeAdminTab === 'moderation' && (
        <div className="space-y-4 animate-in fade-in">
          <h2 className="text-lg font-bold font-display text-white">Syndicate & Chat Moderation</h2>
          <div className="p-4 rounded-3xl glass-panel space-y-3">
            <p className="text-xs text-white/70">
              Active Syndicates ({groups.length}). Admins can supervise communication and ensure regulatory compliance.
            </p>
            <div className="space-y-2">
              {groups.map((g) => (
                <div key={g.id} className="p-3 rounded-2xl bg-white/5 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-white">{g.name}</span>
                    <span className="text-white/40 block text-[10px]">{g.memberCount} members · Category: {g.category}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/20 text-emerald-300">
                    Compliant
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 7: TOOL POLICIES */}
      {activeAdminTab === 'tools' && (
        <div className="space-y-4 animate-in fade-in">
          <h2 className="text-lg font-bold font-display text-white">Tool Access Policies & Limits</h2>
          <GlassCard className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-2xl bg-white/5">
              <div>
                <p className="text-xs font-bold text-white">Enable 2FA TOTP Generator</p>
                <p className="text-[11px] text-white/50">Allow client-side TOTP calculation</p>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold">
                ACTIVE
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl bg-white/5">
              <div>
                <p className="text-xs font-bold text-white">High-Entropy Password Engine</p>
                <p className="text-[11px] text-white/50">Standard window.crypto entropy</p>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold">
                ACTIVE
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl bg-white/5">
              <div>
                <p className="text-xs font-bold text-white">IP & Network Diagnostic</p>
                <p className="text-[11px] text-white/50">Latency and public routing analyzer</p>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold">
                ACTIVE
              </span>
            </div>
          </GlassCard>
        </div>
      )}

      {/* TAB 8: AUDIT LOGS */}
      {activeAdminTab === 'audit-logs' && (
        <div className="space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold font-display text-white">Immutable Security Audit Logs</h2>
            <span className="text-xs text-white/40">{auditLogs.length} entries registered</span>
          </div>

          <div className="rounded-3xl glass-panel border border-white/10 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-white/5 border-b border-white/10 text-white/50 font-medium uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4 sm:px-6">Timestamp</th>
                    <th className="py-3 px-4">Admin Operator</th>
                    <th className="py-3 px-4">Action</th>
                    <th className="py-3 px-4">Target</th>
                    <th className="py-3 px-4 sm:px-6">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-mono">
                  {auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-white/5">
                      <td className="py-3 px-4 sm:px-6 text-white/50 text-[11px]">{log.timestamp}</td>
                      <td className="py-3 px-4 text-amber-300 font-semibold">@{log.adminName}</td>
                      <td className="py-3 px-4 text-white font-bold">{log.action}</td>
                      <td className="py-3 px-4 text-white/70">{log.target}</td>
                      <td className="py-3 px-4 sm:px-6 text-white/80 font-sans text-xs">{log.details}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 9: SITE SETTINGS */}
      {activeAdminTab === 'settings' && (
        <div className="space-y-4 animate-in fade-in">
          <h2 className="text-lg font-bold font-display text-white">System Configuration</h2>
          <GlassCard className="space-y-4 max-w-xl">
            <div>
              <label className="block text-xs font-semibold text-white/70 mb-1">Platform Brand Name</label>
              <input
                type="text"
                value={settings.siteName}
                onChange={(e) => updateSettings({ siteName: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl glass-item border border-white/15 focus:border-amber-400 focus:outline-none text-white text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-white/70 mb-1">
                  Default Sign-Up Bonus ($)
                </label>
                <input
                  type="number"
                  value={settings.defaultUserBalance}
                  onChange={(e) => updateSettings({ defaultUserBalance: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 rounded-xl glass-item border border-white/15 focus:border-amber-400 focus:outline-none text-white text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/70 mb-1">
                  Min Top-Up Deposit ($)
                </label>
                <input
                  type="number"
                  value={settings.minTopupAmount}
                  onChange={(e) => updateSettings({ minTopupAmount: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 rounded-xl glass-item border border-white/15 focus:border-amber-400 focus:outline-none text-white text-xs font-mono"
                />
              </div>
            </div>

            <div className="pt-2">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-white/80">
                <input
                  type="checkbox"
                  checked={settings.registrationOpen}
                  onChange={(e) => updateSettings({ registrationOpen: e.target.checked })}
                  className="rounded border-white/20 bg-white/10 text-amber-500 focus:ring-0"
                />
                <span>Open Registration Allowed</span>
              </label>
            </div>
          </GlassCard>
        </div>
      )}

      {/* ADJUST USER BALANCE MODAL */}
      {selectedUserForBalance && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xl animate-in fade-in">
          <div className="relative w-full max-w-md rounded-3xl glass-panel border border-white/20 p-6 sm:p-7 shadow-2xl space-y-4">
            <h3 className="text-xl font-bold font-display text-white">Adjust User Balance</h3>
            <p className="text-xs text-white/60">
              Modifying balance for <strong className="text-white">@{selectedUserForBalance.username}</strong> (Current: ${selectedUserForBalance.balance.toFixed(2)})
            </p>

            <form onSubmit={handleAdjustBalanceSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-white/70 mb-1">
                  Amount Adjustment (+ or -)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={balanceAdjustmentAmount}
                  onChange={(e) => setBalanceAdjustmentAmount(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-2xl glass-item border border-white/15 focus:border-amber-400 focus:outline-none text-white text-sm font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-white/70 mb-1">
                  Audit Reason / Justification
                </label>
                <input
                  type="text"
                  value={balanceAdjustmentReason}
                  onChange={(e) => setBalanceAdjustmentReason(e.target.value)}
                  placeholder="e.g. Bug bounty reward, correction, manual wire match"
                  className="w-full px-4 py-2.5 rounded-2xl glass-item border border-white/15 focus:border-amber-400 focus:outline-none text-white text-xs"
                  required
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedUserForBalance(null)}
                  className="w-1/2 py-2.5 rounded-full glass-panel text-white text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 rounded-full bg-white text-black text-xs font-semibold hover:bg-white/90 shadow"
                >
                  Execute Audit Action
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD MARKETPLACE ITEM MODAL */}
      {showAddItemModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xl animate-in fade-in">
          <div className="relative w-full max-w-md rounded-3xl glass-panel border border-white/20 p-6 sm:p-7 shadow-2xl space-y-4">
            <h3 className="text-xl font-bold font-display text-white">Add Marketplace Product</h3>

            <form onSubmit={handleAddNewItem} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-white/70 mb-1">Product Title</label>
                <input
                  type="text"
                  value={newItemTitle}
                  onChange={(e) => setNewItemTitle(e.target.value)}
                  placeholder="e.g. Edge Hardware Security Key"
                  className="w-full px-3.5 py-2.5 rounded-xl glass-item border border-white/15 focus:border-amber-400 focus:outline-none text-white text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-white/70 mb-1">Description</label>
                <textarea
                  value={newItemDesc}
                  onChange={(e) => setNewItemDesc(e.target.value)}
                  rows={2}
                  className="w-full px-3.5 py-2.5 rounded-xl glass-item border border-white/15 focus:border-amber-400 focus:outline-none text-white text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-white/70 mb-1">Price ($)</label>
                  <input
                    type="number"
                    value={newItemPrice}
                    onChange={(e) => setNewItemPrice(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl glass-item border border-white/15 focus:border-amber-400 focus:outline-none text-white text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-white/70 mb-1">Category</label>
                  <select
                    value={newItemCat}
                    onChange={(e) => setNewItemCat(e.target.value as any)}
                    className="w-full px-3 py-2.5 rounded-xl glass-item border border-white/15 focus:border-amber-400 focus:outline-none text-white text-xs bg-[#11121a]"
                  >
                    <option value="SECURITY">Security</option>
                    <option value="INFRASTRUCTURE">Infrastructure</option>
                    <option value="DEV_TOOLS">Dev Tools</option>
                    <option value="TEMPLATES">Templates</option>
                    <option value="SERVICES">Services</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-white/70 mb-1">Features (comma separated)</label>
                <input
                  type="text"
                  value={newItemFeatures}
                  onChange={(e) => setNewItemFeatures(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl glass-item border border-white/15 focus:border-amber-400 focus:outline-none text-white text-xs"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddItemModal(false)}
                  className="w-1/2 py-2.5 rounded-full glass-panel text-white text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 rounded-full bg-white text-black text-xs font-semibold hover:bg-white/90 shadow"
                >
                  Publish Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
