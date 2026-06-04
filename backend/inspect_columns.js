require('dotenv').config();
// Polyfill for Headers, fetch, and XMLHttpRequest (in case we need them for other things)
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

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseKey, {
  realtime: {
    transport: ws
  }
});

async function main() {
  try {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .limit(10);

    if (error) {
      throw error;
    }

    if (data.length === 0) {
      console.log('No rows found in events table.');
      return;
    }

    // Collect all column names from all rows
    const columnSet = new Set();
    data.forEach(row => {
      for (const key of Object.keys(row)) {
        columnSet.add(key);
      }
    });

    const columns = Array.from(columnSet).sort();

    console.log('Columns in events table:');
    for (const column of columns) {
      // Guess the type by looking at the first non-null value in the rows
      let sampleValue = null;
      for (const row of data) {
        if (row[column] !== null) {
          sampleValue = row[column];
          break;
        }
      }
      let type = 'unknown';
      if (sampleValue === null) {
        type = 'null (all sampled values are null)';
      } else if (typeof sampleValue === 'string') {
        type = 'string';
      } else if (typeof sampleValue === 'number') {
        type = 'number';
      } else if (typeof sampleValue === 'boolean') {
        type = 'boolean';
      } else if (sampleValue instanceof Date) {
        type = 'date';
      } else {
        type = typeof sampleValue;
      }
      console.log(`  ${column}: ${type}`);
    }
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main();
