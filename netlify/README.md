# Netlify Deployment Guide for LemonVows

This document provides instructions for deploying the LemonVows wedding planning app to Netlify.

## Deployment Options

There are three ways to deploy LemonVows to Netlify:

1. **Direct GitHub Integration** (Recommended)
2. **Manual Upload** of the deployment package
3. **Netlify CLI** deployment

## Option 1: GitHub Integration

1. Log in to your Netlify account at https://app.netlify.com/
2. Go to "Sites" and click "Add new site" → "Import an existing project"
3. Select GitHub as your Git provider
4. Authorize Netlify to access your GitHub account if prompted
5. Select the "LemonHarbor/LemonVows" repository
6. Configure the build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
7. Click "Deploy site"

Netlify will automatically build and deploy your site. Any future changes pushed to the repository will trigger a new deployment.

## Option 2: Manual Upload

1. Build the project locally using the deploy script:
   ```bash
   ./netlify/deploy-to-netlify.sh
   ```
2. This will create a deployment package at `/path/to/lemonvows-netlify-deploy.zip`
3. Log in to your Netlify account at https://app.netlify.com/
4. Go to "Sites" and click "Add new site" → "Deploy manually"
5. Drag and drop the zip file or browse to select it
6. Wait for the upload and deployment to complete

## Option 3: Netlify CLI

1. Install the Netlify CLI:
   ```bash
   npm install netlify-cli -g
   ```
2. Log in to your Netlify account:
   ```bash
   netlify login
   ```
3. Navigate to the project directory:
   ```bash
   cd /path/to/LemonVows
   ```
4. Initialize Netlify:
   ```bash
   netlify init
   ```
5. Follow the prompts to configure your site
6. Deploy the site:
   ```bash
   netlify deploy --prod
   ```

## Environment Variables

If you need to configure environment variables (e.g., for Supabase integration), you can do so in the Netlify dashboard:

1. Go to your site in the Netlify dashboard
2. Navigate to "Site settings" → "Build & deploy" → "Environment"
3. Add the following environment variables:
   - `VITE_SUPABASE_URL`: Your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous key

## Troubleshooting

If you encounter issues with the deployment:

1. Check the build logs in the Netlify dashboard
2. Ensure all dependencies are correctly listed in package.json
3. Verify that the netlify.toml file is correctly configured
4. Make sure the build command and publish directory are correctly set

For more help, refer to the [Netlify documentation](https://docs.netlify.com/).
