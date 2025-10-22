# Dynamic URL Management System

This project now uses a centralized URL management system that allows easy domain changes without hardcoding URLs throughout the codebase.

## Overview

Instead of hardcoding `https://ttisa-ntut.vercel.app` everywhere, the application now uses:
- Environment variables for URL configuration
- Utility functions for consistent URL generation
- Build-time generation of static files with dynamic URLs

## Components

### 1. Environment Variable Configuration

**`.env.local` (for development):**
```env
VITE_APP_URL=http://localhost:5173
```

**`.env` (for production):**
```env
VITE_APP_URL=https://ttisa-ntut.vercel.app
```

### 2. URL Utility Functions (`src/utils/url.ts`)

- `getAppUrl()`: Returns the base application URL
- `getFullUrl(path)`: Returns the full URL for a given path

```typescript
import { getAppUrl, getFullUrl } from '../utils/url';

// Usage examples:
const baseUrl = getAppUrl(); // https://ttisa-ntut.vercel.app
const eventUrl = getFullUrl('/events'); // https://ttisa-ntut.vercel.app/events
```

### 3. Dynamic Static File Generation

The `scripts/generate-static-files.js` script generates static files with the correct URLs:
- `public/robots.txt`
- `public/sitemap.xml` 
- `index.html` (URL replacement)

This script runs automatically during the build process.

## Updated Files

### React Components (SEO URLs)
- ✅ `HomePage.tsx` - Uses `getAppUrl()`
- ✅ `EventsPage.tsx` - Uses `getFullUrl('/events')`
- ✅ `TeamsPage.tsx` - Uses `getFullUrl('/teams')`
- ✅ `SEO.tsx` - Dynamic default URL

### Authentication (OAuth Redirects)
- ✅ `AuthPage.tsx` - Uses `getAppUrl()` for Google OAuth
- ✅ `ForgotPasswordPage.tsx` - Uses `getFullUrl('/update-password')`

### Static Files (Build-time Generation)
- ✅ `robots.txt` - Generated with dynamic sitemap URL
- ✅ `sitemap.xml` - Generated with dynamic page URLs
- ✅ `index.html` - URLs replaced during build

## Usage

### Development
```bash
# Set development URL
echo "VITE_APP_URL=http://localhost:5173" > .env.local

# Run development server
npm run dev
```

### Production Build
```bash
# Set production URL
export VITE_APP_URL=https://your-new-domain.com

# Build with dynamic URL generation
npm run build
```

### Manual Static File Generation
```bash
# Generate static files with current environment URL
npm run generate-static

# Generate with specific URL
VITE_APP_URL=https://custom-domain.com npm run generate-static
```

## Changing Domains

To deploy to a new domain:

1. **Update environment variable:**
   ```bash
   # For Vercel
   vercel env add VITE_APP_URL production
   # Enter: https://your-new-domain.com
   ```

2. **Update Supabase settings:**
   - Site URL: `https://your-new-domain.com`
   - Redirect URLs:
     - `https://your-new-domain.com`
     - `https://your-new-domain.com/auth/callback` 
     - `https://your-new-domain.com/update-password`

3. **Redeploy:**
   ```bash
   vercel --prod
   ```

The build process will automatically generate all static files with the new URL.

## Benefits

- ✅ **No hardcoded URLs**: Easy domain changes
- ✅ **Consistent URLs**: Centralized management
- ✅ **Environment-aware**: Different URLs for dev/prod
- ✅ **SEO-friendly**: Proper canonical URLs and sitemaps
- ✅ **OAuth-compatible**: Dynamic redirect URLs
- ✅ **Build automation**: Static files generated automatically

## Fallback System

If `VITE_APP_URL` is not set, the system falls back to:
- Development: Current origin (`window.location.origin`)
- Production: `https://ttisa-ntut.vercel.app`

This ensures the application works even without explicit configuration.