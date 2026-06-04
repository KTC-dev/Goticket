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
    const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Supabase URL and Service Role Key must be provided');
    }

    // 1. Create auth user using supabase-js (easier)
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
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

    // 2. Insert profile via raw HTTP POST to /rest/v1/profiles
    const profileUrl = `${supabaseUrl}/rest/v1/profiles`;
    const profilePayload = {
      id: userId,
      is_admin: false,
      // username and full_name omitted; let's see if they are required
    };

    console.log('Inserting profile via HTTP POST...');
    const response = await fetch(profileUrl, {
      method: 'POST',
      headers: {
        'apikey': supabaseServiceKey,
        'Authorization': `Bearer ${supabaseServiceKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(profilePayload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.log(`❌ HTTP POST failed: ${response.status} ${response.statusText}`);
      console.log('Error body:', errorText);
    } else {
      const data = await response.json();
      console.log('✅ HTTP POST succeeded:', data);
    }

    // Clean up: delete auth user
    console.log('Cleaning up auth user...');
    await supabase.auth.admin.deleteUser(userId);
    console.log('✅ Cleanup done');

  } catch (err) {
    console.error('Unexpected error:', err);
  }
};

test();
