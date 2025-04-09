# LemonVows Netlify Deployment

This directory contains configuration files and scripts for deploying LemonVows to Netlify.

## Deployment Methods

### Method 1: Direct GitHub Integration (Recommended)

1. Log in to your Netlify account
2. Go to "Sites" and click "Add new site" → "Import an existing project"
3. Select GitHub as your Git provider
4. Choose the LemonVows repository
5. Configure the build settings:
   - Build command: Leave empty (not needed for static site)
   - Publish directory: `/` (root directory)
6. Click "Deploy site"

### Method 2: Manual Upload

1. Download the `index.html` file from the repository
2. Log in to your Netlify account
3. Go to "Sites" and click "Add new site" → "Deploy manually"
4. Drag and drop the `index.html` file into the upload area
5. Wait for the deployment to complete

### Method 3: Netlify CLI

If you prefer using the command line:

```bash
# Install Netlify CLI
npm install netlify-cli -g

# Login to Netlify
netlify login

# Deploy the site
netlify deploy --prod
```

## Environment Variables

For Supabase integration, the following environment variables are used:

- `SUPABASE_URL`: https://jodqlliylhmwgpurfzxm.supabase.co
- `SUPABASE_ANON_KEY`: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpvZHFsbGl5bGhtd2dwdXJmenhtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI5ODI4ODgsImV4cCI6MjA1ODU1ODg4OH0.7vcXDTNdjsIpnpe-06qSyuu3K-pQVwtYpLueUuzDzDk

These are already embedded in the static HTML file for demonstration purposes.

## Troubleshooting

If you encounter any issues with the deployment:

1. Verify that the `index.html` file exists in the repository
2. Check the Netlify deployment logs for any errors
3. Ensure that the site is being deployed from the correct branch (master)
4. Clear the Netlify cache and redeploy if necessary

## Future Enhancements

For future development, consider:

1. Adding server-side functionality using Netlify Functions
2. Implementing proper authentication with Supabase
3. Creating a more robust build process for larger applications
4. Adding custom domain configuration
