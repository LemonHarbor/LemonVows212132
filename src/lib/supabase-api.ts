import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase URL or Anon Key is missing. Please check your environment variables.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Authentifizierungsfunktionen
export const auth = {
  // Registrierung mit E-Mail und Passwort
  signUp: async (email: string, password: string, userData: any) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData,
      },
    });
    return { data, error };
  },

  // Anmeldung mit E-Mail und Passwort
  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  },

  // Abmeldung
  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  // Aktuellen Benutzer abrufen
  getCurrentUser: async () => {
    const { data, error } = await supabase.auth.getUser();
    return { data, error };
  },

  // Sitzung abrufen
  getSession: async () => {
    const { data, error } = await supabase.auth.getSession();
    return { data, error };
  },

  // Passwort zurücksetzen
  resetPassword: async (email: string) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    return { data, error };
  },

  // Passwort aktualisieren
  updatePassword: async (newPassword: string) => {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    return { data, error };
  },
};

// Benutzer-API
export const usersApi = {
  // Benutzer abrufen
  getUser: async (userId: string) => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();
    return { data, error };
  },

  // Benutzer aktualisieren
  updateUser: async (userId: string, userData: any) => {
    const { data, error } = await supabase
      .from('users')
      .update(userData)
      .eq('id', userId);
    return { data, error };
  },

  // Alle Benutzer abrufen (nur für Admins)
  getAllUsers: async () => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });
    return { data, error };
  },

  // Benutzer löschen
  deleteUser: async (userId: string) => {
    const { data, error } = await supabase
      .from('users')
      .delete()
      .eq('id', userId);
    return { data, error };
  },
};

// Hochzeits-API
export const weddingsApi = {
  // Hochzeit erstellen
  createWedding: async (weddingData: any) => {
    const { data, error } = await supabase
      .from('weddings')
      .insert([weddingData])
      .select();
    return { data, error };
  },

  // Hochzeit abrufen
  getWedding: async (weddingId: string) => {
    const { data, error } = await supabase
      .from('weddings')
      .select('*')
      .eq('id', weddingId)
      .single();
    return { data, error };
  },

  // Hochzeit aktualisieren
  updateWedding: async (weddingId: string, weddingData: any) => {
    const { data, error } = await supabase
      .from('weddings')
      .update(weddingData)
      .eq('id', weddingId);
    return { data, error };
  },

  // Hochzeit löschen
  deleteWedding: async (weddingId: string) => {
    const { data, error } = await supabase
      .from('weddings')
      .delete()
      .eq('id', weddingId);
    return { data, error };
  },

  // Hochzeiten eines Benutzers abrufen
  getUserWeddings: async (userId: string) => {
    const { data, error } = await supabase
      .from('weddings')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: true });
    return { data, error };
  },

  // Alle Hochzeiten abrufen (nur für Admins)
  getAllWeddings: async () => {
    const { data, error } = await supabase
      .from('weddings')
      .select('*')
      .order('date', { ascending: true });
    return { data, error };
  },
};

// Gäste-API
export const guestsApi = {
  // Gast erstellen
  createGuest: async (guestData: any) => {
    const { data, error } = await supabase
      .from('guests')
      .insert([guestData])
      .select();
    return { data, error };
  },

  // Gast abrufen
  getGuest: async (guestId: string) => {
    const { data, error } = await supabase
      .from('guests')
      .select('*')
      .eq('id', guestId)
      .single();
    return { data, error };
  },

  // Gast aktualisieren
  updateGuest: async (guestId: string, guestData: any) => {
    const { data, error } = await supabase
      .from('guests')
      .update(guestData)
      .eq('id', guestId);
    return { data, error };
  },

  // Gast löschen
  deleteGuest: async (guestId: string) => {
    const { data, error } = await supabase
      .from('guests')
      .delete()
      .eq('id', guestId);
    return { data, error };
  },

  // Gäste einer Hochzeit abrufen
  getWeddingGuests: async (weddingId: string) => {
    const { data, error } = await supabase
      .from('guests')
      .select('*')
      .eq('wedding_id', weddingId)
      .order('last_name', { ascending: true });
    return { data, error };
  },

  // RSVP-Status aktualisieren
  updateRsvpStatus: async (guestId: string, rsvpStatus: string) => {
    const { data, error } = await supabase
      .from('guests')
      .update({ rsvp_status: rsvpStatus })
      .eq('id', guestId);
    return { data, error };
  },
};

