import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MarketplaceItem } from '../../types';
import { GlassCard } from '../common/GlassCard';
import {
  Search,
  Filter,
  ShoppingBag,
  Star,
  Check,
  Shield,
  ArrowUpDown,
  X,
  ExternalLink,
  Clock,
  Sparkles,
  Wallet,
} from 'lucide-react';

export const MarketplaceView: React.FC = () => {
  const {
    marketplaceItems,
    currentUser,
    purchaseMarketplaceItem,
    orders,
    setCurrentPage,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'catalog' | 'orders'>('catalog');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'rating' | 'price-asc' | 'price-desc' | 'popular'>('popular');
  const [selectedItemForPurchase, setSelectedItemForPurchase] = useState<MarketplaceItem | null>(null);

  const categories = [
    { id: 'ALL', label: 'All Products' },
    { id: 'SECURITY', label: 'Security & Tokens' },
    { id: 'INFRASTRUCTURE', label: 'Cloud & Mesh' },
    { id: 'DEV_TOOLS', label: 'Developer APIs' },
    { id: 'TEMPLATES', label: 'Glass UI Kits' },
    { id: 'SERVICES', label: 'Sandboxes' },
  ];

  // Filter items
  const filteredItems = marketplaceItems
    .filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === 'ALL' || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      return b.salesCount - a.salesCount;
    });

  // User orders
  const userOrders = currentUser
    ? orders.filter((o) => o.userId === currentUser.id)
    : [];

  const handleBuyClick = (item: MarketplaceItem) => {
    setSelectedItemForPurchase(item);
  };

  const confirmPurchase = () => {
    if (!selectedItemForPurchase) return;
    const success = purchaseMarketplaceItem(selectedItemForPurchase.id);
    if (success) {
      setSelectedItemForPurchase(null);
    }
  };

  return (
    <div className="space-y-7 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-white">
            Tools1 Marketplace
          </h1>
          <p className="text-xs text-white/50 mt-1">
            Curated cryptographic hardware, secure infrastructure, and verified developer tokens.
          </p>
        </div>

        {/* Tab switch between Catalog and My Orders */}
        <div className="flex items-center p-1 rounded-full bg-white/5 border border-white/10 text-xs">
          <button
            onClick={() => setActiveTab('catalog')}
            className={`px-4 py-1.5 rounded-full transition-all font-semibold ${
              activeTab === 'catalog'
                ? 'bg-amber-500 text-black shadow'
                : 'text-white/60 hover:text-white'
            }`}
          >
            Product Catalog
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-1.5 rounded-full transition-all font-semibold ${
              activeTab === 'orders'
                ? 'bg-amber-500 text-black shadow'
                : 'text-white/60 hover:text-white'
            }`}
          >
            My Orders ({userOrders.length})
          </button>
        </div>
      </div>

      {activeTab === 'catalog' ? (
        <>
          {/* SEARCH & FILTERS BAR */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 items-center">
            {/* Search Input */}
            <div className="md:col-span-6 relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products, tokens, or cloud services..."
                className="w-full pl-10 pr-4 py-3 rounded-2xl glass-panel border border-white/15 focus:border-amber-400 focus:outline-none text-white text-xs sm:text-sm placeholder:text-white/30"
              />
              <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-3.5 pointer-events-none" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-3.5 text-white/40 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="md:col-span-6 flex items-center justify-end gap-2">
              <span className="text-xs text-white/50 hidden sm:inline">Sort:</span>
              <div className="flex items-center gap-1.5 p-1 rounded-2xl glass-panel border border-white/10 text-xs">
                <button
                  onClick={() => setSortBy('popular')}
                  className={`px-3 py-1.5 rounded-xl transition-colors ${
                    sortBy === 'popular'
                      ? 'bg-white/15 text-amber-300 font-semibold'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  Popular
                </button>
                <button
                  onClick={() => setSortBy('rating')}
                  className={`px-3 py-1.5 rounded-xl transition-colors ${
                    sortBy === 'rating'
                      ? 'bg-white/15 text-amber-300 font-semibold'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  Top Rated
                </button>
                <button
                  onClick={() => setSortBy(sortBy === 'price-asc' ? 'price-desc' : 'price-asc')}
                  className={`px-3 py-1.5 rounded-xl transition-colors flex items-center gap-1 ${
                    sortBy.includes('price')
                      ? 'bg-white/15 text-amber-300 font-semibold'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  <span>Price</span>
                  <ArrowUpDown className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>

          {/* CATEGORIES SEGMENTED TABS */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-white text-black shadow-lg scale-100'
                    : 'glass-panel text-white/70 hover:text-white hover:border-white/20'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* PRODUCT CARDS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="rounded-3xl glass-panel border border-white/15 overflow-hidden flex flex-col justify-between glass-card-hover group"
              >
                <div>
                  {/* Image / Thumbnail Container */}
                  <div className="relative h-48 w-full overflow-hidden bg-black/40">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-tr from-amber-950/40 via-stone-900/60 to-black/80">
                        <ShoppingBag className="w-12 h-12 text-amber-500/40" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0d0e15] via-transparent to-transparent" />

                    {/* Stock Status Badge */}
                    <div className="absolute top-3 left-3">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                          item.status === 'AVAILABLE'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}
                      >
                        {item.status.replace('_', ' ')}
                      </span>
                    </div>

                    {/* Rating badge */}
                    <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[11px] font-bold text-amber-400 border border-white/10">
                      <Star className="w-3 h-3 fill-amber-400" />
                      <span>{item.rating}</span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 space-y-3">
                    <h3 className="text-lg font-bold font-display text-white group-hover:text-amber-300 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs text-white/60 leading-relaxed line-clamp-2">
                      {item.description}
                    </p>

                    {/* Key features bullet points */}
                    <div className="space-y-1.5 pt-2">
                      {item.features.slice(0, 3).map((feat, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-[11px] text-white/70">
                          <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          <span className="truncate">{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer Price & Action */}
                <div className="p-6 pt-0 border-t border-white/10 mt-4 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-white/40 block">Price</span>
                    <span className="text-xl font-bold font-mono text-white tabular-nums">
                      ${item.price.toFixed(2)}
                    </span>
                  </div>

                  <button
                    onClick={() => handleBuyClick(item)}
                    disabled={item.status === 'OUT_OF_STOCK'}
                    className="px-5 py-2.5 rounded-full bg-white hover:bg-white/90 text-black font-semibold text-xs shadow-lg transition-all active:scale-95 disabled:opacity-50"
                  >
                    Purchase Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        /* MY ORDERS VIEW */
        <div className="space-y-4">
          {userOrders.length === 0 ? (
            <div className="p-12 text-center glass-panel rounded-3xl text-white/50 text-xs">
              You have not placed any marketplace orders yet.
            </div>
          ) : (
            userOrders.map((ord) => (
              <div
                key={ord.id}
                className="p-5 rounded-3xl glass-panel border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">{ord.itemTitle}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        ord.status === 'COMPLETED'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : ord.status === 'PROCESSING'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-white/10 text-white/70'
                      }`}
                    >
                      {ord.status}
                    </span>
                  </div>
                  <p className="text-xs text-white/50 font-mono">
                    Order ID: #{ord.id} · Date: {ord.createdAt.substring(0, 10)}
                  </p>
                  {ord.licenseKey && (
                    <div className="pt-2 flex items-center gap-2 text-xs">
                      <span className="text-white/40">Credential / Key:</span>
                      <code className="px-2 py-0.5 rounded bg-black/50 text-amber-300 font-mono text-xs border border-white/10">
                        {ord.licenseKey}
                      </code>
                    </div>
                  )}
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-1 shrink-0">
                  <span className="text-base font-bold font-mono text-white">
                    ${ord.price.toFixed(2)}
                  </span>
                  <span className="text-[10px] text-white/40">Server Cleared</span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* PURCHASE CONFIRMATION MODAL */}
      {selectedItemForPurchase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xl animate-in fade-in">
          <div className="relative w-full max-w-md rounded-3xl glass-panel border border-white/20 p-6 sm:p-7 shadow-2xl space-y-5">
            <button
              onClick={() => setSelectedItemForPurchase(null)}
              className="absolute top-5 right-5 text-white/50 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <h3 className="text-xl font-bold font-display text-white">Confirm Purchase</h3>
              <p className="text-xs text-white/60">
                You are about to authorize an instant balance debit for this item.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/70">{selectedItemForPurchase.title}</span>
                <span className="font-bold font-mono text-white">
                  ${selectedItemForPurchase.price.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-white/50 pt-2 border-t border-white/10">
                <span>Your Available Balance:</span>
                <span className="font-mono text-amber-300">
                  ${currentUser?.balance.toFixed(2) || '0.00'}
                </span>
              </div>
            </div>

            {currentUser && currentUser.balance < selectedItemForPurchase.price && (
              <div className="p-3 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs space-y-1">
                <p className="font-semibold">Insufficient funds!</p>
                <p>
                  You need ${(selectedItemForPurchase.price - currentUser.balance).toFixed(2)} more.
                </p>
                <button
                  onClick={() => {
                    setSelectedItemForPurchase(null);
                    setCurrentPage('balance');
                  }}
                  className="mt-1 text-xs text-white underline font-semibold"
                >
                  Go to Top-Up Desk →
                </button>
              </div>
            )}

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setSelectedItemForPurchase(null)}
                className="w-1/2 py-3 rounded-full glass-panel text-white text-xs font-semibold hover:bg-white/10"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmPurchase}
                disabled={!currentUser || currentUser.balance < selectedItemForPurchase.price}
                className="w-1/2 py-3 rounded-full bg-white text-black text-xs font-semibold hover:bg-white/90 shadow-xl disabled:opacity-40"
              >
                Confirm & Pay
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
