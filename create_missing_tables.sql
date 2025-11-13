-- Create missing tables for CMS functionality

-- First, ensure the users table has all required columns
-- (using ALTER TABLE since the table already exists)
ALTER TABLE users ADD COLUMN IF NOT EXISTS english_name VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS student_id VARCHAR(50);
ALTER TABLE users ADD COLUMN IF NOT EXISTS department VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS nationality VARCHAR(100);
ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE users ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Ensure users table has proper foreign key to roles (if not already set)
-- This might fail if the constraint already exists, which is fine
DO $$ 
BEGIN
    BEGIN
        ALTER TABLE users ADD CONSTRAINT users_role_id_fkey FOREIGN KEY (role_id) REFERENCES roles(id);
    EXCEPTION 
        WHEN duplicate_object THEN NULL;
    END;
END $$;

-- Update the existing profiles view to ensure it works correctly
-- (Check if it's a table or view and handle accordingly)
DO $$ 
BEGIN
    -- Try to drop as view first
    BEGIN
        DROP VIEW IF EXISTS profiles;
    EXCEPTION 
        WHEN wrong_object_type THEN 
            -- If it's a table, we'll work with the existing table
            NULL;
    END;
    
    -- Try to drop as table if it exists and we want to recreate as view
    -- Only do this if profiles table exists but we want it as a view
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'profiles' AND table_schema = 'public') THEN
        -- Profiles exists as a table, let's keep it and just ensure it has the right columns
        -- Add missing columns to profiles table if they don't exist
        BEGIN
            ALTER TABLE profiles ADD COLUMN IF NOT EXISTS student_id VARCHAR(50);
            ALTER TABLE profiles ADD COLUMN IF NOT EXISTS department VARCHAR(255);
            ALTER TABLE profiles ADD COLUMN IF NOT EXISTS nationality VARCHAR(100);
            ALTER TABLE profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;
            ALTER TABLE profiles ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
            ALTER TABLE profiles ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
        EXCEPTION
            WHEN OTHERS THEN NULL;
        END;
    ELSE
        -- Profiles doesn't exist, create as view
        CREATE VIEW profiles AS 
        SELECT 
            id,
            english_name,
            student_id,
            department,
            nationality,
            avatar_url,
            created_at,
            updated_at
        FROM users;
    END IF;
END $$;

-- User details view for comprehensive user information
DROP VIEW IF EXISTS user_details;
CREATE VIEW user_details AS 
SELECT 
    au.id as user_id,
    au.email,
    COALESCE(u.english_name, p.english_name) as english_name,
    COALESCE(u.student_id, p.student_id) as student_id,
    COALESCE(u.department, p.department) as department,
    COALESCE(u.nationality, p.nationality) as nationality,
    COALESCE(u.avatar_url, p.avatar_url) as avatar_url,
    u.role_id,
    r.name as role_name,
    COALESCE(u.created_at, p.created_at) as created_at,
    COALESCE(u.updated_at, p.updated_at) as updated_at
FROM auth.users au
LEFT JOIN users u ON u.id = au.id
LEFT JOIN profiles p ON p.user_id = au.id
LEFT JOIN roles r ON u.role_id = r.id;

-- Payment Instructions table
CREATE TABLE IF NOT EXISTS payment_instructions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    method_name VARCHAR(255) NOT NULL,
    instructions_en TEXT NOT NULL,
    instructions_zh_hant TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Proof Contacts table
CREATE TABLE IF NOT EXISTS proof_contacts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    platform VARCHAR(50) NOT NULL,
    contact_info VARCHAR(255) NOT NULL,
    display_order INTEGER DEFAULT 99,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Social Links table  
CREATE TABLE IF NOT EXISTS social_links (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    platform VARCHAR(50) NOT NULL,
    link_url TEXT NOT NULL,
    display_text VARCHAR(255) NOT NULL,
    display_order INTEGER DEFAULT 99,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Teams table
CREATE TABLE IF NOT EXISTS teams (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name_en VARCHAR(255) NOT NULL,
    name_zh_hant VARCHAR(255) NOT NULL,
    description_en TEXT,
    description_zh_hant TEXT,
    display_order INTEGER DEFAULT 99,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Team Members table
CREATE TABLE IF NOT EXISTS team_members (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    position_en VARCHAR(255) DEFAULT 'Member',
    position_zh_hant VARCHAR(255) DEFAULT '成員',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(team_id, user_id)
);

-- Enable RLS (Row Level Security)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
-- Enable RLS on profiles table if it exists as a table
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'profiles' AND table_schema = 'public') THEN
        ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
    END IF;
END $$;
ALTER TABLE payment_instructions ENABLE ROW LEVEL SECURITY;
ALTER TABLE proof_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

-- Create policies to allow admin access
CREATE POLICY "Users can read own profile" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admin can do everything on users" ON users
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users u
            JOIN roles r ON u.role_id = r.id  
            WHERE u.id = auth.uid() AND r.name = 'admin'
        )
    );

