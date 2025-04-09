export interface AdminUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'support';
  createdAt: string;
  updatedAt: string;
}

export interface CoupleOverview {
  id: string;
  userId: string;
  partner1Name: string;
  partner2Name: string;
  email: string;
  packageType: 'basic' | 'premium' | 'deluxe';
  weddingDate: string | null;
  status: 'active' | 'inactive' | 'suspended';
  createdAt: string;
  updatedAt: string;
}

export interface WeddingOverview {
  id: string;
  coupleId: string;
  date: string | null;
  location: string | null;
  guestCount: number | null;
  websiteEnabled: boolean;
  websiteUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Package {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  billingCycle: 'one-time' | 'monthly' | 'yearly';
  features: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  id: string;
  coupleId: string;
  packageId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentMethod: string;
  transactionDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface SystemSettings {
  id: string;
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  supportEmail: string;
  defaultLanguage: 'de' | 'en';
  availableLanguages: string[];
  logoUrl: string | null;
  faviconUrl: string | null;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  totalCouples: number;
  activeCouples: number;
  totalRevenue: number;
  revenueThisMonth: number;
  averageWeddingSize: number;
  upcomingWeddings: number;
  popularFeatures: {
    feature: string;
    usageCount: number;
  }[];
}

export interface NoCodePageElement {
  id: string;
  type: 'header' | 'paragraph' | 'image' | 'button' | 'form' | 'section' | 'divider';
  content: any;
  order: number;
  settings: any;
}

export interface NoCodePage {
  id: string;
  title: string;
  slug: string;
  description: string;
  elements: NoCodePageElement[];
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NoCodeTemplate {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  category: 'wedding' | 'landing' | 'admin';
  elements: NoCodePageElement[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NoCodeComponent {
  id: string;
  name: string;
  description: string;
  type: 'header' | 'footer' | 'navigation' | 'hero' | 'feature' | 'testimonial' | 'pricing' | 'contact';
  content: any;
  thumbnail: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  userId: string | null;
  coupleId: string | null;
  type: 'system' | 'payment' | 'support' | 'wedding';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SupportTicket {
  id: string;
  userId: string;
  coupleId: string | null;
  subject: string;
  description: string;
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignedTo: string | null;
  messages: SupportMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface SupportMessage {
  id: string;
  ticketId: string;
  userId: string;
  message: string;
  attachments: string[];
  createdAt: string;
}

export interface ActivityLog {
  id: string;
  userId: string | null;
  coupleId: string | null;
  action: string;
  details: any;
  ipAddress: string;
  userAgent: string;
  createdAt: string;
}
