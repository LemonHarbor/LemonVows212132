import { createClient } from '@supabase/supabase-js';
import { 
  AdminUser, 
  CoupleOverview, 
  WeddingOverview, 
  Package, 
  Transaction, 
  SystemSettings,
  DashboardStats,
  NoCodePage,
  NoCodeTemplate,
  NoCodeComponent,
  Notification,
  SupportTicket,
  ActivityLog
} from '../models/AdminTypes';

// Supabase connection details - using environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://jodqliylhmwgpurfzxm.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Admin authentication services
export const adminAuthService = {
  // Login admin
  login: async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
      // Check if user has admin role
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('role')
        .eq('id', data.user.id)
        .single();
      
      if (userError) throw userError;
      
      if (userData.role !== 'admin' && userData.role !== 'support') {
        throw new Error('Unauthorized: User is not an admin');
      }
      
      return data;
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  },
  
  // Logout admin
  logout: async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Error logging out:', error);
      throw error;
    }
  },
  
  // Get current admin user
  getCurrentAdmin: async () => {
    try {
      const { data, error } = await supabase.auth.getUser();
      if (error) throw error;
      
      if (!data.user) return null;
      
      // Check if user has admin role
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', data.user.id)
        .single();
      
      if (userError) throw userError;
      
      if (userData.role !== 'admin' && userData.role !== 'support') {
        return null;
      }
      
      return userData as AdminUser;
    } catch (error) {
      console.error('Error getting current admin:', error);
      return null;
    }
  }
};

// Couple management services
export const adminCoupleService = {
  // Get all couples
  getAllCouples: async () => {
    try {
      const { data, error } = await supabase
        .from('couples')
        .select(`
          id,
          user_id,
          partner1_first_name,
          partner1_last_name,
          partner2_first_name,
          partner2_last_name,
          email,
          package_type,
          status,
          created_at,
          updated_at,
          weddings (
            id,
            date
          )
        `);
      
      if (error) throw error;
      
      // Transform data to match CoupleOverview type
      const couples: CoupleOverview[] = data.map(couple => ({
        id: couple.id,
        userId: couple.user_id,
        partner1Name: `${couple.partner1_first_name} ${couple.partner1_last_name}`,
        partner2Name: `${couple.partner2_first_name} ${couple.partner2_last_name}`,
        email: couple.email,
        packageType: couple.package_type,
        weddingDate: couple.weddings && couple.weddings[0] ? couple.weddings[0].date : null,
        status: couple.status,
        createdAt: couple.created_at,
        updatedAt: couple.updated_at
      }));
      
      return couples;
    } catch (error) {
      console.error('Error getting all couples:', error);
      throw error;
    }
  },
  
  // Get couple by ID
  getCoupleById: async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('couples')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting couple by ID:', error);
      throw error;
    }
  },
  
  // Create new couple
  createCouple: async (coupleData: any) => {
    try {
      // First create user
      const { data: userData, error: userError } = await supabase.auth.signUp({
        email: coupleData.email,
        password: coupleData.password,
        options: {
          data: {
            first_name: coupleData.partner1FirstName,
            last_name: coupleData.partner1LastName,
            role: 'couple'
          }
        }
      });
      
      if (userError) throw userError;
      
      // Then create couple
      const { data, error } = await supabase
        .from('couples')
        .insert([{
          user_id: userData.user?.id,
          partner1_first_name: coupleData.partner1FirstName,
          partner1_last_name: coupleData.partner1LastName,
          partner2_first_name: coupleData.partner2FirstName,
          partner2_last_name: coupleData.partner2LastName,
          email: coupleData.email,
          phone: coupleData.phone,
          package_type: coupleData.packageType,
          expiry_date: coupleData.expiryDate,
          status: 'active'
        }])
        .select();
      
      if (error) throw error;
      
      // Create wedding instance if needed
      if (coupleData.createWedding) {
        const { error: weddingError } = await supabase
          .from('weddings')
          .insert([{
            couple_id: data[0].id,
            website_enabled: false,
            music_voting_enabled: false
          }]);
        
        if (weddingError) throw weddingError;
      }
      
      return data[0];
    } catch (error) {
      console.error('Error creating couple:', error);
      throw error;
    }
  },
  
  // Update couple
  updateCouple: async (id: string, coupleData: any) => {
    try {
      const { data, error } = await supabase
        .from('couples')
        .update(coupleData)
        .eq('id', id)
        .select();
      
      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error('Error updating couple:', error);
      throw error;
    }
  },
  
  // Change couple status
  changeCoupleStatus: async (id: string, status: 'active' | 'inactive' | 'suspended') => {
    try {
      const { data, error } = await supabase
        .from('couples')
        .update({ status })
        .eq('id', id)
        .select();
      
      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error('Error changing couple status:', error);
      throw error;
    }
  }
};

