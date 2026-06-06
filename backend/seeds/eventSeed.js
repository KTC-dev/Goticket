require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const ws = require('ws');
const fetch = require('node-fetch');
global.Headers = fetch.Headers;
global.Request = fetch.Request;
global.fetch = fetch;

// Real FIFA World Cup 2026 Opening Matches data
const events = [
  {
    title: 'Mexico vs South Africa',
    description: 'Opening match of the FIFA World Cup 2026 tournament',
    date: new Date('2026-06-11T19:00:00Z'),
    venue: 'Estadio Azteca',
    location: 'Mexico City, Mexico',
    category: 'Match',
    teams: ['Mexico', 'South Africa'],
    price: 450,
    available_tickets: 80000,
    total_tickets: 80000,
    image_url: 'https://example.com/images/mexico-vs-southafrica.jpg'
  },
  {
    title: 'Canada vs Switzerland',
    description: 'Group stage match between Canada and Switzerland',
    date: new Date('2026-06-12T17:00:00Z'),
    venue: 'BMO Field',
    location: 'Toronto, Canada',
    category: 'Match',
    teams: ['Canada', 'Switzerland'],
    price: 350,
    available_tickets: 45000,
    total_tickets: 45000,
    image_url: 'https://example.com/images/canada-vs-switzerland.jpg'
  },
  {
    title: 'Brazil vs Morocco',
    description: 'Group stage match between Brazil and Morocco',
    date: new Date('2026-06-13T20:00:00Z'),
    venue: 'MetLife Stadium',
    location: 'East Rutherford, New Jersey',
    category: 'Match',
    teams: ['Brazil', 'Morocco'],
    price: 500,
    available_tickets: 75000,
    total_tickets: 75000,
    image_url: 'https://example.com/images/brazil-vs-morocco.jpg'
  },
  {
    title: 'Argentina vs Algeria',
    description: 'Group stage match between Argentina and Algeria',
    date: new Date('2026-06-16T18:00:00Z'),
    venue: 'Arrowhead Stadium',
    location: 'Kansas City, Missouri',
    category: 'Match',
    teams: ['Argentina', 'Algeria'],
    price: 400,
    available_tickets: 65000,
    total_tickets: 65000,
    image_url: 'https://example.com/images/argentina-vs-algeria.jpg'
  },
  {
    title: 'USA vs Paraguay',
    description: 'Group stage match between USA and Paraguay',
    date: new Date('2026-06-17T19:00:00Z'),
    venue: 'SoFi Stadium',
    location: 'Inglewood, California',
    category: 'Match',
    teams: ['USA', 'Paraguay'],
    price: 300,
    available_tickets: 70000,
    total_tickets: 70000,
    image_url: 'https://example.com/images/usa-vs-paraguay.jpg'
  },
  {
    title: 'Germany vs Ecuador',
    description: 'Group stage match between Germany and Ecuador',
    date: new Date('2026-06-18T18:00:00Z'),
    venue: 'AT&T Stadium',
    location: 'Arlington, Texas',
    category: 'Match',
    teams: ['Germany', 'Ecuador'],
    price: 400,
    available_tickets: 80000,
    total_tickets: 80000,
    image_url: 'https://example.com/images/germany-vs-ecuador.jpg'
  },
  {
    title: 'Spain vs Cape Verde',
    description: 'Group stage match between Spain and Cape Verde',
    date: new Date('2026-06-18T20:00:00Z'),
    venue: 'Mercedes-Benz Stadium',
    location: 'Atlanta, Georgia',
    category: 'Match',
    teams: ['Spain', 'Cape Verde'],
    price: 350,
    available_tickets: 70000,
    total_tickets: 70000,
    image_url: 'https://example.com/images/spain-vs-capecverde.jpg'
  },
  {
    title: 'France vs Senegal',
    description: 'Group stage match between France and Senegal',
    date: new Date('2026-06-19T18:00:00Z'),
    venue: 'MetLife Stadium',
    location: 'East Rutherford, New Jersey',
    category: 'Match',
    teams: ['France', 'Senegal'],
    price: 450,
    available_tickets: 75000,
    total_tickets: 75000,
    image_url: 'https://example.com/images/france-vs-senegal.jpg'
  },
  {
    title: 'England vs Croatia',
    description: 'Group stage match between England and Croatia',
    date: new Date('2026-06-19T20:00:00Z'),
    venue: 'AT&T Stadium',
    location: 'Arlington, Texas',
    category: 'Match',
    teams: ['England', 'Croatia'],
    price: 400,
    available_tickets: 80000,
    total_tickets: 80000,
    image_url: 'https://example.com/images/england-vs-croatia.jpg'
  },
  {
    title: 'Netherlands vs Japan',
    description: 'Group stage match between Netherlands and Japan',
    date: new Date('2026-06-20T19:00:00Z'),
    venue: 'Lumen Field',
    location: 'Seattle, Washington',
    category: 'Match',
    teams: ['Netherlands', 'Japan'],
    price: 350,
    available_tickets: 65000,
    total_tickets: 65000,
    image_url: 'https://example.com/images/netherlands-vs-japan.jpg'
  }
];