// Tisch-API
export const tablesApi = {
  // Tisch erstellen
  createTable: async (tableData: any) => {
    const { data, error } = await supabase
      .from('tables')
      .insert([tableData])
      .select();
    return { data, error };
  },

  // Tisch abrufen
  getTable: async (tableId: string) => {
    const { data, error } = await supabase
      .from('tables')
      .select('*')
      .eq('id', tableId)
      .single();
    return { data, error };
  },

  // Tisch aktualisieren
  updateTable: async (tableId: string, tableData: any) => {
    const { data, error } = await supabase
      .from('tables')
      .update(tableData)
      .eq('id', tableId);
    return { data, error };
  },

  // Tisch löschen
  deleteTable: async (tableId: string) => {
    const { data, error } = await supabase
      .from('tables')
      .delete()
      .eq('id', tableId);
    return { data, error };
  },

  // Tische einer Hochzeit abrufen
  getWeddingTables: async (weddingId: string) => {
    const { data, error } = await supabase
      .from('tables')
      .select('*')
      .eq('wedding_id', weddingId);
    return { data, error };
  },
};

// Sitzplatz-API
export const seatsApi = {
  // Sitzplatz erstellen
  createSeat: async (seatData: any) => {
    const { data, error } = await supabase
      .from('seats')
      .insert([seatData])
      .select();
    return { data, error };
  },

  // Sitzplatz aktualisieren
  updateSeat: async (seatId: string, seatData: any) => {
    const { data, error } = await supabase
      .from('seats')
      .update(seatData)
      .eq('id', seatId);
    return { data, error };
  },

  // Sitzplatz löschen
  deleteSeat: async (seatId: string) => {
    const { data, error } = await supabase
      .from('seats')
      .delete()
      .eq('id', seatId);
    return { data, error };
  },

  // Sitzplätze eines Tisches abrufen
  getTableSeats: async (tableId: string) => {
    const { data, error } = await supabase
      .from('seats')
      .select('*, guests(*)')
      .eq('table_id', tableId)
      .order('position', { ascending: true });
    return { data, error };
  },

  // Gast einem Sitzplatz zuweisen
  assignGuestToSeat: async (seatId: string, guestId: string) => {
    const { data, error } = await supabase
      .from('seats')
      .update({ guest_id: guestId })
      .eq('id', seatId);
    return { data, error };
  },

  // Gast von einem Sitzplatz entfernen
  removeGuestFromSeat: async (seatId: string) => {
    const { data, error } = await supabase
      .from('seats')
      .update({ guest_id: null })
      .eq('id', seatId);
    return { data, error };
  },
};

