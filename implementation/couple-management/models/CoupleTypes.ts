export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'couple' | 'guest';
  createdAt: string;
  updatedAt: string;
}

export interface Couple {
  id: string;
  userId: string;
  partner1FirstName: string;
  partner1LastName: string;
  partner2FirstName: string;
  partner2LastName: string;
  email: string;
  phone?: string;
  packageType: 'basic' | 'premium' | 'deluxe';
  expiryDate: string;
  status: 'active' | 'inactive' | 'suspended';
  createdAt: string;
  updatedAt: string;
}

export interface Wedding {
  id: string;
  coupleId: string;
  date: string;
  location: string;
  venue: string;
  theme?: string;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  guestCount?: number;
  websiteEnabled: boolean;
  websiteUrl?: string;
  websiteTheme?: 'classic' | 'modern' | 'rustic' | 'romantic' | 'minimal';
  musicVotingEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Guest {
  id: string;
  weddingId: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  rsvpStatus: 'pending' | 'confirmed' | 'declined';
  dietaryRestrictions?: string[];
  plusOne: boolean;
  tableId?: string;
  seatIndex?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Table {
  id: string;
  weddingId: string;
  name: string;
  type: 'round' | 'rectangular' | 'oval';
  seats: number;
  position: {
    x: number;
    y: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Song {
  id: string;
  weddingId: string;
  title: string;
  artist: string;
  votes: number;
  addedBy?: string;
  inPlaylist: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BudgetCategory {
  id: string;
  weddingId: string;
  name: string;
  plannedAmount: number;
  actualAmount: number;
  items: BudgetItem[];
  createdAt: string;
  updatedAt: string;
}

export interface BudgetItem {
  id: string;
  categoryId: string;
  name: string;
  plannedAmount: number;
  actualAmount: number;
  paid: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChecklistCategory {
  id: string;
  weddingId: string;
  name: string;
  description?: string;
  checklists: Checklist[];
  createdAt: string;
  updatedAt: string;
}

export interface Checklist {
  id: string;
  categoryId: string;
  name: string;
  description?: string;
  dueDate?: string;
  items: ChecklistItem[];
  createdAt: string;
  updatedAt: string;
}

export interface ChecklistItem {
  id: string;
  checklistId: string;
  text: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  assignedTo?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InternalTeamMember {
  id: string;
  weddingId: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  role: 'bestMan' | 'bridesmaid' | 'parent' | 'other';
  tasks: InternalTask[];
  createdAt: string;
  updatedAt: string;
}

export interface InternalTask {
  id: string;
  weddingId: string;
  assignedToId?: string;
  name: string;
  description?: string;
  dueDate?: string;
  status: 'notStarted' | 'inProgress' | 'completed';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WeddingWebsite {
  id: string;
  weddingId: string;
  theme: 'classic' | 'modern' | 'rustic' | 'romantic' | 'minimal';
  url: string;
  published: boolean;
  sections: WebsiteSection[];
  createdAt: string;
  updatedAt: string;
}

export interface WebsiteSection {
  id: string;
  websiteId: string;
  type: 'hero' | 'story' | 'details' | 'gallery' | 'rsvp' | 'registry' | 'accommodations' | 'faq' | 'contact';
  title: string;
  content: any; // This will be different based on section type
  order: number;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}
