# Owlby Native Deployment Guide

This guide provides step-by-step instructions for deploying the Owlby Native app to production, ensuring that it works correctly with Vercel backend and Supabase database.

## Prerequisites

- Expo account (https://expo.dev)
- Vercel account (https://vercel.com)
- Supabase account (https://supabase.com)
- Git repository set up
- Node.js and npm installed

## 1. Set Up Supabase

### Create Supabase Project

1. Log in to Supabase and create a new project
2. Note your project URL and API keys
3. Set up the necessary tables (following your database schema)

### Configure Environment Variables

Create a `.env` file in your project root with the following:

```
# Supabase Configuration
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-role-key
DATABASE_URL=postgresql://postgres:password@your-project-ref.supabase.co:5432/postgres

# Expo Public Variables (Will be embedded in the app)
EXPO_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
EXPO_PUBLIC_SUPABASE_KEY=your-anon-key
EXPO_PUBLIC_API_URL=https://your-vercel-deployment.vercel.app

# Server Configuration
PORT=3001
NODE_ENV=development
```

## 2. Deploy Backend to Vercel

### Configure Vercel Project

1. Log in to Vercel and create a new project
2. Link to your Git repository
3. Set the following environment variables in Vercel:
   - `SUPABASE_URL`
   - `SUPABASE_KEY`
   - `SUPABASE_SERVICE_KEY` (if needed)
   - `NODE_ENV=production`

### Deploy

1. Push your code to your Git repository
2. Vercel will automatically deploy your backend
3. Note the deployment URL (e.g., `https://owlby-native.vercel.app`)

## 3. Configure Expo for Production

### Update Expo Environment

1. In the EAS build configuration (`eas.json`), update the production environment with your Vercel URL:

```json
"production": {
  "autoIncrement": true,
  "android": {
    "buildType": "app-bundle"
  },
  "env": {
    "EXPO_PUBLIC_ENV": "production",
    "EXPO_PUBLIC_API_URL": "https://your-vercel-deployment.vercel.app",
    "EXPO_PUBLIC_SUPABASE_URL": "https://your-project-ref.supabase.co",
    "EXPO_PUBLIC_SUPABASE_KEY": "your-anon-key"
  }
}
```

## 4. Build Mobile App for Testing

### Android Build

```bash
# Install EAS CLI if not already installed
npm install -g eas-cli

# Log in to Expo
eas login

# Configure the project
eas build:configure

# Build for Android (internal distribution)
eas build --platform android --profile preview
```

### iOS Build

```bash
# Build for iOS (internal distribution)
eas build --platform ios --profile preview
```

### Download and Install

1. Once the build is complete, you'll receive a link to download the APK (Android) or a link to TestFlight (iOS)
2. Install the app on your device

## 5. Test Production Configuration

1. Open the installed app on your device
2. Verify that it connects to your Vercel backend
3. Test authentication with Supabase
4. Verify that all features work as expected

## Troubleshooting

### Connection Issues

If the app fails to connect to the backend:

1. Check that the environment variables are set correctly
2. Verify that the Vercel deployment is successful
3. Check the CORS settings in your API endpoints

### Authentication Issues

If authentication fails:

1. Verify your Supabase configuration
2. Check the OAuth redirect URIs (if using OAuth)
3. Test authentication directly with Supabase APIs

### Build Issues

If the build fails:

1. Check the EAS build logs
2. Verify that all dependencies are correctly installed
3. Make sure your app.json and eas.json configs are correct

## Continuous Deployment

For a smooth development workflow:

1. Set up a CI/CD pipeline to automatically deploy to Vercel
2. Use separate environments (development, staging, production)
3. Create a staging build profile in EAS for testing before production

## Appendix: Important Commands

### Local Development

```bash
# Start the development server
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios
```

### Backend Management

```bash
# Run backend locally
npm run dev

# Set up Supabase
npm run setup:supabase

# Run migrations
npm run migrate
```

### Production Builds

```bash
# Production build for Android
eas build --platform android --profile production

# Production build for iOS
eas build --platform ios --profile production

# Submit to stores
eas submit --platform android
eas submit --platform ios
``` 