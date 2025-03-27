# LemonVows Deployment Package

This package contains all the necessary files and instructions to deploy the LemonVows wedding planning web application to production.

## Contents

- `vercel.config.js`: Configuration file for Vercel deployment
- `deploy.sh`: Automated deployment script
- `VERCEL_DEPLOYMENT.md`: Step-by-step guide for deploying to Vercel
- `README.md`: General deployment documentation

## Quick Start

1. Make sure you have Node.js, npm, and Git installed
2. Install Vercel CLI: `npm install -g vercel`
3. Login to Vercel: `vercel login`
4. Configure your environment variables in `.env.production`
5. Run the deployment script: `./deploy.sh`

## Requirements

- Vercel account
- Supabase account
- Domain name (optional)
- Stripe or LemonSqueezy account for payment processing

## GDPR Compliance

This deployment is configured to host data in the EU region (Frankfurt) to ensure GDPR compliance.

## Support

If you encounter any issues during deployment, please refer to the troubleshooting section in the documentation or contact support.
