require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const fetch = require('node-fetch');
global.fetch = fetch;
global.Headers = fetch.Headers;
const WebSocket = require('ws');
global.WebSocket = WebSocket;

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.error('Supabase URL and Service Role Key must be provided');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  realtime: {
    websocket: WebSocket,
  },
});

async function inspectTicketsTable() {
  try {
    const { data, error } = await supabase
      .from('tickets')
      .select('*')
      .limit(1);

    if (error) {
      console.error('Error selecting from tickets:', error);
      process.exit(1);
    }

    if (data.length === 0) {
      console.log('No tickets found in the table');
      return;
    }

    const ticket = data[0];
    console.log('Columns in tickets table:');
    for (const key in ticket) {
      console.log(`  ${key}: ${JSON.stringify(ticket[key])}`);
    }
  } catch (error) {
    console.error('Unexpected error:', error);
    process.exit(1);
  }
}

inspectTicketsTable();