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

const checkEventCount = async () => {
  try {
    const supabaseUrl = process.env.SUPABASE_URL || '';
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Supabase URL and Service Role Key must be provided in environment variables');
    }
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Count events
    const { count, error } = await supabase
      .from('events')
      .select('*', { count: 'exact', head: true });
      
    if (error) {
      console.error('Error counting events:', error);
      return;
    }
    
    console.log(`Number of events in table: ${count}`);
    
    // If there are events, show them
    if (count > 0) {
      const { data, error: dataError } = await supabase
        .from('events')
        .select('*');
        
      if (dataError) {
        console.error('Error fetching events:', dataError);
      } else {
        console.log('Events:', data);
      }
    }
  } catch (err) {
    console.error('Unexpected error:', err);
  }
};

checkEventCount();