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

const discoverActualSchema = async () => {
  try {
    const supabaseUrl = process.env.SUPABASE_URL || '';
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Supabase URL and Service Role Key must be provided in environment variables');
    }
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Let's try to insert a record with just a few columns and see what happens
    // We know id and title work from earlier tests
    
    // Try with just id, title, date
    const testEvent1 = {
      title: 'Test 1',
      date: new Date().toISOString()
    };
    
    const { data: data1, error: error1 } = await supabase
      .from('events')
      .insert([testEvent1])
      .select();
      
    if (error1) {
      console.log('Insert with title, date failed:', error1.message);
    } else {
      console.log('Insert with title, date succeeded:', data1);
      // Clean up
      if (data1 && data1.length > 0) {
        await supabase.from('events').delete().eq('id', data1[0].id);
      }
      return;
    }
    
    // Try with just id, title
    const testEvent2 = {
      title: 'Test 2'
    };
    
    const { data: data2, error: error2 } = await supabase
      .from('events')
      .insert([testEvent2])
      .select();
      
    if (error2) {
      console.log('Insert with title only failed:', error2.message);
    } else {
      console.log('Insert with title only succeeded:', data2);
      // Clean up
      if (data2 && data2.length > 0) {
        await supabase.from('events').delete().eq('id', data2[0].id);
      }
      return;
    }
    
    // Let's try to see what happens if we select * and see what columns come back
    // First, let's see if we can get any rows by not specifying columns
    const { data: allData, error: allError } = await supabase
      .from('events')
      .select('*')
      .limit(1);
      
    if (allError) {
      console.log('Select * failed:', allError);
    } else {
      console.log('Select * returned:', allData);
      if (allData && allData.length > 0) {
        console.log('Columns in existing row:', Object.keys(allData[0]));
      }
    }
    
  } catch (err) {
    console.error('Unexpected error:', err);
  }
};

discoverActualSchema();