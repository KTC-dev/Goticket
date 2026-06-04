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

const checkLocationField = async () => {
  try {
    const supabaseUrl = process.env.SUPABASE_URL || '';
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Supabase URL and Service Role Key must be provided in environment variables');
    }
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Insert a test event with location data
    const testEvent = {
      title: 'Test Event for Location',
      description: 'Test description',
      starts_at: new Date('2026-06-11T19:00:00Z').toISOString(),
      ends_at: new Date('2026-06-11T22:00:00Z').toISOString(),
      location: 'Mexico City, Mexico' // This is what we're putting in the location field
    };
    
    const { data, error } = await supabase
      .from('events')
      .insert([testEvent])
      .select();
      
    if (error) {
      console.error('Error inserting test event:', error);
      return;
    }
    
    console.log('Inserted event:', JSON.stringify(data, null, 2));
    
    // Clean up
    if (data && data.length > 0) {
      const { error: deleteError } = await supabase
        .from('events')
        .delete()
        .eq('id', data[0].id);
        
      if (deleteError) {
        console.error('Error cleaning up:', deleteError);
      }
    }
  } catch (err) {
    console.error('Unexpected error:', err);
  }
};

checkLocationField();