-- Add policies for profiles table if it exists
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'profiles' AND table_schema = 'public') THEN
        -- Drop existing policies if they exist
        DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
        DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
        DROP POLICY IF EXISTS "Admin can do everything on profiles" ON profiles;
        
        -- Create new policies
        CREATE POLICY "Users can read own profile" ON profiles
            FOR SELECT USING (auth.uid() = user_id);

        CREATE POLICY "Users can update own profile" ON profiles
            FOR UPDATE USING (auth.uid() = user_id);

        CREATE POLICY "Admin can do everything on profiles" ON profiles
            FOR ALL USING (
                EXISTS (
                    SELECT 1 FROM users u
                    JOIN roles r ON u.role_id = r.id  
                    WHERE u.id = auth.uid() AND r.name = 'admin'
                )
            );
    END IF;
END $$;

-- Create policies to allow admin access
CREATE POLICY "Admin can do everything on payment_instructions" ON payment_instructions
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users u
            JOIN roles r ON u.role_id = r.id  
            WHERE u.id = auth.uid() AND r.name = 'admin'
        )
    );

CREATE POLICY "Admin can do everything on proof_contacts" ON proof_contacts
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users u
            JOIN roles r ON u.role_id = r.id  
            WHERE u.id = auth.uid() AND r.name = 'admin'
        )
    );

CREATE POLICY "Admin can do everything on social_links" ON social_links
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users u
            JOIN roles r ON u.role_id = r.id  
            WHERE u.id = auth.uid() AND r.name = 'admin'
        )
    );

CREATE POLICY "Admin can do everything on teams" ON teams
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users u
            JOIN roles r ON u.role_id = r.id  
            WHERE u.id = auth.uid() AND r.name = 'admin'
        )
    );

CREATE POLICY "Admin can do everything on team_members" ON team_members
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users u
            JOIN roles r ON u.role_id = r.id  
            WHERE u.id = auth.uid() AND r.name = 'admin'
        )
    );

-- Allow public read access for active items
CREATE POLICY "Public can read active payment_instructions" ON payment_instructions
    FOR SELECT USING (is_active = true);

CREATE POLICY "Public can read active proof_contacts" ON proof_contacts
    FOR SELECT USING (is_active = true);

CREATE POLICY "Public can read active social_links" ON social_links
    FOR SELECT USING (is_active = true);

CREATE POLICY "Public can read active teams" ON teams
    FOR SELECT USING (is_active = true);

CREATE POLICY "Public can read team_members" ON team_members
    FOR SELECT USING (true);

-- Insert some sample data
INSERT INTO payment_instructions (method_name, instructions_en, instructions_zh_hant, is_active) VALUES
('Bank Transfer', 'Please transfer to Bank: ABC Bank, Account: 123456789, Name: TTISA NTUT', '請轉帳至銀行：ABC銀行，帳號：123456789，戶名：TTISA NTUT', true),
('PayPal', 'Send payment to: payment@ttisa.org', '請付款至：payment@ttisa.org', true)
ON CONFLICT DO NOTHING;

INSERT INTO proof_contacts (platform, contact_info, display_order, is_active) VALUES
('line', '@ttisa_ntut', 1, true),
('instagram', '@ttisa_ntut', 2, true),
('email', 'payment@ttisa.org', 3, true)
ON CONFLICT DO NOTHING;

INSERT INTO social_links (platform, link_url, display_text, display_order, is_active) VALUES
('instagram', 'https://instagram.com/ttisa_ntut', '@ttisa_ntut', 1, true),
('line', 'https://line.me/ti/p/@ttisa_ntut', 'TTISA NTUT Official', 2, true),
('email', 'mailto:info@ttisa.org', 'info@ttisa.org', 3, true),
('facebook', 'https://facebook.com/ttisantut', 'TTISA NTUT', 4, true)
ON CONFLICT DO NOTHING;

INSERT INTO teams (name_en, name_zh_hant, description_en, description_zh_hant, display_order, is_active) VALUES
('Executive Board', '執行委員會', 'Leading the organization with strategic vision and oversight.', '以戰略願景和監督領導組織。', 1, true),
('Event Management', '活動管理', 'Organizing and coordinating events and activities.', '組織和協調活動。', 2, true),
('Public Relations', '公共關係', 'Managing communications and external relationships.', '管理溝通和外部關係。', 3, true)
ON CONFLICT DO NOTHING;

-- Create search function for users
DROP FUNCTION IF EXISTS search_users(TEXT);
CREATE OR REPLACE FUNCTION search_users(p_search_term TEXT)
RETURNS TABLE (
    user_id UUID,
    english_name TEXT,
    email TEXT
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        au.id,
        COALESCE(u.english_name, p.english_name) as english_name,
        au.email
    FROM auth.users au
    LEFT JOIN users u ON u.id = au.id
    LEFT JOIN profiles p ON p.user_id = au.id
    WHERE 
        (COALESCE(u.english_name, p.english_name) ILIKE '%' || p_search_term || '%' OR 
         au.email ILIKE '%' || p_search_term || '%')
        AND COALESCE(u.english_name, p.english_name) IS NOT NULL
    ORDER BY COALESCE(u.english_name, p.english_name)
    LIMIT 10;
END;
$$;