import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // Get initial theme from local storage or system preference
  const getInitialTheme = (): Theme => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme') as Theme | null;
      
      if (savedTheme) {
        return savedTheme;
      }
      
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      return prefersDark ? 'dark' : 'light';
    }
    
    return 'light'; // Default theme
  };
  
  const [theme, setTheme] = useState<Theme>(getInitialTheme);
  
  // Apply theme to document
  useEffect(() => {
    const root = window.document.documentElement;
    
    // Remove previous theme class
    root.classList.remove('light-theme', 'dark-theme');
    
    // Add current theme class
    root.classList.add(`${theme}-theme`);
    
    // Store theme in local storage
    localStorage.setItem('theme', theme);
    
    // Update meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute(
        'content',
        theme === 'light' ? '#ffffff' : '#1e293b'
      );
    }
  }, [theme]);
  
  // Toggle theme function
  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };
  
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isDark: theme === 'dark' }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use theme
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  
  return context;
};

// CSS variables for theme
export const themeStyles = `
  :root {
    /* Light theme variables */
    --background-light: #ffffff;
    --background-secondary-light: #f8f9fa;
    --text-primary-light: #333333;
    --text-secondary-light: #6c757d;
    --border-light: #dee2e6;
    --primary-color-light: #ffbd00;
    --primary-hover-light: #e6a800;
    --secondary-color-light: #6c757d;
    --secondary-hover-light: #5a6268;
    --success-color-light: #28a745;
    --danger-color-light: #dc3545;
    --warning-color-light: #ffc107;
    --info-color-light: #17a2b8;
    --shadow-light: 0 2px 4px rgba(0, 0, 0, 0.05);
    --shadow-medium-light: 0 4px 6px rgba(0, 0, 0, 0.1);
    --card-background-light: #ffffff;
    --input-background-light: #ffffff;
    --input-border-light: #ced4da;
    --input-focus-light: #ffbd00;
    --button-text-light: #ffffff;
    --navbar-background-light: #ffffff;
    --sidebar-background-light: #1e293b;
    --sidebar-text-light: #ffffff;
    --sidebar-active-light: #ffbd00;
    
    /* Dark theme variables */
    --background-dark: #121212;
    --background-secondary-dark: #1e1e1e;
    --text-primary-dark: #e0e0e0;
    --text-secondary-dark: #adb5bd;
    --border-dark: #2d2d2d;
    --primary-color-dark: #ffbd00;
    --primary-hover-dark: #ffd54f;
    --secondary-color-dark: #6c757d;
    --secondary-hover-dark: #adb5bd;
    --success-color-dark: #4caf50;
    --danger-color-dark: #f44336;
    --warning-color-dark: #ff9800;
    --info-color-dark: #03a9f4;
    --shadow-dark: 0 2px 4px rgba(0, 0, 0, 0.2);
    --shadow-medium-dark: 0 4px 6px rgba(0, 0, 0, 0.3);
    --card-background-dark: #1e1e1e;
    --input-background-dark: #2d2d2d;
    --input-border-dark: #444444;
    --input-focus-dark: #ffbd00;
    --button-text-dark: #121212;
    --navbar-background-dark: #1e1e1e;
    --sidebar-background-dark: #121212;
    --sidebar-text-dark: #e0e0e0;
    --sidebar-active-dark: #ffbd00;
  }
  
  /* Light theme class */
  .light-theme {
    --background: var(--background-light);
    --background-secondary: var(--background-secondary-light);
    --text-primary: var(--text-primary-light);
    --text-secondary: var(--text-secondary-light);
    --border: var(--border-light);
    --primary-color: var(--primary-color-light);
    --primary-hover: var(--primary-hover-light);
    --secondary-color: var(--secondary-color-light);
    --secondary-hover: var(--secondary-hover-light);
    --success-color: var(--success-color-light);
    --danger-color: var(--danger-color-light);
    --warning-color: var(--warning-color-light);
    --info-color: var(--info-color-light);
    --shadow: var(--shadow-light);
    --shadow-medium: var(--shadow-medium-light);
    --card-background: var(--card-background-light);
    --input-background: var(--input-background-light);
    --input-border: var(--input-border-light);
    --input-focus: var(--input-focus-light);
    --button-text: var(--button-text-light);
    --navbar-background: var(--navbar-background-light);
    --sidebar-background: var(--sidebar-background-light);
    --sidebar-text: var(--sidebar-text-light);
    --sidebar-active: var(--sidebar-active-light);
  }
  
  /* Dark theme class */
  .dark-theme {
    --background: var(--background-dark);
    --background-secondary: var(--background-secondary-dark);
    --text-primary: var(--text-primary-dark);
    --text-secondary: var(--text-secondary-dark);
    --border: var(--border-dark);
    --primary-color: var(--primary-color-dark);
    --primary-hover: var(--primary-hover-dark);
    --secondary-color: var(--secondary-color-dark);
    --secondary-hover: var(--secondary-hover-dark);
    --success-color: var(--success-color-dark);
    --danger-color: var(--danger-color-dark);
    --warning-color: var(--warning-color-dark);
    --info-color: var(--info-color-dark);
    --shadow: var(--shadow-dark);
    --shadow-medium: var(--shadow-medium-dark);
    --card-background: var(--card-background-dark);
    --input-background: var(--input-background-dark);
    --input-border: var(--input-border-dark);
    --input-focus: var(--input-focus-dark);
    --button-text: var(--button-text-dark);
    --navbar-background: var(--navbar-background-dark);
    --sidebar-background: var(--sidebar-background-dark);
    --sidebar-text: var(--sidebar-text-dark);
    --sidebar-active: var(--sidebar-active-dark);
  }
  
  /* Global styles */
  body {
    background-color: var(--background);
    color: var(--text-primary);
    transition: background-color 0.3s ease, color 0.3s ease;
  }
  
  /* Card styles */
  .card {
    background-color: var(--card-background);
    border: 1px solid var(--border);
    box-shadow: var(--shadow);
  }
  
  /* Input styles */
  input, select, textarea {
    background-color: var(--input-background);
    border: 1px solid var(--input-border);
    color: var(--text-primary);
  }
  
  input:focus, select:focus, textarea:focus {
    border-color: var(--input-focus);
    outline: none;
  }
  
  /* Button styles */
  .button-primary {
    background-color: var(--primary-color);
    color: var(--button-text);
  }
  
  .button-primary:hover {
    background-color: var(--primary-hover);
  }
  
  .button-secondary {
    background-color: var(--secondary-color);
    color: var(--button-text);
  }
  
  .button-secondary:hover {
    background-color: var(--secondary-hover);
  }
`;

export default ThemeProvider;
