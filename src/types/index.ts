export type UserRole = 'USER' | 'ADMIN';

export interface PayoutAccount {
  method: 'BKASH' | 'NAGAD' | 'ROCKET' | 'BANK' | 'USDT_TRC20';
  accountNumber: string;
  accountName: string;
  bankName?: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  balance: number;
  pendingBalance: number;
  totalSpent: number;
  totalDeposited: number;
  status: 'ACTIVE' | 'PENDING' | 'SUSPENDED';
  emailVerified: boolean;
  createdAt: string;
  bio?: string;
  payoutAccount?: PayoutAccount;
}

export type TransactionType = 'DEPOSIT' | 'WITHDRAW' | 'MARKET_PURCHASE' | 'TRANSFER' | 'ADMIN_ADJUSTMENT';
export type TransactionStatus = 'COMPLETED' | 'PENDING' | 'REJECTED' | 'CANCELLED';

export interface Transaction {
  id: string;
  userId: string;
  userName: string;
  type: TransactionType;
  amount: number;
  status: TransactionStatus;
  description: string;
  referenceId: string;
  paymentMethod?: string;
  createdAt: string;
  adminNotes?: string;
}

export interface TopupRequest {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  amount: number;
  paymentMethod: 'USDT_TRC20' | 'BTC' | 'BANK_TRANSFER' | 'BKASH_NAGAD' | 'CREDIT_CARD';
  referenceId: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
  adminNotes?: string;
}

export interface MarketplaceItem {
  id: string;
  title: string;
  description: string;
  price: number;
  category: 'SECURITY' | 'INFRASTRUCTURE' | 'DEV_TOOLS' | 'TEMPLATES' | 'SERVICES';
  status: 'AVAILABLE' | 'OUT_OF_STOCK' | 'PREORDER';
  rating: number;
  salesCount: number;
  imageUrl?: string;
  features: string[];
  createdAt: string;
}

export interface Order {
  id: string;
  userId: string;
  userName: string;
  itemId: string;
  itemTitle: string;
  price: number;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED';
  createdAt: string;
  licenseKey?: string;
}

export interface Group {
  id: string;
  name: string;
  description: string;
  category: string;
  memberCount: number;
  isPrivate: boolean;
  createdAt: string;
  avatarIcon: string;
  isJoined?: boolean;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  senderAvatar?: string;
  recipientId?: string; // empty if group
  groupId?: string;
  content: string;
  imageUrl?: string; // Image / picture support
  timestamp: string;
  read: boolean;
}

export interface AuditLog {
  id: string;
  adminId: string;
  adminName: string;
  action: string;
  target: string;
  details: string;
  ipAddress: string;
  timestamp: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ALERT';
  read: boolean;
  createdAt: string;
}

export interface AppSetting {
  siteName: string;
  maintenanceMode: boolean;
  registrationOpen: boolean;
  defaultUserBalance: number;
  minTopupAmount: number;
  maxDailyTopup: number;
  enableChat: boolean;
  enableTools: boolean;
  supportEmail: string;
}
