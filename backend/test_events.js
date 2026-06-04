require('dotenv').config();
// Polyfill for Headers, fetch, and XMLHttpRequest
const whatwgFetch = require('whatwg-fetch');
global.Headers = whatwgFetch.Headers;
global.fetch = whatwgFetch.fetch;
const XMLHttpRequest = require('xhr2');
global.XMLHttpRequest = XMLHttpRequest;
const { createClient } = require('@supabase/supabase-js');
const ws = require('ws');

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.error('Supabase URL and Service Role Key must be provided');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  realtime: {
    transport: ws
  }
});

async function testEvents() {
  try {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .limit(1);

    if (error) {
      console.error('Error selecting from events:', error);
      process.exit(1);
    }

    console.log('Events data:', data);
    console.log('Number of rows:', data.length);
  } catch (error) {
    console.error('Unexpected error:', error);
    process.exit(1);
  }
}

testEvents();
