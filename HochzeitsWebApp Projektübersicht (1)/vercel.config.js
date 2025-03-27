// LemonVows Deployment Configuration for Vercel
// This file configures the deployment settings for Vercel

module.exports = {
  // General settings
  name: 'lemonvows',
  version: '1.0.0',
  
  // Build settings
  buildCommand: 'npm run build',
  outputDirectory: 'dist',
  
  // Environment variables
  env: {
    VITE_SUPABASE_URL: process.env.VITE_SUPABASE_URL,
    VITE_SUPABASE_ANON_KEY: process.env.VITE_SUPABASE_ANON_KEY,
    VITE_STRIPE_PUBLIC_KEY: process.env.VITE_STRIPE_PUBLIC_KEY
  },
  
  // Routing configuration
  routes: [
    // Serve static assets
    {
      src: '/assets/(.*)',
      dest: '/assets/$1'
    },
    
    // API routes
    {
      src: '/api/(.*)',
      dest: '/api/$1'
    },
    
    // SPA fallback
    {
      src: '/(.*)',
      dest: '/index.html'
    }
  ],
  
  // Headers for security and caching
  headers: [
    {
      source: '/(.*)',
      headers: [
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff'
        },
        {
          key: 'X-Frame-Options',
          value: 'DENY'
        },
        {
          key: 'X-XSS-Protection',
          value: '1; mode=block'
        },
        {
          key: 'Referrer-Policy',
          value: 'strict-origin-when-cross-origin'
        },
        {
          key: 'Content-Security-Policy',
          value: "default-src 'self'; script-src 'self' 'unsafe-inline' https://js.stripe.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://*.supabase.co; connect-src 'self' https://*.supabase.co https://api.stripe.com; frame-src https://js.stripe.com;"
        }
      ]
    },
    {
      source: '/assets/(.*)',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=31536000, immutable'
        }
      ]
    }
  ],
  
  // Redirects
  redirects: [
    {
      source: '/home',
      destination: '/',
      permanent: true
    }
  ],
  
  // Region configuration for EU hosting (DSGVO compliance)
  regions: ['fra1'],
  
  // Project settings
  projectSettings: {
    framework: 'vue',
    devCommand: 'npm run dev',
    installCommand: 'npm install',
    buildCommand: 'npm run build',
    outputDirectory: 'dist',
    rootDirectory: '.',
    nodeVersion: '18.x'
  }
};
