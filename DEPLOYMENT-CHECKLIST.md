# TTISA NTUT Deployment Checklist

## ✅ Pre-Deployment Steps

### 1. **Supabase Authentication Configuration**
- [ ] Go to Supabase Dashboard > Authentication > URL Configuration
- [ ] Set **Site URL** to: `https://ttisa-ntut.vercel.app`
- [ ] Add **Redirect URLs**:
  - `https://ttisa-ntut.vercel.app`
  - `https://ttisa-ntut.vercel.app/auth/callback`
  - `https://ttisa-ntut.vercel.app/update-password`

### 2. **Environment Variables Setup**
- [ ] In Vercel Dashboard > Project Settings > Environment Variables
- [ ] Add: `VITE_SUPABASE_URL=your_supabase_project_url`
- [ ] Add: `VITE_SUPABASE_ANON_KEY=your_supabase_anon_key`

### 3. **Database Setup**
- [ ] Ensure your admin user has the correct role in the database
- [ ] Verify the `users` table has proper relationships with `profiles` and `roles`
- [ ] Check that your user account has `role` set to 'admin'

## 🐛 Troubleshooting Guide

### CMS Button Not Appearing?
1. **Check your user role in database:**
   ```sql
   SELECT u.id, u.email, r.name as role_name 
   FROM users u 
   LEFT JOIN roles r ON u.role_id = r.id 
   WHERE u.email = 'your-email@example.com';
   ```

2. **Debug in browser console:**
   ```javascript
   // After logging in, run this in browser console:
   debugUserAccess('your-user-id');
   ```

3. **Verify database structure:**
   - `users` table should have `role_id` column
   - `roles` table should have entries: 'admin', 'organizer', 'member'
   - `profiles` table should be linked to `users` via `user_id`

### Google OAuth Redirecting to Localhost?
- [ ] Check Supabase Auth URL configuration (step 1 above)
- [ ] Verify environment variables in Vercel
- [ ] Ensure the redirect URL code is using production URLs

### 404 Errors on Refresh?
- [ ] Verify `vercel.json` exists with correct routing configuration

## 🔧 Quick Fixes

### Fix User Role (Run in Supabase SQL Editor):
```sql
-- Find your user ID first
SELECT id, email FROM auth.users WHERE email = 'your-email@example.com';

-- Make sure admin role exists
INSERT INTO roles (name) VALUES ('admin') ON CONFLICT (name) DO NOTHING;

-- Update your user to admin (replace USER_ID with your actual ID)
UPDATE users SET role_id = (SELECT id FROM roles WHERE name = 'admin') 
WHERE id = 'USER_ID';
```

### Create Missing Tables (if needed):
```sql
-- Create roles table if it doesn't exist
CREATE TABLE IF NOT EXISTS roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL
);

-- Insert default roles
INSERT INTO roles (name) VALUES 
    ('admin'), 
    ('organizer'), 
    ('member') 
ON CONFLICT (name) DO NOTHING;

-- Add role_id to users table if it doesn't exist
ALTER TABLE users ADD COLUMN IF NOT EXISTS role_id INTEGER REFERENCES roles(id);
```

## 📞 Support

If you're still having issues:
1. Check browser console for error messages
2. Use the debug utility: `debugUserAccess('your-user-id')`
3. Verify your database schema matches the expected structure
4. Check Supabase logs for authentication errors

## 🚀 Post-Deployment Verification

- [ ] Test Google OAuth login
- [ ] Verify CMS access with admin account
- [ ] Test all navigation routes
- [ ] Check that SEO meta tags are working
- [ ] Verify email verification flow