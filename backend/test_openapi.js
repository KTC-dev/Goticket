require('dotenv').config();
// Polyfill for Headers, fetch, and XMLHttpRequest
const whatwgFetch = require('whatwg-fetch');
global.Headers = whatwgFetch.Headers;
global.fetch = whatwgFetch.fetch;
const XMLHttpRequest = require('xhr2');
global.XMLHttpRequest = XMLHttpRequest;

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

async function test() {
  try {
    const headers = new Headers({
      'apikey': supabaseKey
    });

    // Try OPTIONS on the events endpoint
    const url = `${supabaseUrl}/rest/v1/events`;
    console.log(`Trying OPTIONS ${url}`);
    try {
      const response = await fetch(url, { method: 'OPTIONS', headers });
      console.log(`  Status: ${response.status}`);
      console.log('  Headers:');
      for (let [key, value] of response.headers) {
        console.log(`    ${key}: ${value}`);
      }
      if (response.ok) {
        const text = await response.text();
        console.log(`  Body (first 500 chars): ${text.substring(0, 500)}`);
      } else {
        const text = await response.text();
        console.log(`  Body (first 500 chars): ${text.substring(0, 500)}`);
      }
    } catch (e) {
      console.log(`  Error: ${e.message}`);
    }

    // Try GET with headers to see if we can get the schema from the response? Not likely.
    console.log(`\nTrying GET ${url} with limit=0`);
    try {
      const response = await fetch(`${url}?limit=0`, { headers });
      console.log(`  Status: ${response.status}`);
      console.log('  Headers:');
      for (let [key, value] of response.headers) {
        console.log(`    ${key}: ${value}`);
      }
      if (response.ok) {
        const data = await response.json();
        console.log(`  Body:`, JSON.stringify(data, null, 2));
        if (Array.isArray(data) && data.length > 0) {
          console.log(`  Columns from first row:`, Object.keys(data[0]));
        } else {
          console.log(`  No rows returned`);
        }
      } else {
        const text = await response.text();
        console.log(`  Body (first 500 chars): ${text.substring(0, 500)}`);
      }
    } catch (e) {
      console.log(`  Error: ${e.message}`);
    }
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

test();
