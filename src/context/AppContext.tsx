import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  User,
  UserRole,
  Transaction,
  TopupRequest,
  MarketplaceItem,
  Order,
  Group,
  ChatMessage,
  AuditLog,
  NotificationItem,
  AppSetting,
} from '../types';

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

export type PageRoute =
  | 'landing'
  | 'login'
  | 'register'
  | 'dashboard'
  | 'marketplace'
  | 'balance'
  | 'baki'
  | 'groups'
  | 'chat'
  | 'tools'
  | 'profile'
  | 'settings'
  | 'admin';

export type ToolId =
  | 'ip-checker'
  | 'report-checker'
  | 'email-organizer'
  | 'duplicate-checker'
  | 'name-store'
  | 'name-generator'
  | 'email-generator'
  | 'password-generator'
  | 'totp';

export type AdminTab =
  | 'dashboard'
  | 'users'
  | 'marketplace'
  | 'orders'
  | 'payments'
  | 'baki'
  | 'groups'
  | 'moderation'
  | 'tools'
  | 'reports'
  | 'notifications'
  | 'settings'
  | 'audit-logs';

export type ThemeMode = 'nordic' | 'botanical' | 'sunset' | 'cyber_s' | 'crimson_edge' | 'eclipse_violet';

interface AppContextType {
  currentUser: User | null;
  users: User[];
  currentRole: UserRole;
  currentPage: PageRoute;
  activeTheme: ThemeMode;
  activeToolId: ToolId | null;
  activeAdminTab: AdminTab;
  activeChatGroupId: string | null;
  activeChatRecipientId: string | null;
  isLoading: boolean;
  toasts: ToastMessage[];
  transactions: Transaction[];
  topupRequests: TopupRequest[];
  marketplaceItems: MarketplaceItem[];
  orders: Order[];
  groups: Group[];
  messages: ChatMessage[];
  notifications: NotificationItem[];
  auditLogs: AuditLog[];
  settings: AppSetting;

  // Actions
  setActiveTheme: (theme: ThemeMode) => void;
  setCurrentPage: (page: PageRoute, toolId?: ToolId) => void;
  setActiveToolId: (toolId: ToolId | null) => void;
  setActiveAdminTab: (tab: AdminTab) => void;
  setActiveChatGroupId: (groupId: string | null) => void;
  setActiveChatRecipientId: (id: string | null) => void;
  login: (emailOrUser: string, role?: UserRole) => boolean;
  logout: () => void;
  registerUser: (username: string, email: string) => boolean;
  switchRole: (role: UserRole) => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
  removeToast: (id: string) => void;
  triggerPageTransition: (callback?: () => void) => void;

