import React, { createContext, useContext, useState, useEffect } from 'react';

// Define the user context type
interface UserContextType {
  user: any;
  loading: boolean;
  login: (credentials: { email: string; password: string }) => Promise<{ success: boolean; error?: any }>;
  logout: () => void;
  register: (userData: { name: string; email: string; password: string }) => Promise<{ success: boolean; error?: any }>;
}

// Create a context for user data
const UserContext = createContext<UserContextType | undefined>(undefined);

// Custom hook to use the user context
export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

// Provider component that wraps the app and provides user context
export const LemonVowsUserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Simulated authentication check
  useEffect(() => {
    // This would typically be an API call to check authentication status
    const checkAuth = async () => {
      try {
        // Placeholder for actual authentication logic
        const isLoggedIn = localStorage.getItem('user');
        
        if (isLoggedIn) {
          // Parse stored user data
          setUser(JSON.parse(isLoggedIn));
        }
      } catch (error) {
        console.error('Authentication error:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (credentials: { email: string; password: string }) => {
    // Placeholder for actual login logic
    setLoading(true);
    try {
      // Simulate successful login
      const userData = { 
        id: '123', 
        name: 'Demo User', 
        email: credentials.email,
        role: 'couple'
      };
      
      // Store user data
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      return { success: true };
    } catch (error: any) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  // Register function
  const register = async (userData: { name: string; email: string; password: string }) => {
    // Placeholder for actual registration logic
    setLoading(true);
    try {
      // Simulate successful registration
      const newUser = { 
        id: '123', 
        name: userData.name, 
        email: userData.email,
        role: 'couple'
      };
      
      // Store user data
      localStorage.setItem('user', JSON.stringify(newUser));
      setUser(newUser);
      return { success: true };
    } catch (error: any) {
      console.error('Registration error:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Context value
  const value = {
    user,
    loading,
    login,
    logout,
    register
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};
