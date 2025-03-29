export interface Guest {
  id: string;
  name: string;
  email: string; // Not nullable to match the error message requirements
  phone?: string;
  status: 'pending' | 'confirmed' | 'declined';
  plusOne: boolean;
  dietaryRestrictions?: string;
  tableId?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface GuestFormData {
  name: string;
  email: string;
  phone?: string;
  status: 'pending' | 'confirmed' | 'declined';
  plusOne: boolean;
  dietaryRestrictions?: string;
  tableId?: string;
  notes?: string;
}
