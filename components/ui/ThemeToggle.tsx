'use client';

import React, { useEffect, useState } from 'react';
import { useTranslation } from '@/src/lib/i18n';

export default function ThemeToggle() {
  const { t } = useTranslation('common');
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');

  // Initialize theme on component mount
  useEffect(() => {
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | 'system' | null;
    
    if (savedTheme) {
      setTheme(savedTheme);
      applyTheme(savedTheme);
    } else {
      // Default to system preference
      setTheme('system');
      applyTheme('system');
    }
    
    // Add transition class after initial load to enable smooth transitions
    setTimeout(() => {
      document.documentElement.classList.add('dark-transition');
    }, 100);
  }, []);

  // Apply theme based on selection
  const applyTheme = (newTheme: 'light' | 'dark' | 'system') => {
    const root = document.documentElement;
    
    if (newTheme === 'system') {
      // Check system preference
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      
      if (systemPrefersDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    } else if (newTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  };

  // Handle theme change
  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    applyTheme(newTheme);
  };

  // Listen for system preference changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = () => {
      if (theme === 'system') {
        applyTheme('system');
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm font-medium text-muted-light dark:text-muted-dark">
        {t('settings.theme')}:
      </span>
      <div className="relative inline-block">
        <select
          value={theme}
          onChange={(e) => handleThemeChange(e.target.value as 'light' | 'dark' | 'system')}
          className="appearance-none bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-md py-1 pl-3 pr-8 text-sm focus-ring"
        >
          <option value="light">{t('settings.light')}</option>
          <option value="dark">{t('settings.dark')}</option>
          <option value="system">{t('settings.system')}</option>
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
          <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
          </svg>
        </div>
      </div>
    </div>
  );
}
