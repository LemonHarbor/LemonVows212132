#!/bin/bash

# Script to deploy LemonVows to Netlify
# This script prepares and deploys the LemonVows app to Netlify

# Exit on error
set -e

echo "Preparing LemonVows for Netlify deployment..."

# Create public directory and favicon if not exists
mkdir -p /home/ubuntu/lemonvows-dev/public
if [ ! -f /home/ubuntu/lemonvows-dev/public/favicon.svg ]; then
  cat > /home/ubuntu/lemonvows-dev/public/favicon.svg << 'EOF'
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <circle cx="50" cy="50" r="45" fill="#3498db" />
  <text x="50" y="65" font-family="Arial" font-size="50" font-weight="bold" text-anchor="middle" fill="white">L</text>
</svg>
EOF
fi

# Create _redirects file for Netlify
cat > /home/ubuntu/lemonvows-dev/public/_redirects << 'EOF'
/*    /index.html   200
EOF

# Create robots.txt
cat > /home/ubuntu/lemonvows-dev/public/robots.txt << 'EOF'
User-agent: *
Allow: /
EOF

# Build the project
echo "Building LemonVows for Netlify deployment..."
cd /home/ubuntu/lemonvows-dev
npm run build

# Create netlify.json for CLI deployment
cat > /home/ubuntu/lemonvows-dev/netlify.json << 'EOF'
{
  "name": "lemonvows",
  "site_id": "lemonvowscom",
  "build": {
    "publish": "dist",
    "command": "npm run build"
  }
}
EOF

echo "LemonVows has been prepared for Netlify deployment."
echo "To deploy to Netlify, you can use the Netlify CLI or connect your GitHub repository to Netlify."
echo "For GitHub deployment, push the code to your repository and connect it to Netlify."
echo "For CLI deployment, install the Netlify CLI and run 'netlify deploy'."

# Create a zip file for manual upload to Netlify
echo "Creating deployment package for manual upload..."
cd /home/ubuntu/lemonvows-dev
zip -r /home/ubuntu/lemonvows-netlify-deploy.zip dist netlify.toml

echo "Deployment package created at: /home/ubuntu/lemonvows-netlify-deploy.zip"
echo "You can manually upload this package to Netlify through their web interface."
