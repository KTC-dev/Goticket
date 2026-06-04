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

    // Try to call a known rpc function: pg_notify (used in seed)
    console.log('Testing pg_notify rpc...');
    const { data: notifyData, error: notifyError } = await supabase.rpc('pg_notify', {
      channel: 'test',
      payload: 'test'
    });
    if (notifyError) {
      console.log('pg_notify error:', notifyError.message);
    } else {
      console.log('pg_notify success:', notifyData);
    }

    // Try to call exec_sql if it exists
    console.log('\nTesting exec_sql rpc...');
    const { data: sqlData, error: sqlError } = await supabase.rpc('exec_sql', {
      query: 'SELECT version()'
    });
    if (sqlError) {
      console.log('exec_sql error:', sqlError.message);
    } else {
      console.log('exec_sql success:', sqlData);
    }

  } catch (err) {
    console.error('Unexpected error:', err);
  }
};

test();
