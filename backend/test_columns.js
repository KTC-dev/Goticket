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

const testColumns = async () => {
  try {
    const supabaseUrl = process.env.SUPABASE_URL || '';
    const supabaseKey = process.env.SUPABASE_ANON_KEY || '';

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase URL and Anon Key must be provided in environment variables');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Try to select specific columns
    const columnsToTest = ['id', 'username', 'full_name', 'is_admin', 'created_at', 'updated_at'];

    for (const col of columnsToTest) {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select(col)
          .limit(1);

        if (error) {
          console.log(`❌ Column '${col}' not accessible:`, error.message);
        } else {
          console.log(`✅ Column '${col}' accessible`);
          if (data && data.length > 0) {
            console.log(`   Sample value:`, data[0][col]);
          } else {
            console.log(`   (no rows)`);
          }
        }
      } catch (e) {
        console.log(`❌ Exception testing column '${col}':`, e.message);
      }
    }

    // Also try to describe the table via rpc if possible
    console.log('\nAttempting to reload schema cache...');
    try {
      await supabase.rpc('pg_notify', {
        channel: 'pgrst',
        payload: 'reload schema'
      });
      console.log('Schema cache reload triggered');
      // Wait a bit
      await new Promise(resolve => setTimeout(resolve, 3000));
    } catch (notifyError) {
      console.log('Failed to reload schema cache via pg_notify:', notifyError.message);
    }

    // Now test again after reload
    console.log('\nAfter schema cache reload attempt:');
    for (const col of columnsToTest) {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select(col)
          .limit(1);

        if (error) {
          console.log(`❌ Column '${col}' not accessible:`, error.message);
        } else {
          console.log(`✅ Column '${col}' accessible`);
        }
      } catch (e) {
        console.log(`❌ Exception testing column '${col}':`, e.message);
      }
    }

  } catch (err) {
    console.error('Unexpected error:', err);
  }
};

testColumns();
