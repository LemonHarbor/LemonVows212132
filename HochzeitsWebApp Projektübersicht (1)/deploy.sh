# LemonVows Deployment Script
# This script automates the deployment process for LemonVows

#!/bin/bash

# Exit on error
set -e

echo "Starting LemonVows deployment process..."

# Step 1: Install dependencies
echo "Installing dependencies..."
npm install

# Step 2: Build the application
echo "Building the application..."
npm run build

# Step 3: Set up environment variables
echo "Setting up environment variables..."
if [ ! -f .env ]; then
  echo "Creating .env file..."
  cat > .env << EOL
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-public-api-key
VITE_STRIPE_PUBLIC_KEY=your-stripe-public-key
EOL
  echo "Please update the .env file with your actual API keys before continuing."
  exit 1
fi

# Step 4: Deploy to Vercel
echo "Deploying to Vercel..."
if ! command -v vercel &> /dev/null; then
  echo "Installing Vercel CLI..."
  npm install -g vercel
fi

# Check if user is logged in to Vercel
if ! vercel whoami &> /dev/null; then
  echo "Please log in to Vercel:"
  vercel login
fi

# Deploy to production
echo "Deploying to production..."
vercel --prod

# Step 5: Set up Supabase
echo "Setting up Supabase..."
if ! command -v supabase &> /dev/null; then
  echo "Installing Supabase CLI..."
  npm install -g supabase
fi

# Check if user is logged in to Supabase
if ! supabase projects list &> /dev/null; then
  echo "Please log in to Supabase:"
  supabase login
fi

# Initialize Supabase (if not already initialized)
if [ ! -f supabase/config.toml ]; then
  echo "Initializing Supabase..."
  supabase init
fi

# Apply database migrations
echo "Applying database migrations..."
cat backend/supabase-schema.sql | supabase db execute

# Step 6: Configure custom domain (if provided)
if [ ! -z "$CUSTOM_DOMAIN" ]; then
  echo "Configuring custom domain: $CUSTOM_DOMAIN..."
  vercel domains add $CUSTOM_DOMAIN
fi

# Step 7: Set up DSGVO compliance
echo "Setting up DSGVO compliance..."
# Ensure EU region is selected in vercel.config.js
if ! grep -q "regions: \['fra1'\]" vercel.config.js; then
  echo "Warning: EU region not configured in vercel.config.js"
  echo "Please ensure 'regions: ['fra1']' is set in vercel.config.js"
fi

# Step 8: Set up monitoring
echo "Setting up monitoring..."
vercel integrations add sentry

# Step 9: Final checks
echo "Performing final checks..."
# Check if deployment was successful
DEPLOYMENT_URL=$(vercel ls --prod | grep lemonvows | awk '{print $2}')
if [ -z "$DEPLOYMENT_URL" ]; then
  echo "Deployment failed or URL not found."
  exit 1
fi

echo "Deployment completed successfully!"
echo "Your LemonVows application is now available at: $DEPLOYMENT_URL"
echo ""
echo "Next steps:"
echo "1. Update your DNS settings if you're using a custom domain"
echo "2. Test all functionality on the live site"
echo "3. Set up Stripe/LemonSqueezy for payment processing"
echo "4. Configure automated backups for your Supabase database"

exit 0
