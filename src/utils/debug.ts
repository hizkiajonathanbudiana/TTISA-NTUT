import { supabase } from '../contexts/AuthContext';

export const debugUserAccess = async (userId: string) => {
    console.log('=== DEBUG USER ACCESS ===');
    console.log('User ID:', userId);
    
    try {
        // Check users table
        const { data: userData, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('id', userId)
            .single();
        
        console.log('Users table data:', userData);
        console.log('Users table error:', userError);
        
        // Check profiles table
        const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('user_id', userId)
            .single();
        
        console.log('Profiles table data:', profileData);
        console.log('Profiles table error:', profileError);
        
        // Check roles
        if (userData?.role_id) {
            const { data: roleData, error: roleError } = await supabase
                .from('roles')
                .select('*')
                .eq('id', userData.role_id)
                .single();
            
            console.log('Role data:', roleData);
            console.log('Role error:', roleError);
        }
        
        // Try different join approaches
        const { data: joinData1, error: joinError1 } = await supabase
            .from('users')
            .select('id, email, profiles(english_name), roles(name)')
            .eq('id', userId)
            .single();
        
        console.log('Join approach 1:', joinData1);
        console.log('Join error 1:', joinError1);
        
        const { data: joinData2, error: joinError2 } = await supabase
            .from('profiles')
            .select('english_name, user_id, users!inner(id, email, roles(name))')
            .eq('user_id', userId)
            .single();
        
        console.log('Join approach 2:', joinData2);
        console.log('Join error 2:', joinError2);
        
    } catch (error) {
        console.error('Debug error:', error);
    }
    
    console.log('=== END DEBUG ===');
};

// Call this in the browser console: debugUserAccess('your-user-id')
(window as any).debugUserAccess = debugUserAccess;