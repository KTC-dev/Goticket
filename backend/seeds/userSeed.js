const { createClient } = require('@supabase/supabase-js');
const WebSocket = require('ws');
require('whatwg-fetch');
const XMLHttpRequest = require('xhr2');
require('dotenv').config();

// WebSocket and fetch workarounds for Node.js < 18
global.WebSocket = WebSocket;
global.Headers = Headers;
global.Request = Request;
global.fetch = fetch;
global.XMLHttpRequest = XMLHttpRequest;

console.log('Starting user seed script');

// Sample users to seed (email/password combos)
const sampleUsers = [
  {
    email: 'admin@goticket.com',
    password: 'admin123',
    username: 'admin',
    fullName: 'Admin User',
    is_admin: true
  },
  {
    email: 'john@example.com',
    password: 'password123',
    username: 'john_doe',
    fullName: 'John Doe',
    is_admin: false
  },
  {
    email: 'jane@example.com',
    password: 'password123',
    username: 'jane_smith',
    fullName: 'Jane Smith',
    is_admin: false
  }
];

console.log('Sample users:', sampleUsers.map(u => u.email));

const seedUsers = async () => {
  try {
    // Initialize TWO clients:
    const supabaseUrl = process.env.SUPABASE_URL || '';
    const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
    
    console.log('Supabase URL:', supabaseUrl ? 'set' : 'not set');
    console.log('Supabase Anon Key:', supabaseAnonKey ? 'set' : 'not set');
    console.log('Supabase Service Key:', supabaseServiceKey ? 'set' : 'not set');
    
    if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceKey) {
      throw new Error('Supabase URL, Anon Key, and Service Role Key must be provided in .env');
    }
    
    const supabase = createClient(supabaseUrl, supabaseAnonKey); // For public operations
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey); // For admin operations

    console.log('Created Supabase clients');

    // Reload PostgREST schema cache to ensure we have the latest schema
    console.log('Reloading PostgREST schema cache...');
    try {
      await supabaseAdmin.rpc('pg_notify', {
        channel: 'pgrst',
        payload: 'reload schema'
      });
      // Wait a bit for the cache to reload
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Schema cache reload triggered.');
    } catch (notifyError) {
      console.warn('Failed to reload schema cache via pg_notify:', notifyError);
      // Continue anyway
    }

    console.log('Creating users via Supabase Auth Admin API...');
    
    // Process each user
    for (const userData of sampleUsers) {
      const { email, password, username, fullName, is_admin } = userData;
      
      console.log(`Processing user: ${email}`);
      
      // 1. Create user via Auth Admin API (service role required)
      console.log('Calling createUser...');
      let authData;
      try {
        const { data, error } = await supabaseAdmin.auth.admin.createUser({
          email,
          password,
          email_confirm: true, // Auto-confirm for seeding
          user_metadata: {
            username,
            full_name: fullName
          }
        });
        
        if (error) {
          // If user already exists, fetch them instead
          if (error.status === 422 && error.code === 'email_exists') {
            console.log(`User ${email} already exists, fetching...`);
            const { data: fetchData, error: fetchError } = await supabaseAdmin.auth.admin.listUsers();
            if (fetchError) throw fetchError;
            const existingUser = fetchData.users.find(u => u.email === email);
            if (!existingUser) {
              throw new Error(`Could not find existing user with email ${email}`);
            }
            authData = { data: { user: existingUser } };
          } else {
            throw error;
          }
        } else {
          authData = { data };
        }
      } catch (error) {
        console.error('Error creating/fetching user:', error);
        throw error;
      }
      
      if (!authData.data?.user) {
        throw new Error('No user returned from createUser/fetch');
      }
      
      const userId = authData.data.user.id;
      console.log(`✅ Created/fetched user: ${email} (ID: ${userId})`);
      
       // 2. Create profile record
       console.log('Creating profile...');
       const { data: profileData, error: profileError } = await supabaseAdmin
         .from('profiles')
         .upsert([
           {
             id: userId,
             is_admin
           }
         ], { onConflict: ['id'] })
         .select();
      
      if (profileError) {
        console.error('Error creating/updating profile:', profileError);
        throw profileError;
      }
      console.log(`✅ Created/updated profile for: ${username}`);
    }
    
    console.log(`\n🎉 Successfully seeded ${sampleUsers.length} users!`);
    console.log('🔑 Test credentials:');
    sampleUsers.forEach(u => {
      console.log(`   ${u.email} / ${u.password} ${u.is_admin ? '(ADMIN)' : ''}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding users:', error);
    console.error('Error details:', JSON.stringify(error, null, 2));
    process.exit(1);
  }
};

module.exports = seedUsers;

// If this file is run directly, run the seed function
if (require.main === module) {
  console.log('Running seedUsers directly');
  seedUsers();
}