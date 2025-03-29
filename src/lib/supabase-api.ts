import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://jodqliylhmwgpurfzxm.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpvZHFsaXlsaG13Z3B1cmZ6eG0iLCJyb2xlIjoiYW5vbiIsImlhdCI6MTcxNjIxNmpvZHFsaXlsaG13Z3B1cmZ6eG0iLCJleHAiOjE3MTYyMTZJmpvZHFsaXlsaG13Z3B1cmZ6eG0ifQ.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpvZHFsaXlsaG13Z3B1cmZ6eG0iLCJyb2xlIjoiYW5vbiIsImlhdCI6MTcxNjIxNmpvZHFsaXlsaG13Z3B1cmZ6eG0iLCJleHAiOjE3MTYyMTZJmpvZHFsaXlsaG13Z3B1cmZ6eG0ifQ';

// Initialize Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Demo API for development and testing
export const demoApi = {
  // Guest Management
  guests: {
    getAll: async () => {
      try {
        // For demo purposes, return mock data
        return {
          data: [
            {
              id: '1',
              firstName: 'Max',
              lastName: 'Mustermann',
              email: 'max@example.com',
              phone: '+49123456789',
              rsvpStatus: 'confirmed',
              dietaryRestrictions: ['vegetarian'],
              plusOne: true,
              notes: 'Allergic to nuts',
              tableAssignment: 'Table 1',
              group: 'Family',
            },
            {
              id: '2',
              firstName: 'Anna',
              lastName: 'Schmidt',
              email: 'anna@example.com',
              phone: '+49987654321',
              rsvpStatus: 'pending',
              dietaryRestrictions: [],
              plusOne: false,
              notes: '',
              tableAssignment: null,
              group: 'Friends',
            },
            {
              id: '3',
              firstName: 'Thomas',
              lastName: 'Müller',
              email: 'thomas@example.com',
              phone: '+49123123123',
              rsvpStatus: 'declined',
              dietaryRestrictions: ['gluten-free'],
              plusOne: false,
              notes: 'Cannot attend due to prior commitment',
              tableAssignment: null,
              group: 'Colleagues',
            },
          ],
          error: null,
        };
      } catch (error) {
        return { data: null, error };
      }
    },
    create: async (guest) => {
      try {
        // For demo purposes, just return the guest with a new ID
        return {
          data: { ...guest, id: Date.now().toString() },
          error: null,
        };
      } catch (error) {
        return { data: null, error };
      }
    },
    update: async (id, updates) => {
      try {
        // For demo purposes, just return the updated guest
        return {
          data: { id, ...updates },
          error: null,
        };
      } catch (error) {
        return { data: null, error };
      }
    },
    delete: async (id) => {
      try {
        // For demo purposes, just return success
        return {
          data: { id },
          error: null,
        };
      } catch (error) {
        return { data: null, error };
      }
    },
  },

  // Table Planner
  tables: {
    getAll: async () => {
      try {
        // For demo purposes, return mock data
        return {
          data: [
            {
              id: 'table1',
              type: 'round',
              seats: 8,
              position: { x: 200, y: 200 },
              name: 'Tisch 1',
            },
            {
              id: 'table2',
              type: 'rectangular',
              seats: 6,
              position: { x: 500, y: 200 },
              name: 'Tisch 2',
            },
            {
              id: 'table3',
              type: 'oval',
              seats: 10,
              position: { x: 350, y: 400 },
              name: 'Tisch 3',
            },
          ],
          error: null,
        };
      } catch (error) {
        return { data: null, error };
      }
    },
    create: async (table) => {
      try {
        // For demo purposes, just return the table with a new ID
        return {
          data: { ...table, id: `table${Date.now()}` },
          error: null,
        };
      } catch (error) {
        return { data: null, error };
      }
    },
    update: async (id, updates) => {
      try {
        // For demo purposes, just return the updated table
        return {
          data: { id, ...updates },
          error: null,
        };
      } catch (error) {
        return { data: null, error };
      }
    },
    delete: async (id) => {
      try {
        // For demo purposes, just return success
        return {
          data: { id },
          error: null,
        };
      } catch (error) {
        return { data: null, error };
      }
    },
  },

  // Budget Planner
  budget: {
    getItems: async () => {
      try {
        // For demo purposes, return mock data
        return {
          data: [
            {
              id: '1',
              category: 'Venue',
              description: 'Wedding Venue',
              estimatedCost: 5000,
              actualCost: 5500,
              paid: 2000,
              dueDate: '2025-05-01',
              notes: 'Deposit paid',
              status: 'in-progress',
            },
            {
              id: '2',
              category: 'Catering',
              description: 'Wedding Dinner',
              estimatedCost: 3000,
              actualCost: 3200,
              paid: 1000,
              dueDate: '2025-05-15',
              notes: 'Deposit paid',
              status: 'in-progress',
            },
            {
              id: '3',
              category: 'Photography',
              description: 'Photographer',
              estimatedCost: 1500,
              actualCost: 1500,
              paid: 500,
              dueDate: '2025-04-01',
              notes: 'Deposit paid',
              status: 'in-progress',
            },
          ],
          error: null,
        };
      } catch (error) {
        return { data: null, error };
      }
    },
    addItem: async (item) => {
      try {
        // For demo purposes, just return the item with a new ID
        return {
          data: { ...item, id: Date.now().toString() },
          error: null,
        };
      } catch (error) {
        return { data: null, error };
      }
    },
    updateItem: async (id, updates) => {
      try {
        // For demo purposes, just return the updated item
        return {
          data: { id, ...updates },
          error: null,
        };
      } catch (error) {
        return { data: null, error };
      }
    },
    deleteItem: async (id) => {
      try {
        // For demo purposes, just return success
        return {
          data: { id },
          error: null,
        };
      } catch (error) {
        return { data: null, error };
      }
    },
  },

  // Checklists
  checklists: {
    getItems: async () => {
      try {
        // For demo purposes, return mock data
        return {
          data: [
            {
              id: '1',
              title: 'Location buchen',
              description: 'Vertrag mit Schloss Elmau unterschreiben und anzahlen',
              dueDate: '2024-12-15',
              completed: true,
              priority: 'high',
              assignedTo: 'Braut',
              category: 'Venue',
            },
            {
              id: '2',
              title: 'Fotografen buchen',
              description: 'Angebote von drei verschiedenen Fotografen einholen und vergleichen',
              dueDate: '2025-02-01',
              completed: false,
              priority: 'medium',
              assignedTo: 'Bräutigam',
              category: 'Vendors',
            },
            {
              id: '3',
              title: 'Einladungen versenden',
              description: 'Einladungen gestalten, drucken und an alle Gäste versenden',
              dueDate: '2025-03-15',
              completed: false,
              priority: 'low',
              assignedTo: 'Beide',
              category: 'Invitations',
            },
          ],
          error: null,
        };
      } catch (error) {
        return { data: null, error };
      }
    },
    addItem: async (item) => {
      try {
        // For demo purposes, just return the item with a new ID
        return {
          data: { ...item, id: Date.now().toString() },
          error: null,
        };
      } catch (error) {
        return { data: null, error };
      }
    },
    updateItem: async (id, updates) => {
      try {
        // For demo purposes, just return the updated item
        return {
          data: { id, ...updates },
          error: null,
        };
      } catch (error) {
        return { data: null, error };
      }
    },
    deleteItem: async (id) => {
      try {
        // For demo purposes, just return success
        return {
          data: { id },
          error: null,
        };
      } catch (error) {
        return { data: null, error };
      }
    },
  },

  // Music Voting
  music: {
    getSongs: async () => {
      try {
        // For demo purposes, return mock data
        return {
          data: [
            {
              id: '1',
              title: 'Dancing Queen',
              artist: 'ABBA',
              votes: 24,
              addedBy: 'Braut',
              addedAt: '2025-01-15',
            },
            {
              id: '2',
              title: 'I Gotta Feeling',
              artist: 'Black Eyed Peas',
              votes: 18,
              addedBy: 'Bräutigam',
              addedAt: '2025-01-16',
            },
            {
              id: '3',
              title: 'Shut Up and Dance',
              artist: 'WALK THE MOON',
              votes: 15,
              addedBy: 'Gast',
              addedAt: '2025-01-17',
            },
            {
              id: '4',
              title: "Don't Stop Me Now",
              artist: 'Queen',
              votes: 12,
              addedBy: 'Gast',
              addedAt: '2025-01-18',
            },
            {
              id: '5',
              title: 'Uptown Funk',
              artist: 'Mark Ronson ft. Bruno Mars',
              votes: 10,
              addedBy: 'Gast',
              addedAt: '2025-01-19',
            },
          ],
          error: null,
        };
      } catch (error) {
        return { data: null, error };
      }
    },
    addSong: async (song) => {
      try {
        // For demo purposes, just return the song with a new ID
        return {
          data: { ...song, id: Date.now().toString(), votes: 0, addedAt: new Date().toISOString() },
          error: null,
        };
      } catch (error) {
        return { data: null, error };
      }
    },
    voteSong: async (id, increment = true) => {
      try {
        // For demo purposes, just return success
        return {
          data: { id, success: true },
          error: null,
        };
      } catch (error) {
        return { data: null, error };
      }
    },
    deleteSong: async (id) => {
      try {
        // For demo purposes, just return success
        return {
          data: { id },
          error: null,
        };
      } catch (error) {
        return { data: null, error };
      }
    },
  },

  // Couple Management
  couples: {
    getDetails: async () => {
      try {
        // For demo purposes, return mock data
        return {
          data: {
            id: '1',
            weddingName: 'Anna & Thomas',
            weddingDate: '2025-06-15',
            location: 'Schloss Elmau, Bayern',
            primaryColor: '#ffbd00',
            secondaryColor: '#ffffff',
            accentColor: '#333333',
            websiteEnabled: true,
            musicVotingEnabled: true,
            tablePlannerEnabled: true,
            guestListEnabled: true,
            budgetEnabled: true,
            checklistEnabled: true,
          },
          error: null,
        };
      } catch (error) {
        return { data: null, error };
      }
    },
    updateDetails: async (updates) => {
      try {
        // For demo purposes, just return the updated details
        return {
          data: { id: '1', ...updates },
          error: null,
        };
      } catch (error) {
        return { data: null, error };
      }
    },
  },

  // Authentication
  auth: {
    signIn: async (email, password) => {
      try {
        // For demo purposes, just return success if email and password are provided
        if (email && password) {
          return {
            data: {
              user: {
                id: '1',
                email,
                role: 'couple',
              },
              session: {
                token: 'demo-token',
              },
            },
            error: null,
          };
        } else {
          return {
            data: null,
            error: 'Invalid email or password',
          };
        }
      } catch (error) {
        return { data: null, error };
      }
    },
    signUp: async (email, password) => {
      try {
        // For demo purposes, just return success if email and password are provided
        if (email && password) {
          return {
            data: {
              user: {
                id: Date.now().toString(),
                email,
                role: 'couple',
              },
              session: {
                token: 'demo-token',
              },
            },
            error: null,
          };
        } else {
          return {
            data: null,
            error: 'Invalid email or password',
          };
        }
      } catch (error) {
        return { data: null, error };
      }
    },
    signOut: async () => {
      try {
        // For demo purposes, just return success
        return {
          data: { success: true },
          error: null,
        };
      } catch (error) {
        return { data: null, error };
      }
    },
    resetPassword: async (email) => {
      try {
        // For demo purposes, just return success if email is provided
        if (email) {
          return {
            data: { success: true },
            error: null,
          };
        } else {
          return {
            data: null,
            error: 'Invalid email',
          };
        }
      } catch (error) {
        return { data: null, error };
      }
    },
  },
};