// Wedding management services
export const adminWeddingService = {
  // Get all weddings
  getAllWeddings: async () => {
    try {
      const { data, error } = await supabase
        .from('weddings')
        .select(`
          id,
          couple_id,
          date,
          location,
          guest_count,
          website_enabled,
          website_url,
          created_at,
          updated_at,
          couples (
            partner1_first_name,
            partner1_last_name,
            partner2_first_name,
            partner2_last_name
          )
        `);
      
      if (error) throw error;
      
      // Transform data to match WeddingOverview type
      const weddings: WeddingOverview[] = data.map(wedding => ({
        id: wedding.id,
        coupleId: wedding.couple_id,
        date: wedding.date,
        location: wedding.location,
        guestCount: wedding.guest_count,
        websiteEnabled: wedding.website_enabled,
        websiteUrl: wedding.website_url,
        createdAt: wedding.created_at,
        updatedAt: wedding.updated_at
      }));
      
      return weddings;
    } catch (error) {
      console.error('Error getting all weddings:', error);
      throw error;
    }
  },
  
  // Get wedding by ID
  getWeddingById: async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('weddings')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting wedding by ID:', error);
      throw error;
    }
  },
  
  // Create wedding instance
  createWedding: async (weddingData: any) => {
    try {
      const { data, error } = await supabase
        .from('weddings')
        .insert([weddingData])
        .select();
      
      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error('Error creating wedding:', error);
      throw error;
    }
  }
};

// Package management services
export const packageService = {
  // Get all packages
  getAllPackages: async () => {
    try {
      const { data, error } = await supabase
        .from('packages')
        .select('*');
      
      if (error) throw error;
      return data as Package[];
    } catch (error) {
      console.error('Error getting all packages:', error);
      throw error;
    }
  },
  
  // Get package by ID
  getPackageById: async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('packages')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data as Package;
    } catch (error) {
      console.error('Error getting package by ID:', error);
      throw error;
    }
  },
  
  // Create package
  createPackage: async (packageData: Omit<Package, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const { data, error } = await supabase
        .from('packages')
        .insert([packageData])
        .select();
      
      if (error) throw error;
      return data[0] as Package;
    } catch (error) {
      console.error('Error creating package:', error);
      throw error;
    }
  },
  
  // Update package
  updatePackage: async (id: string, packageData: Partial<Package>) => {
    try {
      const { data, error } = await supabase
        .from('packages')
        .update(packageData)
        .eq('id', id)
        .select();
      
      if (error) throw error;
      return data[0] as Package;
    } catch (error) {
      console.error('Error updating package:', error);
      throw error;
    }
  },
  
  // Toggle package active status
  togglePackageStatus: async (id: string, isActive: boolean) => {
    try {
      const { data, error } = await supabase
        .from('packages')
        .update({ isActive })
        .eq('id', id)
        .select();
      
      if (error) throw error;
      return data[0] as Package;
    } catch (error) {
      console.error('Error toggling package status:', error);
      throw error;
    }
  }
};

