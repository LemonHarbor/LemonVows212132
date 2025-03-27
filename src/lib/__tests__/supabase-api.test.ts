import { render, screen } from '@testing-library/react';
import { supabase } from '@/lib/supabase-api';

// Mock the Supabase client
jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => ({
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn(() => Promise.resolve({ data: null, error: null }))
        }))
      }))
    })),
    auth: {
      signUp: jest.fn(),
      signInWithPassword: jest.fn(),
      signOut: jest.fn(),
      getUser: jest.fn(),
      getSession: jest.fn(),
    }
  }))
}));

describe('Supabase API Integration', () => {
  test('supabase client is initialized', () => {
    expect(supabase).toBeDefined();
  });

  test('auth methods are available', () => {
    expect(supabase.auth.signUp).toBeDefined();
    expect(supabase.auth.signInWithPassword).toBeDefined();
    expect(supabase.auth.signOut).toBeDefined();
    expect(supabase.auth.getUser).toBeDefined();
    expect(supabase.auth.getSession).toBeDefined();
  });

  test('database methods are available', () => {
    expect(supabase.from).toBeDefined();
  });
});
