import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/common/Navbar';
import { ToastContainer } from './components/common/ToastContainer';
import { TLogoLoader } from './components/common/TLogoLoader';

import { LandingPage } from './components/landing/LandingPage';
import { LoginPage } from './components/auth/LoginPage';
import { RegisterPage } from './components/auth/RegisterPage';
import { UserDashboard } from './components/dashboard/UserDashboard';
import { MarketplaceView } from './components/marketplace/MarketplaceView';
import { BalanceView } from './components/balance/BalanceView';
import { BakiPendingView } from './components/baki/BakiPendingView';
import { GroupsView } from './components/groups/GroupsView';
import { ChatView } from './components/chat/ChatView';
import { ToolsHub } from './components/tools/ToolsHub';
import { ProfileView } from './components/profile/ProfileView';
import { SettingsView } from './components/settings/SettingsView';
import { AdminLayout } from './components/admin/AdminLayout';
import { ShieldAlert, X } from 'lucide-react';

const AppContent: React.FC = () => {
  const {
    currentPage,
    currentRole,
    isLoading,
    setCurrentPage,
    activeTheme,
    currentUser,
    activeToolId,
    setActiveToolId,
  } = useApp();

  const isHomePage = currentPage === 'dashboard' || currentPage === 'landing';

  const handleBack = () => {
    if (activeToolId) {
      setActiveToolId(null);
    } else {
      setCurrentPage(currentUser ? 'dashboard' : 'landing');
    }
  };

  const themeAssets = {
    nordic: {
      desktop: '/src/assets/images/nordic_lake_granite_desktop_1790870586674.jpg',
      mobile: '/src/assets/images/nordic_lake_granite_mobile_1790870602614.jpg',
      alt: 'Misty Alpine Lake & Granite Shoreline',
      glow1: 'bg-amber-500/20',
      glow2: 'bg-cyan-600/15',
    },
    botanical: {
      desktop: '/src/assets/images/nature_flora_amber_desktop_1790869305725.jpg',
      mobile: '/src/assets/images/nature_flora_amber_mobile_1790869319493.jpg',
      alt: 'Lush Botanical Bokeh & Orange Tulips',
      glow1: 'bg-amber-500/25',
      glow2: 'bg-emerald-500/20',
    },
    sunset: {
      desktop: '/src/assets/images/tenex_ambient_sunset_1790868072264.jpg',
      mobile: '/src/assets/images/tenex_ambient_sunset_1790868072264.jpg',
      alt: 'Dusk Sunset Horizon Atmosphere',
      glow1: 'bg-orange-500/25',
      glow2: 'bg-amber-600/20',
    },
    cyber_s: {
      desktop: '/src/assets/images/theme_cyber_s_desktop.svg',
      mobile: '/src/assets/images/theme_cyber_s_mobile.svg',
      alt: 'Minimalist Cyber S Curve Dark Theme',
      glow1: 'bg-indigo-600/20',
      glow2: 'bg-blue-600/15',
    },
    crimson_edge: {
      desktop: '/src/assets/images/theme_crimson_edge_desktop.svg',
      mobile: '/src/assets/images/theme_crimson_edge_mobile.svg',
      alt: 'Crimson Red Ribbon Blade Dark Theme',
      glow1: 'bg-red-600/25',
      glow2: 'bg-rose-700/20',
    },
    eclipse_violet: {
      desktop: '/src/assets/images/theme_eclipse_violet_desktop.svg',
      mobile: '/src/assets/images/theme_eclipse_violet_mobile.svg',
      alt: 'Eclipse Cosmic S Violet Dark Theme',
      glow1: 'bg-purple-600/20',
      glow2: 'bg-violet-700/15',
    },
  };

  const currentTheme = themeAssets[activeTheme] || themeAssets.nordic;

  return (
    <div className="relative min-h-screen bg-[#07080c] text-white selection:bg-amber-500/30 selection:text-amber-200">
      {/* Unique Animated T Logo Loading Screen */}
      {isLoading && <TLogoLoader fullScreen size="lg" />}

      {/* Global Dynamic Cinematic Backdrop */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <picture key={activeTheme}>
          <source media="(max-width: 768px)" srcSet={currentTheme.mobile} />
          <img
            src={currentTheme.desktop}
            alt={currentTheme.alt}
            className="w-full h-full object-cover object-center fixed inset-0 scale-105 transition-opacity duration-700 opacity-100"
            referrerPolicy="no-referrer"
          />
        </picture>
        {/* Ultra-sheer backdrop scrim allowing pure background sunset illumination */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/20" />
        
        {/* Soft atmospheric ambient glow orbs */}
        <div className={`absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full ${currentTheme.glow1} blur-[140px] animate-ambient-glow`} />
        <div className={`absolute bottom-1/4 right-1/4 w-[450px] h-[450px] rounded-full ${currentTheme.glow2} blur-[140px] animate-ambient-glow`} />
      </div>

      {/* Top Header Navbar (Only renders on homepage) */}
      <Navbar />

      {/* Round cross button on the right side - absolute positioning so it scrolls with page instead of staying fixed on display */}
      {!isHomePage && (
        <button
          onClick={handleBack}
          className="absolute top-4 right-4 sm:top-6 sm:right-6 z-30 w-11 h-11 rounded-full glass-panel border border-white/25 hover:border-amber-400/80 bg-[#0a0b12]/80 hover:bg-white/15 text-white/90 hover:text-white flex items-center justify-center shadow-xl shadow-black/40 backdrop-blur-2xl transition-all duration-200 active:scale-90 group cursor-pointer"
          title="Back / Close"
          aria-label="Back / Close"
        >
          <X className="w-5 h-5 text-white/90 group-hover:text-amber-300 transition-colors stroke-[2.2]" />
        </button>
      )}

      {/* Main Page Routing Container */}
      <main
        className={`relative z-10 ${
          currentPage === 'chat'
            ? 'w-full h-[calc(100vh-4.25rem)] p-0 m-0 overflow-hidden'
            : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 min-h-[calc(100vh-4rem)]'
        }`}
      >
        {currentPage === 'landing' && <LandingPage />}
        {currentPage === 'login' && <LoginPage />}
        {currentPage === 'register' && <RegisterPage />}
        {currentPage === 'dashboard' && <UserDashboard />}
        {currentPage === 'marketplace' && <MarketplaceView />}
        {currentPage === 'balance' && <BalanceView />}
        {currentPage === 'baki' && <BakiPendingView />}
        {currentPage === 'groups' && <GroupsView />}
        {currentPage === 'chat' && <ChatView />}
        {currentPage === 'tools' && <ToolsHub />}
        {currentPage === 'profile' && <ProfileView />}
        {currentPage === 'settings' && <SettingsView />}
        {currentPage === 'admin' && (
          currentRole === 'ADMIN' ? (
            <AdminLayout />
          ) : (
            <div className="p-12 text-center glass-panel rounded-3xl max-w-md mx-auto my-12 space-y-4">
              <ShieldAlert className="w-12 h-12 text-rose-400 mx-auto" />
              <h2 className="text-xl font-bold text-white">Administrative Access Required</h2>
              <p className="text-xs text-white/60">
                You are currently viewing in User mode. Switch to Admin via the top role toggle to access the operations console.
              </p>
              <button
                onClick={() => setCurrentPage('dashboard')}
                className="px-5 py-2.5 rounded-full bg-white text-black text-xs font-semibold hover:bg-white/90 shadow"
              >
                Return to Dashboard
              </button>
            </div>
          )
        )}
      </main>

      {/* Floating Toast Notification Stack */}
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