// Budget-API
export const budgetApi = {
  // Kategorie erstellen
  createCategory: async (categoryData: any) => {
    const { data, error } = await supabase
      .from('budget_categories')
      .insert([categoryData])
      .select();
    return { data, error };
  },

  // Kategorie aktualisieren
  updateCategory: async (categoryId: string, categoryData: any) => {
    const { data, error } = await supabase
      .from('budget_categories')
      .update(categoryData)
      .eq('id', categoryId);
    return { data, error };
  },

  // Kategorie löschen
  deleteCategory: async (categoryId: string) => {
    const { data, error } = await supabase
      .from('budget_categories')
      .delete()
      .eq('id', categoryId);
    return { data, error };
  },

  // Kategorien einer Hochzeit abrufen
  getWeddingCategories: async (weddingId: string) => {
    const { data, error } = await supabase
      .from('budget_categories')
      .select('*')
      .eq('wedding_id', weddingId);
    return { data, error };
  },

  // Ausgabe erstellen
  createExpense: async (expenseData: any) => {
    const { data, error } = await supabase
      .from('budget_expenses')
      .insert([expenseData])
      .select();
    return { data, error };
  },

  // Ausgabe aktualisieren
  updateExpense: async (expenseId: string, expenseData: any) => {
    const { data, error } = await supabase
      .from('budget_expenses')
      .update(expenseData)
      .eq('id', expenseId);
    return { data, error };
  },

  // Ausgabe löschen
  deleteExpense: async (expenseId: string) => {
    const { data, error } = await supabase
      .from('budget_expenses')
      .delete()
      .eq('id', expenseId);
    return { data, error };
  },

  // Ausgaben einer Kategorie abrufen
  getCategoryExpenses: async (categoryId: string) => {
    const { data, error } = await supabase
      .from('budget_expenses')
      .select('*')
      .eq('category_id', categoryId)
      .order('date', { ascending: false });
    return { data, error };
  },

  // Alle Ausgaben einer Hochzeit abrufen
  getWeddingExpenses: async (weddingId: string) => {
    const { data, error } = await supabase
      .from('budget_expenses')
      .select('*, budget_categories!inner(*)')
      .eq('budget_categories.wedding_id', weddingId)
      .order('date', { ascending: false });
    return { data, error };
  },
};

// Moodboard-API
export const moodboardApi = {
  // Sammlung erstellen
  createCollection: async (collectionData: any) => {
    const { data, error } = await supabase
      .from('moodboard_collections')
      .insert([collectionData])
      .select();
    return { data, error };
  },

  // Sammlung aktualisieren
  updateCollection: async (collectionId: string, collectionData: any) => {
    const { data, error } = await supabase
      .from('moodboard_collections')
      .update(collectionData)
      .eq('id', collectionId);
    return { data, error };
  },

  // Sammlung löschen
  deleteCollection: async (collectionId: string) => {
    const { data, error } = await supabase
      .from('moodboard_collections')
      .delete()
      .eq('id', collectionId);
    return { data, error };
  },

  // Sammlungen einer Hochzeit abrufen
  getWeddingCollections: async (weddingId: string) => {
    const { data, error } = await supabase
      .from('moodboard_collections')
      .select('*')
      .eq('wedding_id', weddingId);
    return { data, error };
  },

  // Element erstellen
  createItem: async (itemData: any) => {
    const { data, error } = await supabase
      .from('moodboard_items')
      .insert([itemData])
      .select();
    return { data, error };
  },

  // Element aktualisieren
  updateItem: async (itemId: string, itemData: any) => {
    const { data, error } = await supabase
      .from('moodboard_items')
      .update(itemData)
      .eq('id', itemId);
    return { data, error };
  },

  // Element löschen
  deleteItem: async (itemId: string) => {
    const { data, error } = await supabase
      .from('moodboard_items')
      .delete()
      .eq('id', itemId);
    return { data, error };
  },

  // Elemente einer Sammlung abrufen
  getCollectionItems: async (collectionId: string) => {
    const { data, error } = await supabase
      .from('moodboard_items')
      .select('*')
      .eq('collection_id', collectionId)
      .order('z_index', { ascending: true });
    return { data, error };
  },
};