// Transaction services
export const transactionService = {
  // Get all transactions
  getAllTransactions: async () => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select(`
          *,
          couples (
            partner1_first_name,
            partner1_last_name,
            partner2_first_name,
            partner2_last_name
          ),
          packages (
            name
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Transaction[];
    } catch (error) {
      console.error('Error getting all transactions:', error);
      throw error;
    }
  },
  
  // Get transactions by couple ID
  getTransactionsByCoupleId: async (coupleId: string) => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('couple_id', coupleId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Transaction[];
    } catch (error) {
      console.error('Error getting transactions by couple ID:', error);
      throw error;
    }
  },
  
  // Create transaction
  createTransaction: async (transactionData: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .insert([transactionData])
        .select();
      
      if (error) throw error;
      return data[0] as Transaction;
    } catch (error) {
      console.error('Error creating transaction:', error);
      throw error;
    }
  },
  
  // Update transaction status
  updateTransactionStatus: async (id: string, status: 'pending' | 'completed' | 'failed' | 'refunded') => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .update({ status })
        .eq('id', id)
        .select();
      
      if (error) throw error;
      return data[0] as Transaction;
    } catch (error) {
      console.error('Error updating transaction status:', error);
      throw error;
    }
  }
};

// System settings services
export const systemSettingsService = {
  // Get system settings
  getSystemSettings: async () => {
    try {
      const { data, error } = await supabase
        .from('system_settings')
        .select('*')
        .single();
      
      if (error) throw error;
      return data as SystemSettings;
    } catch (error) {
      console.error('Error getting system settings:', error);
      throw error;
    }
  },
  
  // Update system settings
  updateSystemSettings: async (settingsData: Partial<SystemSettings>) => {
    try {
      const { data, error } = await supabase
        .from('system_settings')
        .update(settingsData)
        .eq('id', '1') // Assuming there's only one system settings record
        .select();
      
      if (error) throw error;
      return data[0] as SystemSettings;
    } catch (error) {
      console.error('Error updating system settings:', error);
      throw error;
    }
  }
};

// Dashboard statistics services
export const dashboardStatsService = {
  // Get dashboard statistics
  getDashboardStats: async () => {
    try {
      // Get total couples count
      const { count: totalCouples, error: couplesError } = await supabase
        .from('couples')
        .select('*', { count: 'exact', head: true });
      
      if (couplesError) throw couplesError;
      
      // Get active couples count
      const { count: activeCouples, error: activeCouplesError } = await supabase
        .from('couples')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active');
      
      if (activeCouplesError) throw activeCouplesError;
      
      // Get total revenue
      const { data: transactions, error: transactionsError } = await supabase
        .from('transactions')
        .select('amount')
        .eq('status', 'completed');
      
      if (transactionsError) throw transactionsError;
      
      const totalRevenue = transactions.reduce((sum, transaction) => sum + transaction.amount, 0);
      
      // Get revenue this month
      const now = new Date();
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
      const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString();
      
      const { data: monthTransactions, error: monthTransactionsError } = await supabase
        .from('transactions')
        .select('amount')
        .eq('status', 'completed')
        .gte('transaction_date', firstDayOfMonth)
        .lte('transaction_date', lastDayOfMonth);
      
      if (monthTransactionsError) throw monthTransactionsError;
      
      const revenueThisMonth = monthTransactions.reduce((sum, transaction) => sum + transaction.amount, 0);
      
      // Get average wedding size
      const { data: weddings, error: weddingsError } = await supabase
        .from('weddings')
        .select('guest_count');
      
      if (weddingsError) throw weddingsError;
      
      const weddingsWithGuests = weddings.filter(wedding => wedding.guest_count !== null);
      const averageWeddingSize = weddingsWithGuests.length > 0
        ? weddingsWithGuests.reduce((sum, wedding) => sum + (wedding.guest_count || 0), 0) / weddingsWithGuests.length
        : 0;
      
      // Get upcoming weddings count
      const today = new Date().toISOString();
      const { count: upcomingWeddings, error: upcomingWeddingsError } = await supabase
        .from('weddings')
        .select('*', { count: 'exact', head: true })
        .gte('date', today);
      
      if (upcomingWeddingsError) throw upcomingWeddingsError;
      
      // Get popular features
      // This is a simplified example - in a real application, you would track feature usage
      const popularFeatures = [
        { feature: 'Table Planner', usageCount: 85 },
        { feature: 'Guest Management', usageCount: 92 },
        { feature: 'Budget Planner', usageCount: 78 },
        { feature: 'Music Voting', usageCount: 65 }
      ];
      
      return {
        totalCouples: totalCouples || 0,
        activeCouples: activeCouples || 0,
        totalRevenue,
        revenueThisMonth,
        averageWeddingSize,
        upcomingWeddings: upcomingWeddings || 0,
        popularFeatures
      } as DashboardStats;
    } catch (error) {
      console.error('Error getting dashboard stats:', error);
      throw error;
    }
  }
};

// No-code page builder services
export const noCodeService = {
  // Get all pages
  getAllPages: async () => {
    try {
      const { data, error } = await supabase
        .from('no_code_pages')
        .select('*')
        .order('updated_at', { ascending: false });
      
      if (error) throw error;
      return data as NoCodePage[];
    } catch (error) {
      console.error('Error getting all pages:', error);
      throw error;
    }
  },
  
  // Get page by ID
  getPageById: async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('no_code_pages')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data as NoCodePage;
    } catch (error) {
      console.error('Error getting page by ID:', error);
      throw error;
    }
  },
  
  // Create page
  createPage: async (pageData: Omit<NoCodePage, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const { data, error } = await supabase
        .from('no_code_pages')
        .insert([pageData])
        .select();
      
      if (error) throw error;
      return data[0] as NoCodePage;
    } catch (error) {
      console.error('Error creating page:', error);
      throw error;
    }
  },
  
  // Update page
  updatePage: async (id: string, pageData: Partial<NoCodePage>) => {
    try {
      const { data, error } = await supabase
        .from('no_code_pages')
        .update(pageData)
        .eq('id', id)
        .select();
      
      if (error) throw error;
      return data[0] as NoCodePage;
    } catch (error) {
      console.error('Error updating page:', error);
      throw error;
    }
  },
  
  // Delete page
  deletePage: async (id: string) => {
    try {
      const { error } = await supabase
        .from('no_code_pages')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    } catch (error) {
      console.error('Error deleting page:', error);
      throw error;
    }
  },
  
  // Get all templates
  getAllTemplates: async () => {
    try {
      const { data, error } = await supabase
        .from('no_code_templates')
        .select('*');
      
      if (error) throw error;
      return data as NoCodeTemplate[];
    } catch (error) {
      console.error('Error getting all templates:', error);
      throw error;
    }
  },
  
  // Get all components
  getAllComponents: async () => {
    try {
      const { data, error } = await supabase
        .from('no_code_components')
        .select('*');
      
      if (error) throw error;
      return data as NoCodeComponent[];
    } catch (error) {
      console.error('Error getting all components:', error);
      throw error;
    }
  }
};

// Notification services
export const notificationService = {
  // Get notifications for admin
  getAdminNotifications: async () => {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .is('couple_id', null)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Notification[];
    } catch (error) {
      console.error('Error getting admin notifications:', error);
      throw error;
    }
  },
  
  // Mark notification as read
  markNotificationAsRead: async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', id)
        .select();
      
      if (error) throw error;
      return data[0] as Notification;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  },
  
  // Create notification
  createNotification: async (notificationData: Omit<Notification, 'id' | 'isRead' | 'createdAt' | 'updatedAt'>) => {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .insert([{
          ...notificationData,
          is_read: false
        }])
        .select();
      
      if (error) throw error;
      return data[0] as Notification;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  }
};

// Support ticket services
export const supportTicketService = {
  // Get all support tickets
  getAllSupportTickets: async () => {
    try {
      const { data, error } = await supabase
        .from('support_tickets')
        .select(`
          *,
          users (
            first_name,
            last_name,
            email
          ),
          support_messages (*)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as SupportTicket[];
    } catch (error) {
      console.error('Error getting all support tickets:', error);
      throw error;
    }
  },
  
  // Get support ticket by ID
  getSupportTicketById: async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('support_tickets')
        .select(`
          *,
          users (
            first_name,
            last_name,
            email
          ),
          support_messages (*)
        `)
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data as SupportTicket;
    } catch (error) {
      console.error('Error getting support ticket by ID:', error);
      throw error;
    }
  },
  
  // Update support ticket
  updateSupportTicket: async (id: string, ticketData: Partial<SupportTicket>) => {
    try {
      const { data, error } = await supabase
        .from('support_tickets')
        .update(ticketData)
        .eq('id', id)
        .select();
      
      if (error) throw error;
      return data[0] as SupportTicket;
    } catch (error) {
      console.error('Error updating support ticket:', error);
      throw error;
    }
  },
  
  // Add message to support ticket
  addMessageToTicket: async (ticketId: string, userId: string, message: string, attachments: string[] = []) => {
    try {
      const { data, error } = await supabase
        .from('support_messages')
        .insert([{
          ticket_id: ticketId,
          user_id: userId,
          message,
          attachments
        }])
        .select();
      
      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error('Error adding message to support ticket:', error);
      throw error;
    }
  }
};

// Activity log services
export const activityLogService = {
  // Get activity logs
  getActivityLogs: async (limit: number = 100) => {
    try {
      const { data, error } = await supabase
        .from('activity_logs')
        .select(`
          *,
          users (
            first_name,
            last_name,
            email
          )
        `)
        .order('created_at', { ascending: false })
        .limit(limit);
      
      if (error) throw error;
      return data as ActivityLog[];
    } catch (error) {
      console.error('Error getting activity logs:', error);
      throw error;
    }
  },
  
  // Create activity log
  createActivityLog: async (logData: Omit<ActivityLog, 'id' | 'createdAt'>) => {
    try {
      const { data, error } = await supabase
        .from('activity_logs')
        .insert([logData])
        .select();
      
      if (error) throw error;
      return data[0] as ActivityLog;
    } catch (error) {
      console.error('Error creating activity log:', error);
      throw error;
    }
  }
};

export default {
  adminAuthService,
  adminCoupleService,
  adminWeddingService,
  packageService,
  transactionService,
  systemSettingsService,
  dashboardStatsService,
  noCodeService,
  notificationService,
  supportTicketService,
  activityLogService
};
