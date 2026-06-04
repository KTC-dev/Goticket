require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const ws = require('ws');
const fetch = require('node-fetch');
global.Headers = fetch.Headers;
global.Request = fetch.Request;
global.fetch = fetch;

const events = [
  {
    title: 'FIFA World Cup 2026 - Opening Match',
    description: 'The opening match of the FIFA World Cup 2026 tournament',
    date: new Date('2026-06-11T19:00:00Z'),
    venue: 'Estadio Azteca',
    location: 'Mexico City, Mexico',
    category: 'Opening Ceremony',
    teams: ['Mexico', 'Canada'],
    price: 250,
    available_tickets: 50000,
    total_tickets: 50000,
    image_url: 'https://example.com/images/worldcup-opening.jpg'
  },
  {
    title: 'FIFA World Cup 2026 - USA vs Panama',
    description: 'Group stage match between USA and Panama',
    date: new Date('2026-06-12T17:00:00Z'),
    venue: 'SoFi Stadium',
    location: 'Inglewood, USA',
    category: 'Match',
    teams: ['USA', 'Panama'],
    price: 180,
    available_tickets: 65000,
    total_tickets: 65000,
    image_url: 'https://example.com/images/usa-vs-panama.jpg'
  },
  {
    title: 'FIFA World Cup 2026 - Brazil vs Argentina',
    description: 'Group stage clash between South American rivals',
    date: new Date('2026-06-13T20:00:00Z'),
    venue: 'AT&T Stadium',
    location: 'Arlington, USA',
    category: 'Match',
    teams: ['Brazil', 'Argentina'],
    price: 260,
    available_tickets: 70000,
    total_tickets: 70000,
    image_url: 'https://example.com/images/brazil-vs-argentina.jpg'
  },
  {
    title: 'FIFA World Cup 2026 - Germany vs France',
    description: 'European powerhouses meet in a group stage thriller',
    date: new Date('2026-06-14T19:00:00Z'),
    venue: 'Arrowhead Stadium',
    location: 'Kansas City, USA',
    category: 'Match',
    teams: ['Germany', 'France'],
    price: 240,
    available_tickets: 62000,
    total_tickets: 62000,
    image_url: 'https://example.com/images/germany-vs-france.jpg'
  },
  {
    title: 'FIFA World Cup 2026 - England vs Spain',
    description: 'Top group stage match between England and Spain',
    date: new Date('2026-06-15T18:00:00Z'),
    venue: 'Mercedes-Benz Stadium',
    location: 'Atlanta, USA',
    category: 'Match',
    teams: ['England', 'Spain'],
    price: 230,
    available_tickets: 68000,
    total_tickets: 68000,
    image_url: 'https://example.com/images/england-vs-spain.jpg'
  },
  {
    title: 'FIFA World Cup 2026 - Japan vs South Korea',
    description: 'Asian rivalry in the group stage',
    date: new Date('2026-06-16T16:00:00Z'),
    venue: 'NRG Stadium',
    location: 'Houston, USA',
    category: 'Match',
    teams: ['Japan', 'South Korea'],
    price: 190,
    available_tickets: 61000,
    total_tickets: 61000,
    image_url: 'https://example.com/images/japan-vs-southkorea.jpg'
  },
  {
    title: 'FIFA World Cup 2026 - Morocco vs Nigeria',
    description: 'African rivals face off in a dramatic group contest',
    date: new Date('2026-06-17T18:00:00Z'),
    venue: 'Bank of America Stadium',
    location: 'Charlotte, USA',
    category: 'Match',
    teams: ['Morocco', 'Nigeria'],
    price: 180,
    available_tickets: 59000,
    total_tickets: 59000,
    image_url: 'https://example.com/images/morocco-vs-nigeria.jpg'
  },
  {
    title: 'FIFA World Cup 2026 - Australia vs Ecuador',
    description: 'Oceania vs South America in the group stage',
    date: new Date('2026-06-18T17:00:00Z'),
    venue: 'Mercedes-Benz Stadium',
    location: 'Atlanta, USA',
    category: 'Match',
    teams: ['Australia', 'Ecuador'],
    price: 190,
    available_tickets: 60000,
    total_tickets: 60000,
    image_url: 'https://example.com/images/australia-vs-ecuador.jpg'
  },
  {
    title: 'FIFA World Cup 2026 - Portugal vs Netherlands',
    description: 'European giants contest a must-win group match',
    date: new Date('2026-06-19T20:00:00Z'),
    venue: 'Allegiant Stadium',
    location: 'Las Vegas, USA',
    category: 'Match',
    teams: ['Portugal', 'Netherlands'],
    price: 240,
    available_tickets: 66000,
    total_tickets: 66000,
    image_url: 'https://example.com/images/portugal-vs-netherlands.jpg'
  },
  {
    title: 'FIFA World Cup 2026 - Belgium vs Denmark',
    description: 'Midweek group stage matchup between Belgium and Denmark',
    date: new Date('2026-06-20T17:00:00Z'),
    venue: 'Lumen Field',
    location: 'Seattle, USA',
    category: 'Match',
    teams: ['Belgium', 'Denmark'],
    price: 190,
    available_tickets: 63000,
    total_tickets: 63000,
    image_url: 'https://example.com/images/belgium-vs-denmark.jpg'
  },
  {
    title: 'FIFA World Cup 2026 - Uruguay vs Colombia',
    description: 'South American showdown in the group stage',
    date: new Date('2026-06-21T16:00:00Z'),
    venue: 'NRG Stadium',
    location: 'Houston, USA',
    category: 'Match',
    teams: ['Uruguay', 'Colombia'],
    price: 185,
    available_tickets: 62000,
    total_tickets: 62000,
    image_url: 'https://example.com/images/uruguay-vs-colombia.jpg'
  },
  {
    title: 'FIFA World Cup 2026 - Italy vs Switzerland',
    description: 'Classic European encounter in group play',
    date: new Date('2026-06-22T18:00:00Z'),
    venue: "Levi's Stadium",
    location: 'Santa Clara, USA',
    category: 'Match',
    teams: ['Italy', 'Switzerland'],
    price: 215,
    available_tickets: 64000,
    total_tickets: 64000,
    image_url: 'https://example.com/images/italy-vs-switzerland.jpg'
  },
  {
    title: 'FIFA World Cup 2026 - Senegal vs Cameroon',
    description: 'African talent clash in the group stage',
    date: new Date('2026-06-23T19:00:00Z'),
    venue: 'Gillette Stadium',
    location: 'Foxborough, USA',
    category: 'Match',
    teams: ['Senegal', 'Cameroon'],
    price: 170,
    available_tickets: 58000,
    total_tickets: 58000,
    image_url: 'https://example.com/images/senegal-vs-cameroon.jpg'
  },
  {
    title: 'FIFA World Cup 2026 - Croatia vs Serbia',
    description: 'Rival nations meet in a high-energy group fixture',
    date: new Date('2026-06-24T17:00:00Z'),
    venue: 'Lincoln Financial Field',
    location: 'Philadelphia, USA',
    category: 'Match',
    teams: ['Croatia', 'Serbia'],
    price: 200,
    available_tickets: 65000,
    total_tickets: 65000,
    image_url: 'https://example.com/images/croatia-vs-serbia.jpg'
  },
  {
    title: 'FIFA World Cup 2026 - Egypt vs Iran',
    description: 'Middle Eastern pride on the world stage',
    date: new Date('2026-06-25T16:00:00Z'),
    venue: 'FirstEnergy Stadium',
    location: 'Cleveland, USA',
    category: 'Match',
    teams: ['Egypt', 'Iran'],
    price: 165,
    available_tickets: 57000,
    total_tickets: 57000,
    image_url: 'https://example.com/images/egypt-vs-iran.jpg'
  },
  {
    title: 'FIFA World Cup 2026 - Venezuela vs Peru',
    description: 'South American group stage rivalry',
    date: new Date('2026-06-26T18:00:00Z'),
    venue: 'FedExField',
    location: 'Landover, USA',
    category: 'Match',
    teams: ['Venezuela', 'Peru'],
    price: 110,
    available_tickets: 56000,
    total_tickets: 56000,
    image_url: 'https://example.com/images/venezuela-vs-peru.jpg'
  },
  {
    title: 'FIFA World Cup 2026 - Ghana vs Costa Rica',
    description: 'Central American and African teams battle for points',
    date: new Date('2026-06-27T17:00:00Z'),
    venue: 'Bank of America Stadium',
    location: 'Charlotte, USA',
    category: 'Match',
    teams: ['Ghana', 'Costa Rica'],
    price: 105,
    available_tickets: 55000,
    total_tickets: 55000,
    image_url: 'https://example.com/images/ghana-vs-costarica.jpg'
  },
  {
    title: 'FIFA World Cup 2026 - Qatar vs Saudi Arabia',
    description: 'West Asian showdown in the group stage',
    date: new Date('2026-06-28T20:00:00Z'),
    venue: 'Empower Field at Mile High',
    location: 'Denver, USA',
    category: 'Match',
    teams: ['Qatar', 'Saudi Arabia'],
    price: 115,
    available_tickets: 57000,
    total_tickets: 57000,
    image_url: 'https://example.com/images/qatar-vs-saudiarabia.jpg'
  },
  {
    title: 'FIFA World Cup 2026 - Poland vs Czech Republic',
    description: 'European group match with plenty of drama',
    date: new Date('2026-06-29T18:00:00Z'),
    venue: 'Caesars Superdome',
    location: 'New Orleans, USA',
    category: 'Match',
    teams: ['Poland', 'Czech Republic'],
    price: 130,
    available_tickets: 59000,
    total_tickets: 59000,
    image_url: 'https://example.com/images/poland-vs-czech.jpg'
  },
  {
    title: 'FIFA World Cup 2026 - Turkey vs Chile',
    description: 'A tense match between Turkey and Chile',
    date: new Date('2026-06-30T19:00:00Z'),
    venue: 'Hard Rock Stadium',
    location: 'Miami Gardens, USA',
    category: 'Match',
    teams: ['Turkey', 'Chile'],
    price: 125,
    available_tickets: 58000,
    total_tickets: 58000,
    image_url: 'https://example.com/images/turkey-vs-chile.jpg'
  },
  {
    title: 'FIFA World Cup 2026 - Algeria vs Bolivia',
    description: 'Emerging nations face off in group stage action',
    date: new Date('2026-07-01T17:00:00Z'),
    venue: 'Caesars Superdome',
    location: 'New Orleans, USA',
    category: 'Match',
    teams: ['Algeria', 'Bolivia'],
    price: 100,
    available_tickets: 54000,
    total_tickets: 54000,
    image_url: 'https://example.com/images/algeria-vs-bolivia.jpg'
  },
  {
    title: 'FIFA World Cup 2026 - Paraguay vs Scotland',
    description: 'South American grit meets Scottish determination',
    date: new Date('2026-07-02T18:00:00Z'),
    venue: 'Optus Stadium',
    location: 'Perth, Australia',
    category: 'Match',
    teams: ['Paraguay', 'Scotland'],
    price: 120,
    available_tickets: 62000,
    total_tickets: 62000,
    image_url: 'https://example.com/images/paraguay-vs-scotland.jpg'
  },
  {
    title: 'FIFA World Cup 2026 - Wales vs Greece',
    description: 'European clash as Wales takes on Greece',
    date: new Date('2026-07-03T19:00:00Z'),
    venue: 'Suncorp Stadium',
    location: 'Brisbane, Australia',
    category: 'Match',
    teams: ['Wales', 'Greece'],
    price: 115,
    available_tickets: 60000,
    total_tickets: 60000,
    image_url: 'https://example.com/images/wales-vs-greece.jpg'
  },
  {
    title: 'FIFA World Cup 2026 - New Zealand vs Jamaica',
    description: 'A Pacific showdown with Caribbean flair',
    date: new Date('2026-07-04T20:00:00Z'),
    venue: 'Melbourne Cricket Ground',
    location: 'Melbourne, Australia',
    category: 'Match',
    teams: ['New Zealand', 'Jamaica'],
    price: 105,
    available_tickets: 63000,
    total_tickets: 63000,
    image_url: 'https://example.com/images/newzealand-vs-jamaica.jpg'
  },
  {
    title: 'FIFA World Cup 2026 - Quarterfinal 1',
    description: 'First knockout quarterfinal with the tournament in full swing',
    date: new Date('2026-07-07T18:00:00Z'),
    venue: 'MetLife Stadium',
    location: 'East Rutherford, USA',
    category: 'Quarterfinal',
    teams: ['TBD', 'TBD'],
    price: 300,
    available_tickets: 60000,
    total_tickets: 60000,
    image_url: 'https://example.com/images/quarterfinal1.jpg'
  },
  {
    title: 'FIFA World Cup 2026 - Semifinal 1',
    description: 'First semifinal match of the tournament',
    date: new Date('2026-07-10T18:00:00Z'),
    venue: 'Hard Rock Stadium',
    location: 'Miami Gardens, USA',
    category: 'Semifinal',
    teams: ['TBD', 'TBD'],
    price: 350,
    available_tickets: 58000,
    total_tickets: 58000,
    image_url: 'https://example.com/images/semifinal1.jpg'
  },
  {
    title: 'FIFA World Cup 2026 - Final',
    description: 'The final match to determine the World Cup champion',
    date: new Date('2026-07-14T16:00:00Z'),
    venue: 'Azteca Stadium',
    location: 'Mexico City, Mexico',
    category: 'Final',
    teams: ['TBD', 'TBD'],
    price: 500,
    available_tickets: 45000,
    total_tickets: 45000,
    image_url: 'https://example.com/images/worldcup-final.jpg'
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