// Foto-Galerie-API
export const photoApi = {
  // Album erstellen
  createAlbum: async (albumData: any) => {
    const { data, error } = await supabase
      .from('photo_albums')
      .insert([albumData])
      .select();
    return { data, error };
  },

  // Album aktualisieren
  updateAlbum: async (albumId: string, albumData: any) => {
    const { data, error } = await supabase
      .from('photo_albums')
      .update(albumData)
      .eq('id', albumId);
    return { data, error };
  },

  // Album löschen
  deleteAlbum: async (albumId: string) => {
    const { data, error } = await supabase
      .from('photo_albums')
      .delete()
      .eq('id', albumId);
    return { data, error };
  },

  // Alben einer Hochzeit abrufen
  getWeddingAlbums: async (weddingId: string) => {
    const { data, error } = await supabase
      .from('photo_albums')
      .select('*')
      .eq('wedding_id', weddingId);
    return { data, error };
  },

  // Foto hochladen
  uploadPhoto: async (file: File, path: string) => {
    const { data, error } = await supabase.storage
      .from('photos')
      .upload(path, file);
    return { data, error };
  },

  // Foto-URL abrufen
  getPhotoUrl: async (path: string) => {
    const { data } = supabase.storage
      .from('photos')
      .getPublicUrl(path);
    return data.publicUrl;
  },

  // Foto erstellen
  createPhoto: async (photoData: any) => {
    const { data, error } = await supabase
      .from('photos')
      .insert([photoData])
      .select();
    return { data, error };
  },

  // Foto aktualisieren
  updatePhoto: async (photoId: string, photoData: any) => {
    const { data, error } = await supabase
      .from('photos')
      .update(photoData)
      .eq('id', photoId);
    return { data, error };
  },

  // Foto löschen
  deletePhoto: async (photoId: string, path: string) => {
    // Foto aus der Datenbank löschen
    const { error: dbError } = await supabase
      .from('photos')
      .delete()
      .eq('id', photoId);
    
    // Foto aus dem Speicher löschen
    const { error: storageError } = await supabase.storage
      .from('photos')
      .remove([path]);
    
    return { dbError, storageError };
  },

  // Fotos eines Albums abrufen
  getAlbumPhotos: async (albumId: string) => {
    const { data, error } = await supabase
      .from('photos')
      .select('*')
      .eq('album_id', albumId)
      .order('uploaded_at', { ascending: false });
    return { data, error };
  },

  // Foto liken
  likePhoto: async (photoId: string) => {
    // Zuerst das aktuelle Foto abrufen
    const { data: photo, error: fetchError } = await supabase
      .from('photos')
      .select('likes')
      .eq('id', photoId)
      .single();
    
    if (fetchError) return { data: null, error: fetchError };
    
    // Likes inkrementieren
    const { data, error } = await supabase
      .from('photos')
      .update({ likes: (photo.likes || 0) + 1 })
      .eq('id', photoId);
    
    return { data, error };
  },
};

// Zahlungs-API
export const paymentsApi = {
  // Zahlung erstellen
  createPayment: async (paymentData: any) => {
    const { data, error } = await supabase
      .from('payments')
      .insert([paymentData])
      .select();
    return { data, error };
  },

  // Zahlung abrufen
  getPayment: async (paymentId: string) => {
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .eq('id', paymentId)
      .single();
    return { data, error };
  },

  // Zahlung aktualisieren
  updatePayment: async (paymentId: string, paymentData: any) => {
    const { data, error } = await supabase
      .from('payments')
      .update(paymentData)
      .eq('id', paymentId);
    return { data, error };
  },

  // Zahlungen eines Benutzers abrufen
  getUserPayments: async (userId: string) => {
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false });
    return { data, error };
  },

  // Zahlungen einer Hochzeit abrufen
  getWeddingPayments: async (weddingId: string) => {
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .eq('wedding_id', weddingId)
      .order('date', { ascending: false });
    return { data, error };
  },

  // Alle Zahlungen abrufen (nur für Admins)
  getAllPayments: async () => {
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .order('date', { ascending: false });
    return { data, error };
  },
};