const seedEvents = async () => {
  try {
    console.log('Starting seedEvents function');
    // Initialize Supabase client
    const supabaseUrl = process.env.SUPABASE_URL || '';
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase URL and Service Role Key must be provided in environment variables');
    }

    const supabase = createClient(supabaseUrl, supabaseKey, {
      realtime: {
        transport: ws
      },
      fetch: fetch
    });

    // First, let's inspect the events table to see what columns exist
    console.log('Inspecting events table structure...');
    const { data: columnsData, error: columnsError } = await supabase
      .from('information_schema.columns')
      .select('column_name, data_type')
      .eq('table_name', 'events')
      .eq('table_schema', 'public');

    if (columnsError) {
      console.warn('Could not inspect table structure, assuming default columns:', columnsError.message);
      // If we can't inspect, we'll try to work with what we know
      // Proceed with caution
    } else {
      const columnNames = columnsData.map(col => col.column_name);
      console.log('Available columns in events table:', columnNames.join(', '));
    }

    // Clear existing events - try to delete all events
    // We'll try to delete using id column if it exists, otherwise we might need a different approach
    console.log('Clearing existing events...');
    const { data: existingEvents, error: selectError } = await supabase
      .from('events')
      .select('id'); // Try to select id column

    if (selectError) {
      console.warn('Could not select id column, trying to select all columns:', selectError.message);
      // If we can't select id, try selecting * to see what happens
      const { data: allData, error: allError } = await supabase
        .from('events')
        .select('*')
        .limit(1);

      if (allError) {
        console.warn('Could not select any data from events table. Assuming table is empty or inaccessible.');
        // We'll continue and try to insert anyway
      } else {
        console.log('Successfully selected data from events table.');
        // If we got here, we can proceed with deletion
        if (allData.length > 0) {
          console.log('Found existing events, attempting to delete...');
          const { error: deleteError } = await supabase
            .from('events')
            .delete()
            .neq('id', '00000000-0000-0000-0000-000000000000'); // Try to delete all except a dummy ID

          if (deleteError) {
            console.warn('Delete with neq failed:', deleteError.message);
            // Try to delete all records
            const { error: deleteAllError } = await supabase
              .from('events')
              .delete()
              .gt('id', '00000000-0000-0000-0000-000000000000'); // Try another approach

            if (deleteAllError) {
              console.warn('Delete all failed:', deleteAllError.message);
              // We'll continue and try to insert anyway, hoping for the best
            } else {
              console.log('Successfully deleted existing events using gt approach');
            }
          } else {
            console.log('Successfully deleted existing events using neq approach');
          }
        }
      }
    } else {
      console.log(`Found ${existingEvents.length} existing events to delete.`);
      if (existingEvents.length > 0) {
        const { error: deleteError } = await supabase
          .from('events')
          .delete()
          .in('id', existingEvents.map(event => event.id));

        if (deleteError) {
          console.error('Error deleting existing events:', deleteError);
          // Continue anyway
        } else {
          console.log('Successfully deleted existing events');
        }
      }
    }

    // Transform events to match what we think the schema expects
    // Based on our earlier inspection, the table seems to have:
    // id, title, description, starts_at, ends_at, location, created_at, updated_at
    // And description is a JSON string containing category, teams, price, available_tickets, total_tickets, image_url
    const formattedEvents = events.map(event => ({
      title: event.title,
      description: JSON.stringify({
        category: event.category,
        teams: event.teams,
        price: event.price,
        available_tickets: event.available_tickets,
        total_tickets: event.total_tickets,
        image_url: event.image_url
      }),
      starts_at: event.date.toISOString(),
      ends_at: event.date.toISOString(),
      location: event.venue || event.location, // Use venue as location if location is empty
    }));

    // Insert new events
    console.log('Inserting new events...');
    const { data: createdEvents, error: insertError } = await supabase
      .from('events')
      .insert(formattedEvents)
      .select();

    if (insertError) {
      console.error('Error inserting events:', insertError);
      // Let's try a simpler insert with just the basic columns
      console.log('Trying simplified insert with just title and description...');
      const simpleEvents = events.map(event => ({
        title: event.title,
        description: JSON.stringify({
          category: event.category,
          teams: event.teams,
          price: event.price,
          available_tickets: event.available_tickets,
          total_tickets: event.total_tickets,
          image_url: event.image_url
        })
      }));

      const { data: simpleData, error: simpleError } = await supabase
        .from('events')
        .insert(simpleEvents)
        .select();

      if (simpleError) {
        throw simpleError;
      } else {
        console.log(`Successfully inserted ${simpleData.length} events with simplified schema`);
        process.exit(0);
        return;
      }
    } else {
      console.log(`Seeded ${createdEvents.length} events`);
      process.exit(0);
    }
  } catch (error) {
    console.error('Error seeding events:', error);
    process.exit(1);
  }
};

module.exports = seedEvents;

// If this file is run directly, run the seed function
if (require.main === module) {
  console.log('Running seedEvents directly');
  seedEvents();
}