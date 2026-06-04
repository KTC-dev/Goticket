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

const checkTable = async () => {
  try {
    const supabaseUrl = process.env.SUPABASE_URL || '';
    const supabaseKey = process.env.SUPABASE_ANON_KEY || '';

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase URL and Anon Key must be provided in environment variables');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Try to get one profile to see what columns exist
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .limit(1);

    if (error) {
      console.error('Error querying profiles:', error);
      return;
    }

    if (data && data.length > 0) {
      console.log('Columns in profiles table:');
      console.log(Object.keys(data[0]));
      console.log('\nFirst profile:', JSON.stringify(data[0], null, 2));
    } else {
      console.log('No profiles found in table');

      // Try to get table info via a different approach
      const { data: schemaData, error: schemaError } = await supabase
        .from('information_schema.columns')
        .select('column_name, data_type')
        .eq('table_name', 'profiles');

      if (schemaError) {
        console.error('Error getting schema info:', schemaError);
      } else {
        console.log('\nTable schema from information_schema:');
        console.log(schemaData);
      }
    }
  } catch (err) {
    console.error('Unexpected error:', err);
  }
};

checkTable();
