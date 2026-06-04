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

const checkExistingColumns = async () => {
  try {
    const supabaseUrl = process.env.SUPABASE_URL || '';
    const supabaseKey = process.env.SUPABASE_ANON_KEY || '';
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase URL and Anon Key must be provided in environment variables');
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Try to select just id and title to see if those exist
    const { data, error } = await supabase
      .from('events')
      .select('id, title')
      .limit(1);
    
    if (error) {
      console.error('Error selecting id, title:', error);
      
      // Try even simpler - just select all columns (let Supabase decide what to return)
      const { data: allData, error: allError } = await supabase
        .from('events')
        .select('*')
        .limit(1);
        
      if (allError) {
        console.error('Error selecting all:', allError);
      } else {
        console.log('Select * worked:', allData);
      }
      return;
    }
    
    console.log('Successfully selected id, title:', data);
    
    // If that works, try to get more columns
    const { data: moreData, error: moreError } = await supabase
      .from('events')
      .select('id, title, date, venue')
      .limit(1);
      
    if (moreError) {
      console.error('Error selecting id, title, date, venue:', moreError);
    } else {
      console.log('Successfully selected id, title, date, venue:', moreData);
    }
  } catch (err) {
    console.error('Unexpected error:', err);
  }
};

checkExistingColumns();