// RSVP-API
export const rsvpApi = {
  // RSVP-Token erstellen
  createRsvpToken: async (guestId: string) => {
    const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30); // Token ist 30 Tage gültig
    
    const { data, error } = await supabase
      .from('rsvp_tokens')
      .insert([{
        guest_id: guestId,
        token,
        expires_at: expiresAt.toISOString(),
      }])
      .select();
    
    return { data, error };
  },

  // RSVP-Token validieren
  validateRsvpToken: async (token: string) => {
    const { data, error } = await supabase
      .from('rsvp_tokens')
      .select('*, guests(*)')
      .eq('token', token)
      .gt('expires_at', new Date().toISOString())
      .single();
    
    return { data, error };
  },

  // RSVP-Status aktualisieren
  updateRsvpStatus: async (guestId: string, rsvpStatus: string, additionalData: any = {}) => {
    const { data, error } = await supabase
      .from('guests')
      .update({
        rsvp_status: rsvpStatus,
        ...additionalData,
        updated_at: new Date().toISOString(),
      })
      .eq('id', guestId);
    
    return { data, error };
  },
};

// Einstellungs-API
export const settingsApi = {
  // Einstellung abrufen
  getSetting: async (key: string) => {
    const { data, error } = await supabase
      .from('settings')
      .select('value')
      .eq('key', key)
      .single();
    
    return { data: data?.value, error };
  },

  // Einstellung aktualisieren oder erstellen
  setSetting: async (key: string, value: any) => {
    // Prüfen, ob die Einstellung bereits existiert
    const { data: existingSetting } = await supabase
      .from('settings')
      .select('id')
      .eq('key', key)
      .single();
    
    if (existingSetting) {
      // Einstellung aktualisieren
      const { data, error } = await supabase
        .from('settings')
        .update({
          value,
          updated_at: new Date().toISOString(),
        })
        .eq('key', key);
      
      return { data, error };
    } else {
      // Neue Einstellung erstellen
      const { data, error } = await supabase
        .from('settings')
        .insert([{
          key,
          value,
        }])
        .select();
      
      return { data, error };
    }
  },

  // Mehrere Einstellungen abrufen
  getSettings: async (keys: string[]) => {
    const { data, error } = await supabase
      .from('settings')
      .select('key, value')
      .in('key', keys);
    
    // Umwandeln in ein Objekt mit key-value Paaren
    const settings = data?.reduce((acc: any, setting) => {
      acc[setting.key] = setting.value;
      return acc;
    }, {});
    
    return { data: settings, error };
  },
};

// Echtzeit-Abonnements
export const realtime = {
  // Gästeänderungen abonnieren
  subscribeToGuests: (weddingId: string, callback: (payload: any) => void) => {
    return supabase
      .channel('guests-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'guests',
          filter: `wedding_id=eq.${weddingId}`,
        },
        callback
      )
      .subscribe();
  },

  // Tischänderungen abonnieren
  subscribeToTables: (weddingId: string, callback: (payload: any) => void) => {
    return supabase
      .channel('tables-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tables',
          filter: `wedding_id=eq.${weddingId}`,
        },
        callback
      )
      .subscribe();
  },

  // Sitzplatzänderungen abonnieren
  subscribeToSeats: (tableIds: string[], callback: (payload: any) => void) => {
    return supabase
      .channel('seats-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'seats',
          filter: `table_id=in.(${tableIds.join(',')})`,
        },
        callback
      )
      .subscribe();
  },

  // Budgetänderungen abonnieren
  subscribeToBudget: (weddingId: string, callback: (payload: any) => void) => {
    return supabase
      .channel('budget-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'budget_categories',
          filter: `wedding_id=eq.${weddingId}`,
        },
        callback
      )
      .subscribe();
  },

  // Fotoänderungen abonnieren
  subscribeToPhotos: (albumIds: string[], callback: (payload: any) => void) => {
    return supabase
      .channel('photos-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'photos',
          filter: `album_id=in.(${albumIds.join(',')})`,
        },
        callback
      )
      .subscribe();
  },
};

export default {
  supabase,
  auth,
  usersApi,
  weddingsApi,
  guestsApi,
  tablesApi,
  seatsApi,
  budgetApi,
  moodboardApi,
  photoApi,
  paymentsApi,
  rsvpApi,
  settingsApi,
  realtime,
};
