require('dotenv').config();
const fetch = require('node-fetch');
global.fetch = fetch;
global.Headers = fetch.Headers;
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

async function inspectEventsTable() {
  try {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .limit(1);

    if (error) {
      console.error('Error selecting from events:', error);
      process.exit(1);
    }

    if (data.length === 0) {
      console.log('No events found in the table');
      return;
    }

    const event = data[0];
    console.log('Columns in events table:');
    for (const key in event) {
      console.log(`  ${key}: ${JSON.stringify(event[key])}`);
    }
  } catch (error) {
    console.error('Unexpected error:', error);
    process.exit(1);
  }
}

inspectEventsTable();