  // Business Actions
  submitTopupRequest: (amount: number, method: TopupRequest['paymentMethod'], referenceId: string) => void;
  approveTopupRequest: (requestId: string, adminNotes?: string) => void;
  rejectTopupRequest: (requestId: string, reason?: string) => void;
  purchaseMarketplaceItem: (itemId: string) => boolean;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  addMarketplaceItem: (item: Omit<MarketplaceItem, 'id' | 'createdAt' | 'rating' | 'salesCount'>) => void;
  updateMarketplaceItem: (id: string, updates: Partial<MarketplaceItem>) => void;
  deleteMarketplaceItem: (id: string) => void;
  sendMessage: (content: string, groupId?: string, recipientId?: string, imageUrl?: string) => void;
  joinOrLeaveGroup: (groupId: string) => void;
  createGroup: (name: string, description: string, category: string, isPrivate: boolean) => void;
  updateUserProfile: (updates: Partial<User>) => void;
  adjustUserBalance: (userId: string, amount: number, note: string) => void;
  updateUserStatus: (userId: string, status: User['status']) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  updateSettings: (newSettings: Partial<AppSetting>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Initial mock data
const SEED_USERS: User[] = [
  {
    id: 'usr_1',
    username: 'alexthorne',
    email: 'alex.thorne@tenex.io',
    role: 'USER',
    avatarUrl: '/src/assets/images/tenex_avatar_portrait_1790868110528.jpg',
    balance: 0.00,
    pendingBalance: 0.00,
    totalSpent: 0.00,
    totalDeposited: 0.00,
    status: 'ACTIVE',
    emailVerified: true,
    createdAt: '2026-08-12T14:32:00Z',
    bio: 'Decentralized systems engineer & UI minimalist enthusiast.',
  },
  {
    id: 'usr_admin',
    username: 'admin_master',
    email: 'admin@tenex.io',
    role: 'ADMIN',
    avatarUrl: '/src/assets/images/tenex_avatar_portrait_1790868110528.jpg',
    balance: 0.00,
    pendingBalance: 0.00,
    totalSpent: 0.00,
    totalDeposited: 0.00,
    status: 'ACTIVE',
    emailVerified: true,
    createdAt: '2026-01-01T00:00:00Z',
    bio: 'Tenex Platform Super Administrator and Lead Operations Director.',
  },
  {
    id: 'usr_2',
    username: 'elena_frost',
    email: 'elena@frost-security.com',
    role: 'USER',
    balance: 0.00,
    pendingBalance: 0.00,
    totalSpent: 0.00,
    totalDeposited: 0.00,
    status: 'ACTIVE',
    emailVerified: true,
    createdAt: '2026-07-20T10:15:00Z',
    bio: 'Security researcher & cryptographic key collector.',
  },
  {
    id: 'usr_3',
    username: 'marcus_v',
    email: 'marcus.v@cloudcore.net',
    role: 'USER',
    balance: 0.00,
    pendingBalance: 0.00,
    totalSpent: 0.00,
    totalDeposited: 0.00,
    status: 'ACTIVE',
    emailVerified: true,
    createdAt: '2026-09-02T19:40:00Z',
  },
  {
    id: 'usr_sagor',
    username: 'sagor',
    email: 'sagor@tenex.io',
    role: 'USER',
    balance: 0.00,
    pendingBalance: 0.00,
    totalSpent: 0.00,
    totalDeposited: 0.00,
    status: 'ACTIVE',
    emailVerified: true,
    createdAt: '2026-09-10T11:20:00Z',
  },
  {
    id: 'usr_rajul',
    username: 'Rajul',
    email: 'rajul@tenex.io',
    role: 'USER',
    balance: 0.00,
    pendingBalance: 0.00,
    totalSpent: 0.00,
    totalDeposited: 0.00,
    status: 'ACTIVE',
    emailVerified: true,
    createdAt: '2026-09-15T08:45:00Z',
  },
  {
    id: 'usr_hima',
    username: 'Hima',
    email: 'hima@tenex.io',
    role: 'USER',
    balance: 0.00,
    pendingBalance: 0.00,
    totalSpent: 0.00,
    totalDeposited: 0.00,
    status: 'ACTIVE',
    emailVerified: true,
    createdAt: '2026-09-18T16:10:00Z',
  },
];

const SEED_MARKET_ITEMS: MarketplaceItem[] = [
  {
    id: 'itm_1',
    title: 'TitanShield Hardware Token',
    description: 'Ultra-low latency physical cryptographic security module with biometric touch and FIDO2/WebAuthn support.',
    price: 189.00,
    category: 'SECURITY',
    status: 'AVAILABLE',
    rating: 4.9,
    salesCount: 342,
    imageUrl: '/src/assets/images/marketplace_glass_gadget_1790868090936.jpg',
    features: ['EAL6+ Secure Element', 'NFC & USB-C dual interface', 'Zero-knowledge recovery protocol', 'Sleek frosted glass chassis'],
    createdAt: '2026-08-01',
  },
  {
    id: 'itm_2',
    title: 'Quantum Mesh Node Pass',
    description: 'High-speed dedicated edge proxy gateway with sub-10ms global routing and anti-fingerprinting shields.',
    price: 49.00,
    category: 'INFRASTRUCTURE',
    status: 'AVAILABLE',
    rating: 4.8,
    salesCount: 890,
    features: ['Dedicated residential IP pool', '10 Gbps uplink bandwidth', 'Zero log policy', 'HTTP/3 and WireGuard enabled'],
    createdAt: '2026-08-10',
  },
  {
    id: 'itm_3',
    title: 'Tenex Glassmorphic UI Kit',
    description: 'Production-ready React 19 + Tailwind design token system with over 120 frosted glass components and micro-interactions.',
    price: 79.00,
    category: 'TEMPLATES',
    status: 'AVAILABLE',
    rating: 5.0,
    salesCount: 520,
    features: ['Figma source tokens', 'WCAG AA accessible contrast', 'Mobile thumb-zone optimized', 'Zero runtime CSS overhead'],
    createdAt: '2026-08-15',
  },
  {
    id: 'itm_4',
    title: 'Automated Threat Intelligence API',
    description: 'Real-time suspicious IP, leak database, and credential vulnerability lookup service with webhook notifications.',
    price: 120.00,
    category: 'DEV_TOOLS',
    status: 'AVAILABLE',
    rating: 4.7,
    salesCount: 215,
    features: ['100,000 monthly requests', 'REST & GraphQL endpoints', 'Sub-30ms response SLA', 'Encrypted webhook dispatch'],
    createdAt: '2026-09-01',
  },
  {
    id: 'itm_5',
    title: 'Dedicated Cloud Sandboxing Cluster',
    description: 'Isolated ephemeral VM runners for malware analysis, stress testing, and high-security compilation pipelines.',
    price: 340.00,
    category: 'SERVICES',
    status: 'PREORDER',
    rating: 4.9,
    salesCount: 78,
    features: ['KVM nested virtualization', 'Hardware-level memory sanitization', 'Instant snapshot rollback', 'Bespoke egress rules'],
    createdAt: '2026-09-12',
  },
];

const SEED_GROUPS: Group[] = [
  {
    id: 'grp_1',
    name: 'Community Hub',
    description: 'Official global communication channel for all registered platform members.',
    category: 'Official Community',
    memberCount: 7,
    isPrivate: false,
    createdAt: '2026-01-01',
    avatarIcon: 'Users',
    isJoined: true,
  },
];

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('tenex_user');
    if (saved) {
      try {
        const u = JSON.parse(saved);
        return { ...u, balance: 0.00, pendingBalance: 0.00 };
      } catch {
        return SEED_USERS[0];
      }
    }
    return SEED_USERS[0];
  });

  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('tenex_all_users');
    if (saved) {
      try {
        const list = JSON.parse(saved);
        return list.map((u: User) => ({ ...u, balance: 0.00, pendingBalance: 0.00 }));
      } catch {
        return SEED_USERS;
      }
    }
    return SEED_USERS;
  });

  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    return currentUser?.role || 'USER';
  });

  const [currentPage, setCurrentPageState] = useState<PageRoute>('dashboard');
  const [activeTheme, setActiveThemeState] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('tenex_theme');
    return (saved as ThemeMode) || 'sunset';
  });

  const setActiveTheme = (theme: ThemeMode) => {
    setActiveThemeState(theme);
    localStorage.setItem('tenex_theme', theme);
    showToast(
      `Theme activated: ${
        theme === 'nordic'
          ? 'Nordic Lake & Granite Shore'
          : theme === 'botanical'
          ? 'Botanical Flora & Bokeh'
          : 'Dusk Sunset Horizon'
      }`,
      'info'
    );
  };
  const [activeToolId, setActiveToolId] = useState<ToolId | null>(null);
  const [activeAdminTab, setActiveAdminTab] = useState<AdminTab>('dashboard');
  const [activeChatGroupId, setActiveChatGroupId] = useState<string | null>('grp_1');
  const [activeChatRecipientId, setActiveChatRecipientId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('tenex_transactions');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'tx_101',
        userId: 'usr_1',
        userName: 'alexthorne',
        type: 'DEPOSIT',
        amount: 500.00,
        status: 'COMPLETED',
        description: 'USDT Top-Up settled on TRON Network',
        referenceId: 'TX-94829103-TRC',
        paymentMethod: 'USDT_TRC20',
        createdAt: '2026-09-28T16:20:00Z',
      },
      {
        id: 'tx_102',
        userId: 'usr_1',
        userName: 'alexthorne',
        type: 'MARKET_PURCHASE',
        amount: -189.00,
        status: 'COMPLETED',
        description: 'Purchased TitanShield Hardware Token',
        referenceId: 'ORD-7729-TS',
        createdAt: '2026-09-29T11:45:00Z',
      },
      {
        id: 'tx_103',
        userId: 'usr_1',
        userName: 'alexthorne',
        type: 'DEPOSIT',
        amount: 250.00,
        status: 'PENDING',
        description: 'Bank Wire Verification Pending',
        referenceId: 'REF-BANK-55102',
        paymentMethod: 'BANK_TRANSFER',
        createdAt: '2026-10-01T04:12:00Z',
      },
      {
        id: 'tx_104',
        userId: 'usr_2',
        userName: 'elena_frost',
        type: 'DEPOSIT',
        amount: 300.00,
        status: 'COMPLETED',
        description: 'Manual Admin Credit for Bug Bounty',
        referenceId: 'ADM-CRD-8821',
        createdAt: '2026-09-30T18:00:00Z',
        adminNotes: 'Bounty reward for Totp utility audit report',
      },
    ];
  });

  const [topupRequests, setTopupRequests] = useState<TopupRequest[]>(() => {
    const saved = localStorage.getItem('tenex_topup_requests');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'req_1',
        userId: 'usr_1',
        userName: 'alexthorne',
        userEmail: 'alex.thorne@tenex.io',
        amount: 250.00,
        paymentMethod: 'BANK_TRANSFER',
        referenceId: 'REF-BANK-55102',
        status: 'PENDING',
        createdAt: '2026-10-01T04:12:00Z',
        adminNotes: 'Awaiting swift settlement clearance',
      },
      {
        id: 'req_2',
        userId: 'usr_2',
        userName: 'elena_frost',
        userEmail: 'elena@frost-security.com',
        amount: 100.00,
        paymentMethod: 'USDT_TRC20',
        referenceId: 'TX-8829104-USDT',
        status: 'PENDING',
        createdAt: '2026-10-01T06:50:00Z',
      },
      {
        id: 'req_3',
        userId: 'usr_1',
        userName: 'alexthorne',
        userEmail: 'alex.thorne@tenex.io',
        amount: 500.00,
        paymentMethod: 'USDT_TRC20',
        referenceId: 'TX-94829103-TRC',
        status: 'APPROVED',
        createdAt: '2026-09-28T16:15:00Z',
        adminNotes: 'Confirmed 20 network blocks',
      },
    ];
  });

  const [marketplaceItems, setMarketplaceItems] = useState<MarketplaceItem[]>(() => {
    const saved = localStorage.getItem('tenex_market_items');
    return saved ? JSON.parse(saved) : SEED_MARKET_ITEMS;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('tenex_orders');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'ord_1',
        userId: 'usr_1',
        userName: 'alexthorne',
        itemId: 'itm_1',
        itemTitle: 'TitanShield Hardware Token',
        price: 189.00,
        status: 'PROCESSING',
        createdAt: '2026-09-29T11:45:00Z',
        licenseKey: 'TNX-SHIELD-9940-XQ71-2026',
      },
      {
        id: 'ord_2',
        userId: 'usr_1',
        userName: 'alexthorne',
        itemId: 'itm_2',
        itemTitle: 'Quantum Mesh Node Pass',
        price: 49.00,
        status: 'COMPLETED',
        createdAt: '2026-09-15T09:10:00Z',
        licenseKey: 'QMN-NODE-NODE-5481-OK',
      },
      {
        id: 'ord_3',
        userId: 'usr_2',
        userName: 'elena_frost',
        itemId: 'itm_4',
        itemTitle: 'Automated Threat Intelligence API',
        price: 120.00,
        status: 'COMPLETED',
        createdAt: '2026-09-22T14:30:00Z',
        licenseKey: 'KEY-THREAT-INTEL-8829',
      },
    ];
  });

  const [groups, setGroups] = useState<Group[]>(() => {
    const saved = localStorage.getItem('tenex_groups');
    return saved ? JSON.parse(saved) : SEED_GROUPS;
  });

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('tenex_messages');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'msg_1',
        senderId: 'usr_admin',
        senderName: 'Admin Master',
        senderRole: 'ADMIN',
        groupId: 'grp_1',
        content: 'Welcome to Tenex Syndicate. Please review the community safety guidelines and use 2FA for all high-value transactions.',
        timestamp: '10:00 AM',
        read: true,
      },
      {
        id: 'msg_2',
        senderId: 'usr_2',
        senderName: 'Elena Frost',
        senderRole: 'USER',
        groupId: 'grp_1',
        content: 'The new TOTP verification generator tool in the Tools menu is exceptionally fast!',
        timestamp: '10:24 AM',
        read: true,
      },
      {
        id: 'msg_3',
        senderId: 'usr_1',
        senderName: 'Alex Thorne',
        senderRole: 'USER',
        groupId: 'grp_1',
        content: 'Agreed. The responsive glass UI makes mobile top-ups and baki tracking completely effortless.',
        timestamp: '10:31 AM',
        read: true,
      },
    ];
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif_1',
      userId: 'usr_1',
      title: 'Top-Up Request Processing',
      message: 'Your Bank Wire deposit of $250.00 is currently under review by our finance desk.',
      type: 'INFO',
      read: false,
      createdAt: '10 minutes ago',
    },
    {
      id: 'notif_2',
      userId: 'usr_1',
      title: 'Order Dispatched',
      message: 'Hardware Token #ORD-7729-TS has been programmed and dispatched.',
      type: 'SUCCESS',
      read: false,
      createdAt: 'Yesterday',
    },
    {
      id: 'notif_3',
      userId: 'usr_1',
      title: 'Security Recommendation',
      message: 'We recommend generating a fresh 2FA backup key via the TOTP tool.',
      type: 'WARNING',
      read: true,
      createdAt: '3 days ago',
    },
  ]);

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([
    {
      id: 'log_1',
      adminId: 'usr_admin',
      adminName: 'admin_master',
      action: 'APPROVE_TOPUP',
      target: 'REQ-USDT-94829103',
      details: 'Approved $500.00 topup for user alexthorne (usr_1)',
      ipAddress: '198.51.100.44',
      timestamp: '2026-09-28 16:16:12',
    },
    {
      id: 'log_2',
      adminId: 'usr_admin',
      adminName: 'admin_master',
      action: 'SUSPEND_USER',
      target: 'usr_3',
      details: 'Suspended account marcus_v for repeated failed verification trials',
      ipAddress: '198.51.100.44',
      timestamp: '2026-09-30 08:44:00',
    },
    {
      id: 'log_3',
      adminId: 'usr_admin',
      adminName: 'admin_master',
      action: 'UPDATE_PRODUCT',
      target: 'itm_1',
      details: 'Updated inventory status to AVAILABLE with 342 stock units',
      ipAddress: '198.51.100.44',
      timestamp: '2026-10-01 02:11:50',
    },
  ]);

  const [settings, setSettings] = useState<AppSetting>({
    siteName: 'Tenex Platform',
    maintenanceMode: false,
    registrationOpen: true,
    defaultUserBalance: 0.00,
    minTopupAmount: 20.00,
    maxDailyTopup: 10000.00,
    enableChat: true,
    enableTools: true,
    supportEmail: 'support@tenex.io',
  });

  // Initial loader effect to display the animated "T" logo
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1100);
    return () => clearTimeout(timer);
  }, []);

  // Sync state to localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('tenex_user', JSON.stringify(currentUser));
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('tenex_all_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('tenex_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('tenex_topup_requests', JSON.stringify(topupRequests));
  }, [topupRequests]);

  useEffect(() => {
    localStorage.setItem('tenex_market_items', JSON.stringify(marketplaceItems));
  }, [marketplaceItems]);

  useEffect(() => {
    localStorage.setItem('tenex_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('tenex_groups', JSON.stringify(groups));
  }, [groups]);

  useEffect(() => {
    localStorage.setItem('tenex_messages', JSON.stringify(messages));
  }, [messages]);

  // Toast Helper
  const showToast = (message: string, type: 'success' | 'error' | 'info' | 'warning' = 'success') => {
    const id = 'toast_' + Date.now() + Math.random().toString(36).substring(2, 6);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Page Transition with "T" Logo loader
  const triggerPageTransition = (callback?: () => void) => {
    setIsLoading(true);
    setTimeout(() => {
      if (callback) callback();
      setIsLoading(false);
    }, 450);
  };

  const setCurrentPage = (page: PageRoute, toolId?: ToolId) => {
    if (toolId) {
      setActiveToolId(toolId);
    }
    triggerPageTransition(() => {
      setCurrentPageState(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  };

  const login = (emailOrUser: string, requestedRole: UserRole = 'USER'): boolean => {
    const targetUser = users.find(
      (u) =>
        u.email.toLowerCase() === emailOrUser.toLowerCase() ||
        u.username.toLowerCase() === emailOrUser.toLowerCase()
    );

    if (targetUser) {
      if (targetUser.status === 'SUSPENDED') {
        showToast('Account is suspended. Please contact Tenex support.', 'error');
        return false;
      }
      setCurrentUser(targetUser);
      setCurrentRole(targetUser.role);
      showToast(`Welcome back, ${targetUser.username}!`, 'success');
      setCurrentPage(targetUser.role === 'ADMIN' ? 'admin' : 'dashboard');
      return true;
    }

    // Demo fallback instant login
    const isMaster = emailOrUser.toLowerCase().includes('admin');
    const matched = users.find((u) => u.role === (isMaster || requestedRole === 'ADMIN' ? 'ADMIN' : 'USER')) || SEED_USERS[0];
    setCurrentUser(matched);
    setCurrentRole(matched.role);
    showToast(`Logged in as ${matched.username} (${matched.role})`, 'success');
    setCurrentPage(matched.role === 'ADMIN' ? 'admin' : 'dashboard');
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
    showToast('Successfully logged out.', 'info');
    setCurrentPage('landing');
  };

  const registerUser = (username: string, email: string): boolean => {
    const exists = users.some((u) => u.email.toLowerCase() === email.toLowerCase());
    if (exists) {
      showToast('An account with this email already exists.', 'error');
      return false;
    }

    const newUser: User = {
      id: 'usr_' + Date.now(),
      username: username.toLowerCase().replace(/\s+/g, '_'),
      email,
      role: 'USER',
      balance: settings.defaultUserBalance,
      pendingBalance: 0,
      totalSpent: 0,
      totalDeposited: settings.defaultUserBalance,
      status: 'ACTIVE',
      emailVerified: false,
      createdAt: new Date().toISOString(),
      bio: 'New Tenex explorer',
    };

    setUsers((prev) => [newUser, ...prev]);
    setCurrentUser(newUser);
    setCurrentRole('USER');

    // Automatically join the primary community group
    setGroups((prev) =>
      prev.map((g) =>
        g.id === 'grp_1' ? { ...g, memberCount: g.memberCount + 1, isJoined: true } : g
      )
    );

    // Announce new member arrival in Community Hub
    const welcomeMsg: ChatMessage = {
      id: 'msg_welcome_' + Date.now(),
      senderId: 'usr_admin',
      senderName: 'System Bot',
      senderRole: 'ADMIN',
      groupId: 'grp_1',
      content: `@${newUser.username} joined the Tenex Community! Welcome to the hub.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: true,
    };
    setMessages((prev) => [...prev, welcomeMsg]);

    showToast(`Account created! Welcome bonus of $${settings.defaultUserBalance} credited.`, 'success');
    setCurrentPage('dashboard');
    return true;
  };

  const switchRole = (newRole: UserRole) => {
    if (newRole === 'ADMIN') {
      const adminUser = users.find((u) => u.role === 'ADMIN') || SEED_USERS[1];
      setCurrentUser(adminUser);
      setCurrentRole('ADMIN');
      showToast('Switched to Administrator Workspace', 'info');
      setCurrentPage('admin');
    } else {
      const standardUser = users.find((u) => u.role === 'USER') || SEED_USERS[0];
      setCurrentUser(standardUser);
      setCurrentRole('USER');
      showToast('Switched to User Experience', 'info');
      setCurrentPage('dashboard');
    }
  };

  // Submit Topup Request
  const submitTopupRequest = (
    amount: number,
    paymentMethod: TopupRequest['paymentMethod'],
    referenceId: string
  ) => {
    if (!currentUser) return;
    if (amount < settings.minTopupAmount) {
      showToast(`Minimum deposit is $${settings.minTopupAmount}`, 'error');
      return;
    }

    const newReq: TopupRequest = {
      id: 'req_' + Date.now(),
      userId: currentUser.id,
      userName: currentUser.username,
      userEmail: currentUser.email,
      amount,
      paymentMethod,
      referenceId,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
    };

    const newTx: Transaction = {
      id: 'tx_' + Date.now(),
      userId: currentUser.id,
      userName: currentUser.username,
      type: 'DEPOSIT',
      amount,
      status: 'PENDING',
      description: `Top-Up via ${paymentMethod.replace('_', ' ')}`,
      referenceId,
      paymentMethod,
      createdAt: new Date().toISOString(),
    };

    setTopupRequests((prev) => [newReq, ...prev]);
    setTransactions((prev) => [newTx, ...prev]);

    // Update user pending balance
    setCurrentUser((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        pendingBalance: prev.pendingBalance + amount,
      };
    });

    setUsers((prev) =>
      prev.map((u) =>
        u.id === currentUser.id
          ? { ...u, pendingBalance: u.pendingBalance + amount }
          : u
      )
    );

    showToast(`Top-up request of $${amount.toFixed(2)} submitted successfully! Added to Baki/Pending.`, 'success');
  };

  // Admin Approve Topup
  const approveTopupRequest = (requestId: string, adminNotes?: string) => {
    const req = topupRequests.find((r) => r.id === requestId);
    if (!req || req.status !== 'PENDING') return;

    // Idempotent balance update
    setTopupRequests((prev) =>
      prev.map((r) =>
        r.id === requestId
          ? { ...r, status: 'APPROVED', adminNotes: adminNotes || 'Approved by administrator' }
          : r
      )
    );

    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === req.userId) {
          const newPending = Math.max(0, u.pendingBalance - req.amount);
          const newBalance = u.balance + req.amount;
          const newDeposited = u.totalDeposited + req.amount;
          return {
            ...u,
            balance: newBalance,
            pendingBalance: newPending,
            totalDeposited: newDeposited,
          };
        }
        return u;
      })
    );

    if (currentUser?.id === req.userId) {
      setCurrentUser((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          balance: prev.balance + req.amount,
          pendingBalance: Math.max(0, prev.pendingBalance - req.amount),
          totalDeposited: prev.totalDeposited + req.amount,
        };
      });
    }

    // Update transaction
    setTransactions((prev) =>
      prev.map((t) =>
        t.referenceId === req.referenceId
          ? { ...t, status: 'COMPLETED', adminNotes: adminNotes || 'Approved by administrator' }
          : t
      )
    );

    // Add Audit Log
    const newLog: AuditLog = {
      id: 'log_' + Date.now(),
      adminId: currentUser?.id || 'admin',
      adminName: currentUser?.username || 'admin',
      action: 'APPROVE_TOPUP',
      target: req.referenceId,
      details: `Credited $${req.amount.toFixed(2)} to ${req.userName}`,
      ipAddress: '127.0.0.1',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    };
    setAuditLogs((prev) => [newLog, ...prev]);

    showToast(`Approved top-up for ${req.userName}. Balance updated.`, 'success');
  };

  // Admin Reject Topup
  const rejectTopupRequest = (requestId: string, reason?: string) => {
    const req = topupRequests.find((r) => r.id === requestId);
    if (!req || req.status !== 'PENDING') return;

    setTopupRequests((prev) =>
      prev.map((r) =>
        r.id === requestId
          ? { ...r, status: 'REJECTED', adminNotes: reason || 'Declined by administrator' }
          : r
      )
    );

    // Remove from pending balance
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === req.userId) {
          return {
            ...u,
            pendingBalance: Math.max(0, u.pendingBalance - req.amount),
          };
        }
        return u;
      })
    );

    if (currentUser?.id === req.userId) {
      setCurrentUser((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          pendingBalance: Math.max(0, prev.pendingBalance - req.amount),
        };
      });
    }

    setTransactions((prev) =>
      prev.map((t) =>
        t.referenceId === req.referenceId
          ? { ...t, status: 'REJECTED', adminNotes: reason || 'Declined' }
          : t
      )
    );

    // Audit log
    const newLog: AuditLog = {
      id: 'log_' + Date.now(),
      adminId: currentUser?.id || 'admin',
      adminName: currentUser?.username || 'admin',
      action: 'REJECT_TOPUP',
      target: req.referenceId,
      details: `Rejected $${req.amount.toFixed(2)} top-up for ${req.userName}. Reason: ${reason || 'Unverified'}`,
      ipAddress: '127.0.0.1',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    };
    setAuditLogs((prev) => [newLog, ...prev]);

    showToast(`Rejected top-up request ${req.referenceId}`, 'info');
  };

  // Purchase Marketplace Item
  const purchaseMarketplaceItem = (itemId: string): boolean => {
    if (!currentUser) {
      showToast('Please sign in to complete your order.', 'error');
      setCurrentPage('login');
      return false;
    }

    const item = marketplaceItems.find((i) => i.id === itemId);
    if (!item) {
      showToast('Product not found.', 'error');
      return false;
    }

    if (item.status === 'OUT_OF_STOCK') {
      showToast('Item is out of stock.', 'error');
      return false;
    }

    // Server-side style validation: Check user balance
    if (currentUser.balance < item.price) {
      const deficit = item.price - currentUser.balance;
      showToast(`Insufficient balance. Please top up $${deficit.toFixed(2)} to proceed.`, 'error');
      return false;
    }

    const newBalance = currentUser.balance - item.price;
    const newTotalSpent = currentUser.totalSpent + item.price;

    // Deduct user balance
    setCurrentUser((prev) => (prev ? { ...prev, balance: newBalance, totalSpent: newTotalSpent } : prev));
    setUsers((prev) =>
      prev.map((u) => (u.id === currentUser.id ? { ...u, balance: newBalance, totalSpent: newTotalSpent } : u))
    );

    // Create Order Record
    const newOrder: Order = {
      id: 'ord_' + Date.now(),
      userId: currentUser.id,
      userName: currentUser.username,
      itemId: item.id,
      itemTitle: item.title,
      price: item.price,
      status: 'PROCESSING',
      createdAt: new Date().toISOString(),
      licenseKey: 'TNX-' + Math.random().toString(36).substring(2, 10).toUpperCase(),
    };
    setOrders((prev) => [newOrder, ...prev]);

    // Create Financial Transaction
    const newTx: Transaction = {
      id: 'tx_' + Date.now(),
      userId: currentUser.id,
      userName: currentUser.username,
      type: 'MARKET_PURCHASE',
      amount: -item.price,
      status: 'COMPLETED',
      description: `Purchased: ${item.title}`,
      referenceId: newOrder.id,
      createdAt: new Date().toISOString(),
    };
    setTransactions((prev) => [newTx, ...prev]);

    // Update sales count
    setMarketplaceItems((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, salesCount: i.salesCount + 1 } : i))
    );

    showToast(`Order confirmed! $${item.price.toFixed(2)} deducted from balance.`, 'success');
    return true;
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)));
    showToast(`Order #${orderId} marked as ${status}`, 'info');
  };

  const addMarketplaceItem = (
    itemData: Omit<MarketplaceItem, 'id' | 'createdAt' | 'rating' | 'salesCount'>
  ) => {
    const newItem: MarketplaceItem = {
      ...itemData,
      id: 'itm_' + Date.now(),
      rating: 5.0,
      salesCount: 0,
      createdAt: new Date().toISOString().substring(0, 10),
    };
    setMarketplaceItems((prev) => [newItem, ...prev]);

    const newLog: AuditLog = {
      id: 'log_' + Date.now(),
      adminId: currentUser?.id || 'admin',
      adminName: currentUser?.username || 'admin',
      action: 'ADD_PRODUCT',
      target: newItem.id,
      details: `Added new item: ${newItem.title} for $${newItem.price}`,
      ipAddress: '127.0.0.1',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    };
    setAuditLogs((prev) => [newLog, ...prev]);
    showToast(`Marketplace item "${newItem.title}" published!`, 'success');
  };

  const updateMarketplaceItem = (id: string, updates: Partial<MarketplaceItem>) => {
    setMarketplaceItems((prev) => prev.map((item) => (item.id === id ? { ...item, ...updates } : item)));
    showToast('Marketplace item updated', 'info');
  };

  const deleteMarketplaceItem = (id: string) => {
    setMarketplaceItems((prev) => prev.filter((i) => i.id !== id));
    showToast('Item deleted from marketplace', 'info');
  };

  // Realtime Chat (Text and Image only)
  const sendMessage = (content: string, groupId?: string, recipientId?: string, imageUrl?: string) => {
    if (!currentUser || (!content.trim() && !imageUrl)) return;

    const newMsg: ChatMessage = {
      id: 'msg_' + Date.now(),
      senderId: currentUser.id,
      senderName: currentUser.username,
      senderRole: currentUser.role,
      senderAvatar: currentUser.avatarUrl,
      groupId: recipientId ? undefined : (groupId || activeChatGroupId || 'grp_1'),
      recipientId,
      content: content.trim(),
      imageUrl,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: true,
    };

    setMessages((prev) => [...prev, newMsg]);

    // Simulated interactive peer/bot response
    if (recipientId) {
      const recipient = users.find((u) => u.id === recipientId);
      setTimeout(() => {
        const replyMsg: ChatMessage = {
          id: 'msg_reply_' + Date.now(),
          senderId: recipientId,
          senderName: recipient?.username || 'Member',
          senderRole: recipient?.role || 'USER',
          senderAvatar: recipient?.avatarUrl,
          recipientId: currentUser.id,
          content: imageUrl
            ? `Media attachment received! Thanks for sharing.`
            : `Hey @${currentUser.username}, got your message!`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          read: true,
        };
        setMessages((prev) => [...prev, replyMsg]);
      }, 1300);
    } else if (groupId || activeChatGroupId) {
      setTimeout(() => {
        const autoMsg: ChatMessage = {
          id: 'msg_reply_' + Date.now(),
          senderId: 'usr_admin',
          senderName: 'System Bot',
          senderRole: 'ADMIN',
          groupId: groupId || activeChatGroupId || 'grp_1',
          content: imageUrl
            ? `Media attachment received in Community Hub from @${currentUser.username}.`
            : `Dispatch verified in Community Hub from @${currentUser.username}.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          read: true,
        };
        setMessages((prev) => [...prev, autoMsg]);
      }, 1200);
    }
  };

  const joinOrLeaveGroup = (groupId: string) => {
    setGroups((prev) =>
      prev.map((g) => {
        if (g.id === groupId) {
          const nextJoined = !g.isJoined;
          showToast(nextJoined ? `Joined group ${g.name}` : `Left group ${g.name}`, 'info');
          return {
            ...g,
            isJoined: nextJoined,
            memberCount: nextJoined ? g.memberCount + 1 : Math.max(1, g.memberCount - 1),
          };
        }
        return g;
      })
    );
  };

  const createGroup = (name: string, description: string, category: string, isPrivate: boolean) => {
    const newGroup: Group = {
      id: 'grp_' + Date.now(),
      name,
      description,
      category,
      isPrivate,
      memberCount: 1,
      createdAt: new Date().toISOString().substring(0, 10),
      avatarIcon: 'Users',
      isJoined: true,
    };
    setGroups((prev) => [newGroup, ...prev]);
    showToast(`Group "${name}" created!`, 'success');
  };

  const updateUserProfile = (updates: Partial<User>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...updates };
    setCurrentUser(updated);
    setUsers((prev) => prev.map((u) => (u.id === currentUser.id ? updated : u)));
    showToast('Profile information saved', 'success');
  };

  const adjustUserBalance = (userId: string, amount: number, note: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const nextBal = Math.max(0, u.balance + amount);
          return { ...u, balance: nextBal };
        }
        return u;
      })
    );

    if (currentUser?.id === userId) {
      setCurrentUser((prev) => (prev ? { ...prev, balance: Math.max(0, prev.balance + amount) } : prev));
    }

    const newTx: Transaction = {
      id: 'tx_adj_' + Date.now(),
      userId,
      userName: users.find((u) => u.id === userId)?.username || 'User',
      type: 'ADMIN_ADJUSTMENT',
      amount,
      status: 'COMPLETED',
      description: `Administrative adjustment: ${note}`,
      referenceId: 'ADM-ADJ-' + Date.now().toString().slice(-6),
      adminNotes: note,
      createdAt: new Date().toISOString(),
    };
    setTransactions((prev) => [newTx, ...prev]);

    const newLog: AuditLog = {
      id: 'log_' + Date.now(),
      adminId: currentUser?.id || 'admin',
      adminName: currentUser?.username || 'admin',
      action: 'BALANCE_ADJUST',
      target: userId,
      details: `Adjusted balance by ${amount >= 0 ? '+' : ''}$${amount.toFixed(2)}. Reason: ${note}`,
      ipAddress: '127.0.0.1',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    };
    setAuditLogs((prev) => [newLog, ...prev]);

    showToast(`User balance adjusted by ${amount >= 0 ? '+' : ''}$${amount.toFixed(2)}`, 'success');
  };

  const updateUserStatus = (userId: string, status: User['status']) => {
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, status } : u)));
    if (currentUser?.id === userId) {
      setCurrentUser((prev) => (prev ? { ...prev, status } : prev));
    }
    const newLog: AuditLog = {
      id: 'log_' + Date.now(),
      adminId: currentUser?.id || 'admin',
      adminName: currentUser?.username || 'admin',
      action: 'USER_STATUS_CHANGE',
      target: userId,
      details: `Changed account status to ${status}`,
      ipAddress: '127.0.0.1',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    };
    setAuditLogs((prev) => [newLog, ...prev]);
    showToast(`User status updated to ${status}`, 'info');
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    showToast('All notifications marked as read', 'info');
  };

  const updateSettings = (newSettings: Partial<AppSetting>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
    showToast('System settings updated successfully', 'success');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        users,
        currentRole,
        currentPage,
        activeTheme,
        activeToolId,
        activeAdminTab,
        activeChatGroupId,
        activeChatRecipientId,
        isLoading,
        toasts,
        transactions,
        topupRequests,
        marketplaceItems,
        orders,
        groups,
        messages,
        notifications,
        auditLogs,
        settings,
        setActiveTheme,
        setCurrentPage,
        setActiveToolId,
        setActiveAdminTab,
        setActiveChatGroupId,
        setActiveChatRecipientId,
        login,
        logout,
        registerUser,
        switchRole,
        showToast,
        removeToast,
        triggerPageTransition,
        submitTopupRequest,
        approveTopupRequest,
        rejectTopupRequest,
        purchaseMarketplaceItem,
        updateOrderStatus,
        addMarketplaceItem,
        updateMarketplaceItem,
        deleteMarketplaceItem,
        sendMessage,
        joinOrLeaveGroup,
        createGroup,
        updateUserProfile,
        adjustUserBalance,
        updateUserStatus,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        updateSettings,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
