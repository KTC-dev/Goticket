// Polyfills for Node.js 16
const fetch = require('node-fetch');
const { Headers } = require('headers-polyfill');
global.fetch = fetch;
global.Headers = Headers;

// WebSocket setup for Node.js 16
const WebSocket = require('ws');
global.WebSocket = WebSocket;

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const test = async () => {
  try {
    const supabaseUrl = process.env.SUPABASE_URL || '';
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase URL and Service Role Key must be provided');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // 1. Create a test auth user
    const testEmail = `test_${Date.now()}@example.com`;
    const testPassword = 'TestPassword123';
    console.log(`Creating auth user: ${testEmail}`);
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: testEmail,
      password: testPassword,
      email_confirm: true,
      user_metadata: {
        username: 'testuser',
        full_name: 'Test User'
      }
    });

    if (authError) {
      console.log('❌ Failed to create auth user:', authError.message);
      return;
    }

    const userId = authData.user.id;
    console.log(`✅ Auth user created with ID: ${userId}`);

    // 2. Insert profile with minimal columns (id, is_admin, created_at)
    console.log('Inserting profile with minimal columns...');
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .insert([{
        id: userId,
        is_admin: false,
        // created_at will default to now()
      }])
      .select();

    if (profileError) {
      console.log('❌ Failed to insert profile:', profileError.message);
      // Let's see what columns it expects by trying to insert with all known columns
      console.log('Trying to insert with id, username, full_name...');
      const { data: profileData2, error: profileError2 } = await supabase
        .from('profiles')
        .insert([{
          id: userId,
          is_admin: false,
          username: 'testuser',
          full_name: 'Test User'
        }])
        .select();
      if (profileError2) {
        console.log('❌ Also failed with username/full_name:', profileError2.message);
      } else {
        console.log('✅ Insert with username/full_name succeeded:', profileData2);
      }
    } else {
      console.log('✅ Profile inserted successfully:', profileData);
    }

    // Clean up: delete auth user (which will cascade delete profile if FK set)
    console.log('Cleaning up auth user...');
    await supabase.auth.admin.deleteUser(userId);
    console.log('✅ Cleanup done');

  } catch (err) {
    console.error('Unexpected error:', err);
  }
};

test();
