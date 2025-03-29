# Netlify build settings for Vite
# This file ensures Vite builds correctly for Netlify deployment

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@assets': path.resolve(__dirname, './src/assets'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@context': path.resolve(__dirname, './src/context'),
      '@services': path.resolve(__dirname, './src/services'),
      '@styles': path.resolve(__dirname, './src/styles'),
      '@locales': path.resolve(__dirname, './src/locales'),
    },
  },
  // Ensure environment variables are properly handled
  define: {
    'process.env.NEXT_PUBLIC_SUPABASE_URL': JSON.stringify(process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://jodqlliylhmwgpurfzxm.supabase.co'),
    'process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY': JSON.stringify(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpvZHFsbGl5bGhtd2dwdXJmenhtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI5ODI4ODgsImV4cCI6MjA1ODU1ODg4OH0.7vcXDTNdjsIpnpe-06qSyuu3K-pQVwtYpLueUuzDzDk'),
  },
  // Optimize build for production
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          supabase: ['@supabase/supabase-js'],
          i18n: ['i18next', 'react-i18next'],
        },
      },
    },
  },
  // Development server settings
  server: {
    port: 3000,
    strictPort: true,
    host: true,
  },
  // Preview server settings (for testing production builds locally)
  preview: {
    port: 8080,
    strictPort: true,
  },
})
