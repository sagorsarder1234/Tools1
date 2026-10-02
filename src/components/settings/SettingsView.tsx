import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { GlassCard } from '../common/GlassCard';
import {
  User as UserIcon,
  Camera,
  Lock,
  Wallet,
  Save,
  Eye,
  EyeOff,
  Building2,
  Smartphone,
  Coins,
  ChevronLeft,
  ArrowRight,
  Settings as SettingsIcon,
} from 'lucide-react';
import { PayoutAccount } from '../../types';

export const SettingsView: React.FC = () => {
  const { currentUser, updateUserProfile, showToast } = useApp();

  // Active Tool: null (shows the 4-item list) or 'avatar' | 'name' | 'password' | 'payout'
  const [activeTool, setActiveTool] = useState<
    'avatar' | 'name' | 'password' | 'payout' | null
  >(null);

  // 1. Change Name State
  const [usernameInput, setUsernameInput] = useState(currentUser?.username || '');
  const [bioInput, setBioInput] = useState(currentUser?.bio || '');

  // 2. Change Profile Picture State
  const [avatarInput, setAvatarInput] = useState(currentUser?.avatarUrl || '');
  const presetAvatars = [
    '/src/assets/images/tenex_avatar_portrait_1790868110528.jpg',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=300&auto=format&fit=crop&q=80',
  ];

  // 3. Password Change State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);

  // 4. Update Payout Account State
  const [payoutMethod, setPayoutMethod] = useState<PayoutAccount['method']>(
    currentUser?.payoutAccount?.method || 'BKASH'
  );
  const [accountNumber, setAccountNumber] = useState(
    currentUser?.payoutAccount?.accountNumber || ''
  );
  const [accountName, setAccountName] = useState(
    currentUser?.payoutAccount?.accountName || ''
  );
  const [bankName, setBankName] = useState(
    currentUser?.payoutAccount?.bankName || ''
  );

  // Handle Name Save
  const handleNameSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!usernameInput.trim()) {
      showToast('Name cannot be empty.', 'error');
      return;
    }
    updateUserProfile({ username: usernameInput.trim(), bio: bioInput.trim() });
    showToast('Name updated successfully!', 'success');
  };

  // Handle Avatar Save
  const handleAvatarSave = (newUrl?: string) => {
    const urlToSave = (newUrl !== undefined ? newUrl : avatarInput).trim();
    updateUserProfile({ avatarUrl: urlToSave });
    if (newUrl) setAvatarInput(newUrl);
    showToast('Profile picture updated successfully!', 'success');
  };

  // Handle Password Change
  const handlePasswordSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      showToast('Password must be at least 6 characters.', 'error');
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast('New passwords do not match.', 'error');
      return;
    }
    showToast('Password changed successfully!', 'success');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  // Handle Payout Account Save
  const handlePayoutSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!accountNumber.trim()) {
      showToast('Account number is required.', 'error');
      return;
    }
    if (!accountName.trim()) {
      showToast('Account holder name is required.', 'error');
      return;
    }

    const updatedPayout: PayoutAccount = {
      method: payoutMethod,
      accountNumber: accountNumber.trim(),
      accountName: accountName.trim(),
      bankName: payoutMethod === 'BANK' ? bankName.trim() : undefined,
    };

    updateUserProfile({ payoutAccount: updatedPayout });
    showToast('Payout account updated successfully!', 'success');
  };

  // 4 tools list in English:
  // Settings
  //    Profile Picture
  //    Change Name
  //    Change Password
  //    Payout Account
  const settingsList = [
    {
      id: 'avatar' as const,
      title: 'Profile Picture',
      subtitle: 'Upload photo or choose preset avatar',
      icon: Camera,
      color: 'text-violet-400',
      bgColor: 'bg-violet-500/15',
    },
    {
      id: 'name' as const,
      title: 'Change Name',
      subtitle: 'Update account username and bio',
      icon: UserIcon,
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/15',
    },
    {
      id: 'password' as const,
      title: 'Change Password',
      subtitle: 'Update login security credentials',
      icon: Lock,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/15',
    },
    {
      id: 'payout' as const,
      title: 'Payout Account',
      subtitle: 'Manage withdrawal payment methods',
      icon: Wallet,
      color: 'text-teal-400',
      bgColor: 'bg-teal-500/15',
    },
  ];

  return (
    <div className="space-y-6 pb-24 max-w-3xl mx-auto">
      {/* STEP 1: Settings List View when no tool is active */}
      {activeTool === null ? (
        <GlassCard className="p-6 sm:p-7 space-y-5">
          <div className="flex items-center gap-3 pb-3 border-b border-white/10">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-md shadow-amber-500/10">
              <SettingsIcon className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-display font-bold text-white">Settings</h1>
              <p className="text-xs text-white/50">Select an option to configure</p>
            </div>
          </div>

          {/* The 4 Settings Options List */}
          <div className="space-y-2.5 pt-1">
            {settingsList.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTool(item.id)}
                  className="w-full p-4 rounded-2xl glass-item border border-white/10 hover:border-amber-400/50 hover:bg-white/10 text-left transition-all flex items-center justify-between group cursor-pointer"
                >
                  <div className="flex items-center gap-3.5">
                    <div className={`w-10 h-10 rounded-xl ${item.bgColor} flex items-center justify-center ${item.color} group-hover:scale-105 transition-transform`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                        {item.title}
                      </div>
                      <div className="text-[11px] text-white/40 font-mono">
                        {item.subtitle}
                      </div>
                    </div>
                  </div>

                  <div className="w-8 h-8 rounded-full glass-panel flex items-center justify-center text-white/40 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </button>
              );
            })}
          </div>
        </GlassCard>
      ) : (
        /* STEP 2: Only the selected tool is displayed */
        <GlassCard className="p-6 sm:p-7 space-y-6 animate-in fade-in slide-in-from-top-3 duration-200">
          {/* Back to Settings Button */}
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <button
              type="button"
              onClick={() => setActiveTool(null)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel hover:bg-white/15 text-white/90 hover:text-white text-xs font-semibold transition-all border border-white/15 cursor-pointer group"
            >
              <ChevronLeft className="w-4 h-4 text-amber-400 group-hover:-translate-x-0.5 transition-transform" />
              <span>Settings</span>
            </button>
          </div>

          {/* 1. Profile Picture */}
          {activeTool === 'avatar' && (
            <div className="space-y-5 animate-in fade-in">
              <div className="flex items-center gap-2.5 pb-1">
                <div className="w-8 h-8 rounded-xl bg-violet-500/20 border border-violet-500/30 flex items-center justify-center text-violet-400">
                  <Camera className="w-4 h-4" />
                </div>
                <h2 className="text-lg font-bold text-white">Profile Picture</h2>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-5 pt-1">
                {/* Current Avatar Preview */}
                <div className="w-20 h-20 rounded-2xl overflow-hidden glass-panel border border-white/25 shrink-0 shadow-xl">
                  {avatarInput ? (
                    <img
                      src={avatarInput}
                      alt="Avatar Preview"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-tr from-amber-600 to-amber-300 flex items-center justify-center font-bold text-black text-2xl">
                      {currentUser?.username?.[0]?.toUpperCase() || 'U'}
                    </div>
                  )}
                </div>

                <div className="flex-1 w-full space-y-2">
                  <label className="block text-xs font-semibold text-white/80">
                    Direct Image URL
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={avatarInput}
                      onChange={(e) => setAvatarInput(e.target.value)}
                      placeholder="https://example.com/photo.jpg"
                      className="w-full px-3.5 py-2.5 rounded-xl glass-item border border-white/15 focus:border-amber-400 focus:outline-none text-white text-xs font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => handleAvatarSave()}
                      className="px-5 py-2.5 rounded-xl bg-violet-500 hover:bg-violet-400 text-white font-semibold text-xs shrink-0 transition-all cursor-pointer shadow"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <span className="block text-xs font-semibold text-white/50 mb-2.5">
                  Or select a preset avatar:
                </span>
                <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
                  {presetAvatars.map((url, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleAvatarSave(url)}
                      className={`w-12 h-12 rounded-xl overflow-hidden border-2 transition-all shrink-0 hover:scale-105 cursor-pointer ${
                        avatarInput === url ? 'border-amber-400 ring-2 ring-amber-400/40' : 'border-white/20'
                      }`}
                    >
                      <img
                        src={url}
                        alt={`Preset ${idx + 1}`}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 2. Change Name */}
          {activeTool === 'name' && (
            <form onSubmit={handleNameSave} className="space-y-4 animate-in fade-in">
              <div className="flex items-center gap-2.5 pb-1">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <UserIcon className="w-4 h-4" />
                </div>
                <h2 className="text-lg font-bold text-white">Change Name</h2>
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/80 mb-1">
                  New Username / Full Name
                </label>
                <input
                  type="text"
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  placeholder="Enter new username"
                  className="w-full px-3.5 py-2.5 rounded-xl glass-item border border-white/15 focus:border-amber-400 focus:outline-none text-white text-xs font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/80 mb-1">
                  Bio / Status
                </label>
                <textarea
                  value={bioInput}
                  onChange={(e) => setBioInput(e.target.value)}
                  rows={3}
                  placeholder="Add a short bio..."
                  className="w-full px-3.5 py-2.5 rounded-xl glass-item border border-white/15 focus:border-amber-400 focus:outline-none text-white text-xs resize-none"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-amber-400 text-black font-semibold text-xs hover:bg-amber-300 shadow transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Name</span>
                </button>
              </div>
            </form>
          )}

          {/* 3. Change Password */}
          {activeTool === 'password' && (
            <form onSubmit={handlePasswordSave} className="space-y-4 animate-in fade-in">
              <div className="flex items-center gap-2.5 pb-1">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <Lock className="w-4 h-4" />
                </div>
                <h2 className="text-lg font-bold text-white">Change Password</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-white/80 mb-1">
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2.5 rounded-xl glass-item border border-white/15 focus:border-amber-400 focus:outline-none text-white text-xs"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-white/80 mb-1">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Min. 6 characters"
                      className="w-full px-3.5 py-2.5 rounded-xl glass-item border border-white/15 focus:border-amber-400 focus:outline-none text-white text-xs pr-9"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-2.5 top-2.5 text-white/50 hover:text-white cursor-pointer"
                    >
                      {showNewPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-white/80 mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat new password"
                    className="w-full px-3.5 py-2.5 rounded-xl glass-item border border-white/15 focus:border-amber-400 focus:outline-none text-white text-xs"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs shadow transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Update Password</span>
                </button>
              </div>
            </form>
          )}

          {/* 4. Payout Account */}
          {activeTool === 'payout' && (
            <form onSubmit={handlePayoutSave} className="space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between pb-1">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-400">
                    <Wallet className="w-4 h-4" />
                  </div>
                  <h2 className="text-lg font-bold text-white">Payout Account</h2>
                </div>
                {currentUser?.payoutAccount && (
                  <span className="text-[10px] font-mono text-teal-300 bg-teal-500/20 px-2.5 py-0.5 rounded-full border border-teal-500/30">
                    Linked: {currentUser.payoutAccount.method}
                  </span>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/80 mb-1.5">
                  Select Gateway
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {[
                    { id: 'BKASH', label: 'bKash', icon: Smartphone, color: 'text-pink-400' },
                    { id: 'NAGAD', label: 'Nagad', icon: Smartphone, color: 'text-orange-400' },
                    { id: 'ROCKET', label: 'Rocket', icon: Smartphone, color: 'text-purple-400' },
                    { id: 'BANK', label: 'Bank', icon: Building2, color: 'text-sky-400' },
                    { id: 'USDT_TRC20', label: 'USDT TRC20', icon: Coins, color: 'text-emerald-400' },
                  ].map((m) => {
                    const Icon = m.icon;
                    const isSelected = payoutMethod === m.id;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setPayoutMethod(m.id as PayoutAccount['method'])}
                        className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                          isSelected
                            ? 'bg-white/15 border-amber-400 text-white font-bold'
                            : 'glass-item border-white/10 text-white/60 hover:text-white'
                        }`}
                      >
                        <Icon className={`w-3.5 h-3.5 ${m.color}`} />
                        <span className="text-[11px]">{m.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-white/80 mb-1">
                    {payoutMethod === 'USDT_TRC20'
                      ? 'USDT TRC-20 Wallet Address'
                      : payoutMethod === 'BANK'
                      ? 'Bank Account Number'
                      : 'Mobile Number (bKash/Nagad/Rocket)'}
                  </label>
                  <input
                    type="text"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    placeholder={
                      payoutMethod === 'USDT_TRC20'
                        ? 'T...'
                        : payoutMethod === 'BANK'
                        ? '1234567890...'
                        : '017XXXXXXXX'
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl glass-item border border-white/15 focus:border-amber-400 focus:outline-none text-white text-xs font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-white/80 mb-1">
                    Account Holder Name
                  </label>
                  <input
                    type="text"
                    value={accountName}
                    onChange={(e) => setAccountName(e.target.value)}
                    placeholder="Full name as in account"
                    className="w-full px-3.5 py-2.5 rounded-xl glass-item border border-white/15 focus:border-amber-400 focus:outline-none text-white text-xs"
                    required
                  />
                </div>

                {payoutMethod === 'BANK' && (
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-white/80 mb-1">
                      Bank Name & Branch
                    </label>
                    <input
                      type="text"
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                      placeholder="e.g. City Bank, Dhaka Main Branch"
                      className="w-full px-3.5 py-2.5 rounded-xl glass-item border border-white/15 focus:border-amber-400 focus:outline-none text-white text-xs"
                      required
                    />
                  </div>
                )}
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-teal-500 hover:bg-teal-400 text-black font-semibold text-xs shadow transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Payout Account</span>
                </button>
              </div>
            </form>
          )}
        </GlassCard>
      )}
    </div>
  );
};
