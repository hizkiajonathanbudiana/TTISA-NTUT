# 🚨 URGENT: Database Schema Fix Required

## Problem
The CMS pages are showing no data because the existing `users` table is missing required columns like `english_name`, `student_id`, etc.

**Error**: `column "english_name" does not exist`

## Solution
**You MUST run the UPDATED SQL script in your Supabase dashboard:**

### Steps:
1. **Open Supabase Dashboard**: Go to your project dashboard
2. **Navigate to SQL Editor**: Click on "SQL Editor" in the left sidebar  
3. **Run the Script**: Copy and paste the entire contents of `create_missing_tables.sql` and execute it
4. **Verify**: Check that the columns were added successfully

### The script will:
- ✅ **Add missing columns** to existing `users` table (english_name, student_id, etc.)
- ✅ **Create missing tables** (payment_instructions, proof_contacts, social_links, teams, team_members)
- ✅ **Update database views** (profiles, user_details)
- ✅ **Create RLS policies** for security
- ✅ **Add sample data** for testing
- ✅ **Create search function** for users

### Key Fix:
The script now uses `ALTER TABLE users ADD COLUMN` instead of `CREATE TABLE` since your `users` table already exists but is missing the required columns.

## After Running the Script
All CMS pages should work properly:
- ✅ Teams Edit Page will show team details
- ✅ Payments Management will show payment methods  
- ✅ Socials Management will show social links
- ✅ Dashboard will show user counts
- ✅ All data will be visible in CMS

**The data exists in some form but the CMS can't access it without these proper table structures.**