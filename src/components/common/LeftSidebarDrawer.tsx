import React, { useState } from 'react';
import { useApp, ToolId } from '../../context/AppContext';
import { Tools1Logo } from './Tools1Logo';
import {
  Home,
  ShoppingBag,
  Wallet,
  Wrench,
  MessageSquare,
  User as UserIcon,
  Shield,
  X,
  ChevronRight,
  ChevronDown,
  Globe,
  FileCheck,
  CopyCheck,
  Mail,
  BookMarked,
  Sparkles,
  Lock,
  KeyRound,
  LogOut,
  Palette,
  CheckCircle2,
} from 'lucide-react';

interface LeftSidebarDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LeftSidebarDrawer: React.FC<LeftSidebarDrawerProps> = ({ isOpen, onClose }) => {
  const {
    currentUser,
    currentRole,
    currentPage,
    setCurrentPage,
    setActiveToolId,
    activeToolId,
    activeTheme,
    setActiveTheme,
    switchRole,
    logout,
  } = useApp();

  const [toolsExpanded, setToolsExpanded] = useState<boolean>(true);

  if (!isOpen) return null;

  // The 8 specific tools requested by the user
  const requestedTools: Array<{ id: ToolId; name: string; icon: React.ComponentType<{ className?: string }> }> = [
    { id: 'ip-checker', name: 'IP Checker', icon: Globe },
    { id: 'report-checker', name: 'Report Checker', icon: FileCheck },
    { id: 'duplicate-checker', name: 'Duplicated Checker', icon: CopyCheck },
    { id: 'email-organizer', name: 'Email Organizer', icon: Mail },
    { id: 'name-store', name: 'Name Store', icon: BookMarked },
    { id: 'name-generator', name: 'Name & Email Generator', icon: Sparkles },
    { id: 'password-generator', name: 'Password Generator', icon: Lock },
    { id: 'totp', name: '2FA Key', icon: KeyRound },
  ];

  const handleNavClick = (page: typeof currentPage, toolId?: ToolId) => {
    setCurrentPage(page, toolId);
    onClose();
  };

