import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { LeftSidebarDrawer } from './LeftSidebarDrawer';
import { Tools1Logo } from './Tools1Logo';
import {
  Bell,
  Wallet,
  Menu,
  X,
  Shield,
  User as UserIcon,
  LogOut,
  ChevronDown,
  ChevronLeft,
  Sparkles,
  Palette,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    currentUser,
    currentRole,
    currentPage,
    setCurrentPage,
    switchRole,
    logout,
    notifications,
    markAllNotificationsAsRead,
    activeTheme,
    setActiveTheme,
  } = useApp();

  const [leftSidebarOpen, setLeftSidebarOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const isHomePage = currentPage === 'dashboard' || currentPage === 'landing';

  // Anywhere other than the homepage, TOTALLY do not render Navbar at all
  if (!isHomePage) {
    return null;
  }

  const navLinks = [
    { label: 'Dashboard', page: 'dashboard' as const, reqAuth: true },
    { label: 'Marketplace', page: 'marketplace' as const },
    { label: 'Balance & Baki', page: 'balance' as const, reqAuth: true },
    { label: 'Groups', page: 'groups' as const, reqAuth: true },
    { label: 'Community & Members', page: 'chat' as const, reqAuth: true },
    { label: 'Tools', page: 'tools' as const },
  ];

  return (
    <>
      {/* Slide-out Left Sidebar Drawer */}
      <LeftSidebarDrawer
        isOpen={leftSidebarOpen}
        onClose={() => setLeftSidebarOpen(false)}
      />

      <header className="sticky top-0 z-40 w-full glass-panel-subtle border-b border-white/10 backdrop-blur-2xl transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Zone 1: Left 3-Line Menu Button + Brand Wordmark */}
          <div className="flex items-center gap-3">
            {/* Left 3-Line Hamburger Menu Button (Available on Homepage) */}
            <button
              onClick={() => setLeftSidebarOpen(true)}
              className="p-2 -ml-1 sm:ml-0 rounded-2xl glass-item hover:bg-white/15 text-white transition-all flex items-center justify-center border border-white/20 shadow-md active:scale-95 group"
              title="Open Left 3-Line Menu"
              aria-label="Open Left Navigation Menu"
            >
              <div className="w-5 h-3.5 flex flex-col justify-between items-start">
                <span className="w-5 h-0.5 bg-white rounded-full group-hover:bg-amber-400 transition-colors" />
                <span className="w-3.5 h-0.5 bg-white rounded-full group-hover:bg-amber-400 transition-colors" />
                <span className="w-5 h-0.5 bg-white rounded-full group-hover:bg-amber-400 transition-colors" />
              </div>
            </button>

            <button
              onClick={() => setCurrentPage(currentUser ? 'dashboard' : 'landing')}
              className="flex items-center text-left py-1"
            >
              <Tools1Logo size="md" showUnderline={true} />
            </button>

            {/* Role switch toggle pill */}
            <div className="hidden sm:flex items-center ml-2 p-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium">
              <button
                onClick={() => switchRole('USER')}
                className={`px-2.5 py-0.5 rounded-full transition-all ${
                  currentRole === 'USER'
                    ? 'bg-amber-500 text-black font-semibold shadow'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                User
              </button>
              <button
                onClick={() => switchRole('ADMIN')}
                className={`px-2.5 py-0.5 rounded-full transition-all ${
                  currentRole === 'ADMIN'
                    ? 'bg-amber-500 text-black font-semibold shadow'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                Admin
              </button>
            </div>

            {/* Theme switcher dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setThemeDropdownOpen(!themeDropdownOpen);
                  setProfileDropdownOpen(false);
                  setNotifDropdownOpen(false);
                }}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full glass-item hover:bg-white/15 text-xs text-white/80 transition-all border border-white/15 ml-1"
                title="Change Ambient Theme"
              >
                <Palette className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline font-medium text-[11px]">
                  {activeTheme === 'nordic'
                    ? 'Nordic Lake'
                    : activeTheme === 'botanical'
                    ? 'Flora Bokeh'
                    : activeTheme === 'sunset'
                    ? 'Sunset'
                    : activeTheme === 'cyber_s'
                    ? 'Cyber S'
                    : activeTheme === 'crimson_edge'
                    ? 'Crimson Edge'
                    : 'Eclipse Violet'}
                </span>
                <ChevronDown className="w-3 h-3 text-white/50" />
              </button>

              {themeDropdownOpen && (
                <div className="absolute left-0 mt-2 w-56 rounded-2xl glass-panel p-2 shadow-2xl z-50 animate-in fade-in space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-white/40 px-2.5 block py-1">
                    Select Glass Theme
                  </span>
                  <button
                    onClick={() => {
                      setActiveTheme('nordic');
                      setThemeDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors ${
                      activeTheme === 'nordic'
                        ? 'bg-amber-500 text-black shadow'
                        : 'text-white/80 hover:bg-white/10'
                    }`}
                  >
                    <span>🏞️ Nordic Lake & Pier</span>
                    {activeTheme === 'nordic' && <span className="text-[10px] font-bold">Active</span>}
                  </button>

                  <button
                    onClick={() => {
                      setActiveTheme('botanical');
                      setThemeDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors ${
                      activeTheme === 'botanical'
                        ? 'bg-amber-500 text-black shadow'
                        : 'text-white/80 hover:bg-white/10'
                    }`}
                  >
                    <span>🌺 Botanical Flora Bokeh</span>
                    {activeTheme === 'botanical' && <span className="text-[10px] font-bold">Active</span>}
                  </button>

                  <button
                    onClick={() => {
                      setActiveTheme('sunset');
                      setThemeDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors ${
                      activeTheme === 'sunset'
                        ? 'bg-amber-500 text-black shadow'
                        : 'text-white/80 hover:bg-white/10'
                    }`}
                  >
                    <span>🌅 Dusk Sunset Horizon</span>
                    {activeTheme === 'sunset' && <span className="text-[10px] font-bold">Active</span>}
                  </button>

                  <button
                    onClick={() => {
                      setActiveTheme('cyber_s');
                      setThemeDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors ${
                      activeTheme === 'cyber_s'
                        ? 'bg-amber-500 text-black shadow'
                        : 'text-white/80 hover:bg-white/10'
                    }`}
                  >
                    <span>⚡ Cyber S Curve</span>
                    {activeTheme === 'cyber_s' && <span className="text-[10px] font-bold">Active</span>}
                  </button>

                  <button
                    onClick={() => {
                      setActiveTheme('crimson_edge');
                      setThemeDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors ${
                      activeTheme === 'crimson_edge'
                        ? 'bg-amber-500 text-black shadow'
                        : 'text-white/80 hover:bg-white/10'
                    }`}
                  >
                    <span>🔥 Crimson Edge Blade</span>
                    {activeTheme === 'crimson_edge' && <span className="text-[10px] font-bold">Active</span>}
                  </button>

                  <button
                    onClick={() => {
                      setActiveTheme('eclipse_violet');
                      setThemeDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors ${
                      activeTheme === 'eclipse_violet'
                        ? 'bg-amber-500 text-black shadow'
                        : 'text-white/80 hover:bg-white/10'
                    }`}
                  >
                    <span>🌌 Eclipse Violet Sphere</span>
                    {activeTheme === 'eclipse_violet' && <span className="text-[10px] font-bold">Active</span>}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Zone 2: Navigation Links (4-6 links) */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-white/70">
            {navLinks.map((link) => {
              if (link.reqAuth && !currentUser) return null;
              const isActive = currentPage === link.page;
              return (
                <button
                  key={link.page}
                  onClick={() => setCurrentPage(link.page)}
                  className={`transition-colors py-1 ${
                    isActive
                      ? 'text-amber-400 border-b-2 border-amber-400 font-semibold'
                      : 'hover:text-white'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
            {currentRole === 'ADMIN' && (
              <button
                onClick={() => setCurrentPage('admin')}
                className={`flex items-center gap-1.5 transition-colors py-1 ${
                  (currentPage as string) === 'admin'
                    ? 'text-amber-400 border-b-2 border-amber-400 font-semibold'
                    : 'text-amber-300 hover:text-amber-200'
                }`}
              >
                <Shield className="w-3.5 h-3.5" />
                Admin Panel
              </button>
            )}
          </nav>

          {/* Zone 3: Primary Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {currentUser ? (
              <>
                {/* Balance Pill Button */}
                <button
                  onClick={() => setCurrentPage('balance')}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-2xl glass-pill hover:bg-white/10 transition-all text-xs sm:text-sm font-medium border border-amber-500/30"
                  title="View balance & top up"
                >
                  <Wallet className="w-4 h-4 text-amber-400" />
                  <span className="font-mono tabular-nums text-white font-semibold">
                    ${currentUser.balance.toFixed(2)}
                  </span>
                  {currentUser.pendingBalance > 0 && (
                    <span className="hidden sm:inline-block px-1.5 py-0.2 text-[10px] font-mono text-amber-300 bg-amber-500/20 rounded">
                      +${currentUser.pendingBalance.toFixed(0)} baki
                    </span>
                  )}
                </button>

                {/* Notifications Bell */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setNotifDropdownOpen(!notifDropdownOpen);
                      setProfileDropdownOpen(false);
                    }}
                    className="p-2 rounded-2xl glass-item relative text-white/80 hover:text-white"
                    aria-label="Notifications"
                  >
                    <Bell className="w-4 h-4" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 text-black text-[10px] font-bold flex items-center justify-center animate-pulse">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Notifications Dropdown */}
                  {notifDropdownOpen && (
                    <div className="absolute right-0 mt-3 w-80 rounded-2xl glass-panel p-4 shadow-2xl z-50 animate-in fade-in">
                      <div className="flex items-center justify-between pb-2 border-b border-white/10">
                        <span className="text-xs font-semibold text-white">Notifications</span>
                        {unreadCount > 0 && (
                          <button
                            onClick={markAllNotificationsAsRead}
                            className="text-[11px] text-amber-400 hover:underline"
                          >
                            Mark all read
                          </button>
                        )}
                      </div>
                      <div className="mt-3 space-y-2 max-h-72 overflow-y-auto">
                        {notifications.map((n) => (
                          <div
                            key={n.id}
                            className={`p-2.5 rounded-xl transition-colors ${
                              n.read ? 'bg-white/5' : 'bg-amber-500/10 border border-amber-500/20'
                            }`}
                          >
                            <p className="text-xs font-semibold text-white">{n.title}</p>
                            <p className="text-[11px] text-white/70 mt-0.5">{n.message}</p>
                            <span className="text-[9px] text-white/40 mt-1 block">{n.createdAt}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* User Profile Trigger */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setProfileDropdownOpen(!profileDropdownOpen);
                      setNotifDropdownOpen(false);
                    }}
                    className="flex items-center gap-2 p-1 pl-2 rounded-2xl glass-item hover:bg-white/10 transition-colors"
                  >
                    <span className="text-xs font-medium text-white/90 hidden md:inline">
                      {currentUser.username}
                    </span>
                    <div className="w-8 h-8 rounded-xl overflow-hidden bg-white/10 flex items-center justify-center border border-white/20">
                      {currentUser.avatarUrl ? (
                        <img
                          src={currentUser.avatarUrl}
                          alt={currentUser.username}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <UserIcon className="w-4 h-4 text-white/70" />
                      )}
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-white/50 hidden sm:block" />
                  </button>

                  {/* Profile Dropdown */}
                  {profileDropdownOpen && (
                    <div className="absolute right-0 mt-3 w-56 rounded-2xl glass-panel p-2 shadow-2xl z-50">
                      <div className="px-3 py-2 border-b border-white/10">
                        <p className="text-xs font-bold text-white truncate">{currentUser.username}</p>
                        <p className="text-[11px] text-white/50 truncate">{currentUser.email}</p>
                      </div>
                      <div className="py-1">
                        <button
                          onClick={() => {
                            setCurrentPage('profile');
                            setProfileDropdownOpen(false);
                          }}
                          className="w-full text-left px-3 py-2 text-xs text-white/80 hover:bg-white/10 rounded-xl transition-colors"
                        >
                          My Profile
                        </button>
                        <button
                          onClick={() => {
                            setCurrentPage('settings');
                            setProfileDropdownOpen(false);
                          }}
                          className="w-full text-left px-3 py-2 text-xs text-white/80 hover:bg-white/10 rounded-xl transition-colors"
                        >
                          Account Settings
                        </button>
                        {currentRole === 'ADMIN' && (
                          <button
                            onClick={() => {
                              setCurrentPage('admin');
                              setProfileDropdownOpen(false);
                            }}
                            className="w-full text-left px-3 py-2 text-xs text-amber-400 hover:bg-amber-400/10 rounded-xl transition-colors flex items-center justify-between"
                          >
                            <span>Admin Center</span>
                            <Shield className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                      <div className="pt-1 border-t border-white/10">
                        <button
                          onClick={() => {
                            setProfileDropdownOpen(false);
                            logout();
                          }}
                          className="w-full text-left px-3 py-2 text-xs text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors flex items-center gap-2"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage('login')}
                  className="px-3 py-1.5 text-xs font-semibold text-white/80 hover:text-white transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={() => setCurrentPage('register')}
                  className="px-4 py-2 text-xs font-semibold text-black bg-white hover:bg-white/90 rounded-2xl shadow transition-all active:scale-95"
                >
                  Create Account
                </button>
              </div>
            )}

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-2xl glass-item text-white/80"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-30 bg-black/70 backdrop-blur-xl flex flex-col pt-20 px-6 pb-24 overflow-y-auto animate-in fade-in">
          <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
            <span className="text-xs uppercase tracking-wider text-white/40 font-semibold">Navigation</span>
            {/* Quick role toggle on mobile */}
            <div className="flex items-center p-1 rounded-full bg-white/5 border border-white/10 text-xs">
              <button
                onClick={() => switchRole('USER')}
                className={`px-3 py-0.5 rounded-full ${
                  currentRole === 'USER' ? 'bg-amber-500 text-black font-semibold' : 'text-white/60'
                }`}
              >
                User
              </button>
              <button
                onClick={() => switchRole('ADMIN')}
                className={`px-3 py-0.5 rounded-full ${
                  currentRole === 'ADMIN' ? 'bg-amber-500 text-black font-semibold' : 'text-white/60'
                }`}
              >
                Admin
              </button>
            </div>
          </div>

          <div className="space-y-2">
            {navLinks.map((link) => (
              <button
                key={link.page}
                onClick={() => {
                  setCurrentPage(link.page);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-4 py-3 rounded-2xl text-sm font-medium transition-colors flex items-center justify-between ${
                  currentPage === link.page
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : 'text-white/80 hover:bg-white/5'
                }`}
              >
                <span>{link.label}</span>
              </button>
            ))}
            {currentRole === 'ADMIN' && (
              <button
                onClick={() => {
                  setCurrentPage('admin');
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-4 py-3 rounded-2xl text-sm font-semibold text-amber-300 bg-amber-500/15 border border-amber-500/30 flex items-center justify-between"
              >
                <span>Admin Control Panel</span>
                <Shield className="w-4 h-4 text-amber-400" />
              </button>
            )}
          </div>

          {currentUser ? (
            <div className="mt-8 pt-6 border-t border-white/10 space-y-2">
              <button
                onClick={() => {
                  setCurrentPage('profile');
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-4 py-3 rounded-2xl text-sm text-white/80 hover:bg-white/5"
              >
                My Profile
              </button>
              <button
                onClick={() => {
                  setCurrentPage('settings');
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-4 py-3 rounded-2xl text-sm text-white/80 hover:bg-white/5"
              >
                Settings
              </button>
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-4 py-3 rounded-2xl text-sm text-rose-400 hover:bg-rose-500/10 flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out</span>
              </button>
            </div>
          ) : (
            <div className="mt-8 pt-6 border-t border-white/10 flex flex-col gap-3">
              <button
                onClick={() => {
                  setCurrentPage('login');
                  setMobileMenuOpen(false);
                }}
                className="w-full py-3 rounded-2xl glass-pill text-sm font-semibold text-white text-center"
              >
                Sign In
              </button>
              <button
                onClick={() => {
                  setCurrentPage('register');
                  setMobileMenuOpen(false);
                }}
                className="w-full py-3 rounded-2xl bg-white text-black text-sm font-semibold text-center"
              >
                Create Account
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
};
