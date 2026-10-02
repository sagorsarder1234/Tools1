import React from 'react';
import { useApp } from '../../context/AppContext';
import { LayoutDashboard, ShoppingBag, Wallet, Wrench, MessageSquare, Shield } from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const { currentPage, setCurrentPage, currentRole, currentUser } = useApp();

  // If on landing or not logged in, we can still show quick nav or omit
  if (!currentUser && currentPage === 'landing') return null;

  const items = [
    { label: 'Home', page: 'dashboard' as const, icon: LayoutDashboard },
    { label: 'Market', page: 'marketplace' as const, icon: ShoppingBag },
    { label: 'Balance', page: 'balance' as const, icon: Wallet },
    { label: 'Tools', page: 'tools' as const, icon: Wrench },
    {
      label: currentRole === 'ADMIN' ? 'Admin' : 'Community',
      page: (currentRole === 'ADMIN' ? 'admin' : 'chat') as any,
      icon: currentRole === 'ADMIN' ? Shield : MessageSquare,
    },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0c0d14]/90 backdrop-blur-2xl border-t border-white/10 px-2 py-1.5 pb-safe shadow-2xl">
      <div className="grid grid-cols-5 items-center justify-around">
        {items.map((item) => {
          const isActive = currentPage === item.page;
          const Icon = item.icon;
          return (
            <button
              key={item.label}
              onClick={() => setCurrentPage(item.page)}
              className="flex flex-col items-center justify-center min-h-[46px] py-1 transition-all active:scale-90"
            >
              <div
                className={`p-1 rounded-xl transition-colors ${
                  isActive
                    ? 'text-amber-400 bg-amber-400/15'
                    : 'text-white/50 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span
                className={`text-[10px] font-medium tracking-tight mt-0.5 truncate ${
                  isActive ? 'text-amber-400 font-semibold' : 'text-white/50'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