  const handleToolClick = (toolId: ToolId) => {
    setActiveToolId(toolId);
    setCurrentPage('tools', toolId);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Dark Translucent Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-md transition-opacity animate-in fade-in"
      />

      {/* Slide-out Left Drawer with High Transparency Glass */}
      <div className="relative w-84 max-w-[85vw] h-full glass-panel border-r border-white/20 shadow-2xl z-50 flex flex-col justify-between overflow-y-auto backdrop-blur-3xl animate-in slide-in-from-left duration-300">
        {/* Top Specular Line */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent pointer-events-none" />

        {/* Drawer Header & Profile Card */}
        <div className="p-5 space-y-4 border-b border-white/10">
          <div className="flex items-center justify-between">
            <Tools1Logo size="sm" showUnderline={true} />

            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-colors"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Profile Quick Widget */}
          {currentUser ? (
            <div
              onClick={() => handleNavClick('profile')}
              className="p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/15 cursor-pointer transition-all space-y-2 group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl overflow-hidden glass-panel border border-white/25 p-0.5 shrink-0">
                  {currentUser.avatarUrl ? (
                    <img
                      src={currentUser.avatarUrl}
                      alt={currentUser.username}
                      className="w-full h-full object-cover rounded-lg"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-full bg-amber-500 rounded-lg flex items-center justify-center text-black font-bold text-sm">
                      {currentUser.username[0].toUpperCase()}
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-sm text-white group-hover:text-amber-300 transition-colors truncate">
                      {currentUser.username}
                    </p>
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      {currentUser.role}
                    </span>
                  </div>
                  <p className="text-[11px] text-white/50 truncate font-mono">{currentUser.email}</p>
                </div>
              </div>

              {/* Balance Quick Strip */}
              <div className="flex items-center justify-between pt-1 border-t border-white/5 text-[11px]">
                <span className="text-white/60">Balance:</span>
                <span className="font-mono font-bold text-amber-300">${currentUser.balance.toFixed(2)}</span>
              </div>
            </div>
          ) : (
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
              <span className="text-xs text-white/70">Welcome Guest</span>
              <button
                onClick={() => handleNavClick('login')}
                className="px-3 py-1 rounded-full bg-white text-black text-xs font-semibold hover:bg-white/90"
              >
                Sign In
              </button>
            </div>
          )}
        </div>

        {/* Primary Navigation List (Home, Market, Balance, Tools, Chat, Profile) */}
        <div className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          {/* Home */}
          <button
            onClick={() => handleNavClick(currentUser ? 'dashboard' : 'landing')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all ${
              currentPage === 'dashboard' || currentPage === 'landing'
                ? 'bg-amber-500 text-black shadow-lg font-bold'
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            <Home className="w-4 h-4" />
            <span>Home</span>
          </button>

          {/* Market */}
          <button
            onClick={() => handleNavClick('marketplace')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all ${
              currentPage === 'marketplace'
                ? 'bg-amber-500 text-black shadow-lg font-bold'
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Market</span>
          </button>

          {/* Balance */}
          <button
            onClick={() => handleNavClick('balance')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all ${
              currentPage === 'balance' || currentPage === 'baki'
                ? 'bg-amber-500 text-black shadow-lg font-bold'
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            <div className="flex items-center gap-3">
              <Wallet className="w-4 h-4" />
              <span>Balance</span>
            </div>
            {currentUser && currentUser.pendingBalance > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-amber-400 text-black">
                Baki
              </span>
            )}
          </button>

          {/* Tools with Submenu Accordion */}
          <div className="space-y-1">
            <button
              onClick={() => setToolsExpanded(!toolsExpanded)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all ${
                currentPage === 'tools'
                  ? 'bg-white/15 text-white font-bold border border-white/20'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  handleNavClick('tools');
                }}
                className="flex items-center gap-3 flex-1 text-left"
              >
                <Wrench className="w-4 h-4" />
                <span>Tools (8)</span>
              </div>
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${
                  toolsExpanded ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* Expanded List of 8 Tools */}
            {toolsExpanded && (
              <div className="pl-6 pr-1 py-1 space-y-1 animate-in fade-in">
                {requestedTools.map((tool) => {
                  const ToolIcon = tool.icon;
                  const isActive = currentPage === 'tools' && activeToolId === tool.id;
                  return (
                    <button
                      key={tool.id}
                      onClick={() => handleToolClick(tool.id)}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[11px] font-medium transition-all ${
                        isActive
                          ? 'bg-amber-400 text-black font-bold shadow'
                          : 'text-white/70 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <ToolIcon className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{tool.name}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Community & Members */}
          <button
            onClick={() => handleNavClick('chat')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all ${
              currentPage === 'chat'
                ? 'bg-amber-500 text-black shadow-lg font-bold'
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Community & Members</span>
          </button>

          {/* Profile */}
          <button
            onClick={() => handleNavClick('profile')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all ${
              currentPage === 'profile'
                ? 'bg-amber-500 text-black shadow-lg font-bold'
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            <UserIcon className="w-4 h-4" />
            <span>Profile</span>
          </button>

          {/* Admin Command Console */}
          {currentRole === 'ADMIN' && (
            <button
              onClick={() => handleNavClick('admin')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all ${
                currentPage === 'admin'
                  ? 'bg-amber-500 text-black shadow-lg font-bold'
                  : 'text-amber-300 hover:text-amber-200 hover:bg-amber-500/10 border border-amber-500/20'
              }`}
            >
              <Shield className="w-4 h-4" />
              <span>Admin Center</span>
            </button>
          )}
        </div>

        {/* Drawer Footer Controls */}
        <div className="p-4 space-y-3 border-t border-white/10 bg-black/20">
          {/* Theme Switcher in Drawer */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-mono uppercase tracking-wider text-white/40 block">
              Glass Theme
            </span>
            <div className="grid grid-cols-3 gap-1">
              <button
                onClick={() => setActiveTheme('nordic')}
                className={`py-1.5 px-2 rounded-xl text-[10px] font-semibold text-center truncate transition-all ${
                  activeTheme === 'nordic'
                    ? 'bg-amber-400 text-black font-bold shadow'
                    : 'glass-item text-white/70 hover:text-white'
                }`}
              >
                🏞️ Nordic
              </button>
              <button
                onClick={() => setActiveTheme('botanical')}
                className={`py-1.5 px-2 rounded-xl text-[10px] font-semibold text-center truncate transition-all ${
                  activeTheme === 'botanical'
                    ? 'bg-amber-400 text-black font-bold shadow'
                    : 'glass-item text-white/70 hover:text-white'
                }`}
              >
                🌺 Flora
              </button>
              <button
                onClick={() => setActiveTheme('sunset')}
                className={`py-1.5 px-2 rounded-xl text-[10px] font-semibold text-center truncate transition-all ${
                  activeTheme === 'sunset'
                    ? 'bg-amber-400 text-black font-bold shadow'
                    : 'glass-item text-white/70 hover:text-white'
                }`}
              >
                🌅 Sunset
              </button>
            </div>
          </div>

          {/* Role Toggle Switch */}
          <div className="flex items-center justify-between p-1.5 rounded-2xl glass-panel-subtle border border-white/10 text-xs">
            <span className="text-white/60 text-[11px] pl-1">Role:</span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => switchRole('USER')}
                className={`px-2 py-0.5 rounded-xl text-[10px] font-semibold transition-all ${
                  currentRole === 'USER' ? 'bg-amber-400 text-black' : 'text-white/50'
                }`}
              >
                User
              </button>
              <button
                onClick={() => switchRole('ADMIN')}
                className={`px-2 py-0.5 rounded-xl text-[10px] font-semibold transition-all ${
                  currentRole === 'ADMIN' ? 'bg-amber-400 text-black' : 'text-white/50'
                }`}
              >
                Admin
              </button>
            </div>
          </div>

          {/* Logout */}
          {currentUser && (
            <button
              onClick={() => {
                logout();
                onClose();
              }}
              className="w-full py-2 rounded-xl text-xs text-rose-400 hover:bg-rose-500/10 flex items-center justify-center gap-1.5 font-medium transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
