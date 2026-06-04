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

const testWithServiceRole = async () => {
  try {
    const supabaseUrl = process.env.SUPABASE_URL || '';
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Supabase URL and Service Role Key must be provided in environment variables');
    }
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Try to select id and title to see if we can read
    const { data, error } = await supabase
      .from('events')
      .select('id, title')
      .limit(1);
    
    if (error) {
      console.error('Error selecting with service role:', error);
      return;
    }
    
    console.log('Successfully selected with service role:', data);
    
    // Try to insert a test event
    const testEvent = {
      title: 'Test Event with Service Role',
      description: 'Test description',
      date: new Date().toISOString(),
      venue: 'Test Venue',
      location: 'Test Location',
      category: 'Test',
      teams: ['Team A', 'Team B'],
      price: 100,
      available_tickets: 50,
      total_tickets: 50,
      image_url: 'https://example.com/test.jpg'
    };
    
    const { data: insertData, error: insertError } = await supabase
      .from('events')
      .insert([testEvent])
      .select();
      
    if (insertError) {
      console.error('Error inserting with service role:', insertError);
      return;
    }
    
    console.log('Successfully inserted with service role:', insertData);
    
    // Clean up
    if (insertData && insertData.length > 0) {
      const { error: deleteError } = await supabase
        .from('events')
        .delete()
        .eq('id', insertData[0].id);
        
      if (deleteError) {
        console.error('Error deleting test event:', deleteError);
      } else {
        console.log('Test event cleaned up');
      }
    }
  } catch (err) {
    console.error('Unexpected error:', err);
  }
};

testWithServiceRole();