// Production API for real data
export const api = {
  // Guest Management
  guests: {
    getAll: async () => {
      try {
        const { data, error } = await supabase.from('guests').select('*');
        return { data, error };
      } catch (error) {
        return { data: null, error };
      }
    },
    create: async (guest) => {
      try {
        const { data, error } = await supabase.from('guests').insert([guest]).select();
        return { data: data?.[0] || null, error };
      } catch (error) {
        return { data: null, error };
      }
    },
    update: async (id, updates) => {
      try {
        const { data, error } = await supabase
          .from('guests')
          .update(updates)
          .eq('id', id)
          .select();
        return { data: data?.[0] || null, error };
      } catch (error) {
        return { data: null, error };
      }
    },
    delete: async (id) => {
      try {
        const { data, error } = await supabase.from('guests').delete().eq('id', id);
        return { data, error };
      } catch (error) {
        return { data: null, error };
      }
    },
  },

  // Table Planner
  tables: {
    getAll: async () => {
      try {
        const { data, error } = await supabase.from('tables').select('*');
        return { data, error };
      } catch (error) {
        return { data: null, error };
      }
    },
    create: async (table) => {
      try {
        const { data, error } = await supabase.from('tables').insert([table]).select();
        return { data: data?.[0] || null, error };
      } catch (error) {
        return { data: null, error };
      }
    },
    update: async (id, updates) => {
      try {
        const { data, error } = await supabase
          .from('tables')
          .update(updates)
          .eq('id', id)
          .select();
        return { data: data?.[0] || null, error };
      } catch (error) {
        return { data: null, error };
      }
    },
    delete: async (id) => {
      try {
        const { data, error } = await supabase.from('tables').delete().eq('id', id);
        return { data, error };
      } catch (error) {
        return { data: null, error };
      }
    },
  },

  // Budget Planner
  budget: {
    getItems: async () => {
      try {
        const { data, error } = await supabase.from('budget_items').select('*');
        return { data, error };
      } catch (error) {
        return { data: null, error };
      }
    },
    addItem: async (item) => {
      try {
        const { data, error } = await supabase.from('budget_items').insert([item]).select();
        return { data: data?.[0] || null, error };
      } catch (error) {
        return { data: null, error };
      }
    },
    updateItem: async (id, updates) => {
      try {
        const { data, error } = await supabase
          .from('budget_items')
          .update(updates)
          .eq('id', id)
          .select();
        return { data: data?.[0] || null, error };
      } catch (error) {
        return { data: null, error };
      }
    },
    deleteItem: async (id) => {
      try {
        const { data, error } = await supabase.from('budget_items').delete().eq('id', id);
        return { data, error };
      } catch (error) {
        return { data: null, error };
      }
    },
  },

  // Checklists
  checklists: {
    getItems: async () => {
      try {
        const { data, error } = await supabase.from('checklist_items').select('*');
        return { data, error };
      } catch (error) {
        return { data: null, error };
      }
    },
    addItem: async (item) => {
      try {
        const { data, error } = await supabase.from('checklist_items').insert([item]).select();
        return { data: data?.[0] || null, error };
      } catch (error) {
        return { data: null, error };
      }
    },
    updateItem: async (id, updates) => {
      try {
        const { data, error } = await supabase
          .from('checklist_items')
          .update(updates)
          .eq('id', id)
          .select();
        return { data: data?.[0] || null, error };
      } catch (error) {
        return { data: null, error };
      }
    },
    deleteItem: async (id) => {
      try {
        const { data, error } = await supabase.from('checklist_items').delete().eq('id', id);
        return { data, error };
      } catch (error) {
        return { data: null, error };
      }
    },
  },

  // Music Voting
  music: {
    getSongs: async () => {
      try {
        const { data, error } = await supabase.from('songs').select('*');
        return { data, error };
      } catch (error) {
        return { data: null, error };
      }
    },
    addSong: async (song) => {
      try {
        const { data, error } = await supabase.from('songs').insert([song]).select();
        return { data: data?.[0] || null, error };
      } catch (error) {
        return { data: null, error };
      }
    },
    voteSong: async (id, increment = true) => {
      try {
        // Get current votes
        const { data: currentData } = await supabase.from('songs').select('votes').eq('id', id).single();
        const currentVotes = currentData?.votes || 0;
        
        // Update votes
        const newVotes = increment ? currentVotes + 1 : Math.max(0, currentVotes - 1);
        
        const { data, error } = await supabase
          .from('songs')
          .update({ votes: newVotes })
          .eq('id', id)
          .select();
        
        return { data: data?.[0] || null, error };
      } catch (error) {
        return { data: null, error };
      }
    },
    deleteSong: async (id) => {
      try {
        const { data, error } = await supabase.from('songs').delete().eq('id', id);
        return { data, error };
      } catch (error) {
        return { data: null, error };
      }
    },
  },

  // Couple Management
  couples: {
    getDetails: async () => {
      try {
        const { data, error } = await supabase.from('couples').select('*').single();
        return { data, error };
      } catch (error) {
        return { data: null, error };
      }
    },
    updateDetails: async (updates) => {
      try {
        const { data, error } = await supabase
          .from('couples')
          .update(updates)
          .eq('id', updates.id)
          .select();
        return { data: data?.[0] || null, error };
      } catch (error) {
        return { data: null, error };
      }
    },
  },

  // Authentication (using Supabase Auth)
  auth: {
    signIn: async (email, password) => {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        return { data, error };
      } catch (error) {
        return { data: null, error };
      }
    },
    signUp: async (email, password) => {
      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });
        return { data, error };
      } catch (error) {
        return { data: null, error };
      }
    },
    signOut: async () => {
      try {
        const { error } = await supabase.auth.signOut();
        return { data: { success: !error }, error };
      } catch (error) {
        return { data: null, error };
      }
    },
    resetPassword: async (email) => {
      try {
        const { data, error } = await supabase.auth.resetPasswordForEmail(email);
        return { data, error };
      } catch (error) {
        return { data: null, error };
      }
    },
  },
};

// Use demo API for development and testing
export default process.env.NODE_ENV === 'production' ? api : demoApi;
