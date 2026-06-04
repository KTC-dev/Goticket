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

const discoverTableStructure = async () => {
  try {
    const supabaseUrl = process.env.SUPABASE_URL || '';
    const supabaseKey = process.env.SUPABASE_ANON_KEY || '';
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase URL and Anon Key must be provided in environment variables');
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Try to insert a minimal event with just id and title
    const testEvent = {
      id: '00000000-0000-0000-0000-000000000001', // Provide a specific ID to avoid conflicts
      title: 'Test Event'
    };
    
    const { data, error } = await supabase
      .from('events')
      .insert([testEvent])
      .select();
    
    if (error) {
      console.error('Error inserting minimal event:', error);
      
      // Try without specifying id (let it be generated)
      const testEvent2 = {
        title: 'Test Event 2'
      };
      
      const { data: data2, error: error2 } = await supabase
        .from('events')
        .insert([testEvent2])
        .select();
        
      if (error2) {
        console.error('Error inserting event without ID:', error2);
      } else {
        console.log('Successfully inserted event with auto-generated ID:', data2);
        
        // Now let's see what columns were actually inserted by trying to select them
        if (data2 && data2.length > 0) {
          const insertedId = data2[0].id;
          const { data: selectData, error: selectError } = await supabase
            .from('events')
            .select('*')
            .eq('id', insertedId)
            .single();
            
          if (selectError) {
            console.error('Error selecting inserted event:', selectError);
          } else {
            console.log('Inserted event columns:', Object.keys(selectData));
            console.log('Inserted event data:', selectData);
            
            // Clean up
            const { error: deleteError } = await supabase
              .from('events')
              .delete()
              .eq('id', insertedId);
              
            if (deleteError) {
              console.error('Error cleaning up:', deleteError);
            } else {
              console.log('Cleaned up test event');
            }
          }
        }
      }
      return;
    }
    
    console.log('Successfully inserted minimal event:', data);
  } catch (err) {
    console.error('Unexpected error:', err);
  }
};

discoverTableStructure();