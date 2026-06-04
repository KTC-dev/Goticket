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

const testInsert = async () => {
  try {
    const supabaseUrl = process.env.SUPABASE_URL || '';
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase URL and Service Role Key must be provided');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Test 1: Insert only id (should exist)
    console.log('\n=== Test 1: Insert only id ===');
    const testId = '00000000-0000-0000-0000-000000000001'; // dummy UUID
    const { data: data1, error: error1 } = await supabase
      .from('profiles')
      .insert([{ id: testId }])
      .select();

    if (error1) {
      console.log('❌ Insert only id failed:', error1.message);
    } else {
      console.log('✅ Insert only id succeeded:', data1);
      // Clean up
      await supabase.from('profiles').delete().eq('id', testId);
    }

    // Test 2: Insert id and username
    console.log('\n=== Test 2: Insert id and username ===');
    const testId2 = '00000000-0000-0000-0000-000000000002';
    const { data: data2, error: error2 } = await supabase
      .from('profiles')
      .insert([{ id: testId2, username: 'testuser' }])
      .select();

    if (error2) {
      console.log('❌ Insert id+username failed:', error2.message);
    } else {
      console.log('✅ Insert id+username succeeded:', data2);
      await supabase.from('profiles').delete().eq('id', testId2);
    }

    // Test 3: Insert id, username, full_name
    console.log('\n=== Test 3: Insert id, username, full_name ===');
    const testId3 = '00000000-0000-0000-0000-000000000003';
    const { data: data3, error: error3 } = await supabase
      .from('profiles')
      .insert([{ id: testId3, username: 'testuser2', full_name: 'Test User' }])
      .select();

    if (error3) {
      console.log('❌ Insert id+username+full_name failed:', error3.message);
    } else {
      console.log('✅ Insert id+username+full_name succeeded:', data3);
      await supabase.from('profiles').delete().eq('id', testId3);
    }

    // Test 4: Insert all columns from schema
    console.log('\n=== Test 4: Insert all columns ===');
    const testId4 = '00000000-0000-0000-0000-000000000004';
    const { data: data4, error: error4 } = await supabase
      .from('profiles')
      .insert([{
        id: testId4,
        username: 'testuser3',
        full_name: 'Test User Three',
        avatar_url: 'https://example.com/avatar.jpg',
        website: 'https://example.com',
        is_admin: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select();

    if (error4) {
      console.log('❌ Insert all columns failed:', error4.message);
    } else {
      console.log('✅ Insert all columns succeeded:', data4);
      await supabase.from('profiles').delete().eq('id', testId4);
    }

  } catch (err) {
    console.error('Unexpected error:', err);
  }
};

testInsert();
