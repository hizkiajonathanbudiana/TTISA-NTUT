-- Test script to verify the database schema is working correctly
-- Run this AFTER running create_missing_tables.sql

-- Test 1: Check if users table has all required columns
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'users'
ORDER BY column_name;

-- Test 2: Check if views were created successfully
SELECT table_name, table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('profiles', 'user_details');

-- Test 3: Check if new tables exist
SELECT table_name
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('payment_instructions', 'proof_contacts', 'social_links', 'teams', 'team_members');

-- Test 4: Check if sample data was inserted
SELECT 'payment_instructions' as table_name, count(*) as row_count FROM payment_instructions
UNION ALL
SELECT 'proof_contacts', count(*) FROM proof_contacts  
UNION ALL
SELECT 'social_links', count(*) FROM social_links
UNION ALL
SELECT 'teams', count(*) FROM teams;

-- Test 5: Test the search function
SELECT * FROM search_users('test') LIMIT 3;

-- If all tests pass, your CMS should work properly!