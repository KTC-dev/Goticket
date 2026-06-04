const express = require('express');
const router = express.Router();

const PRICE_MULTIPLIER = 2.0;
const MIN_TICKET_PRICE = 450.0;

const getLocationPremium = (location) => {
  if (!location) return 0;
  const normalized = location.toLowerCase();
  if (/mexico/.test(normalized)) return 120;
  if (/las vegas|miami|new york|new orleans|los angeles|atlanta|houston|denver|seattle/.test(normalized)) return 80;
  if (/australia/.test(normalized)) return 90;
  if (/canada/.test(normalized)) return 70;
  if (/brazil|argentina/.test(normalized)) return 100;
  if (/england|france|germany|spain|portugal|netherlands/.test(normalized)) return 95;
  if (/japan|korea/.test(normalized)) return 70;
  if (/morocco|nigeria|senegal|cameroon|egypt/.test(normalized)) return 65;
  if (/peru|colombia|uruguay|venezuela|paraguay/.test(normalized)) return 80;
  return 50;
};

const calculatePrice = (basePrice, location) => {
  const premium = getLocationPremium(location);
  const calculatedPrice = basePrice * PRICE_MULTIPLIER + premium;
  return Math.max(calculatedPrice, MIN_TICKET_PRICE);
};

const parseEventMeta = (event) => {
  let meta = {};
  try {
    if (typeof event.description === 'string') {
      meta = JSON.parse(event.description);
    }
  } catch (err) {
    meta = {};
  }

  const basePrice = meta.price ?? event.price ?? 0;

  return {
    category: meta.category ?? event.category ?? 'Match',
    teams: meta.teams ?? event.teams ?? [],
    price: calculatePrice(basePrice, event.location),
    available_tickets: meta.available_tickets ?? event.available_tickets ?? 0,
    total_tickets: meta.total_tickets ?? event.total_tickets ?? 0,
    image_url: meta.image_url ?? event.image_url ?? ''
  };
};

// Get all events
router.get('/', async (req, res) => {
  try {
    const { data: events, error } = await req.supabase
      .from('events')
      .select('id, title, description, starts_at, ends_at, location, category, teams, price, available_tickets, total_tickets, image_url, created_at, updated_at')
      .order('starts_at', { ascending: true });

    if (error) throw error;

    // Transform events to match expected schema
    const transformedEvents = events.map(event => {
      const meta = parseEventMeta(event);
      return {
        id: event.id,
        title: event.title,
        description: event.description,
        date: event.starts_at,
        venue: event.location,
        location: event.location,
        category: meta.category,
        teams: meta.teams,
        price: meta.price,
        available_tickets: meta.available_tickets,
        total_tickets: meta.total_tickets,
        image_url: meta.image_url,
        created_at: event.created_at,
        updated_at: event.updated_at
      };
    });

    res.json(transformedEvents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get event by ID
router.get('/:id', async (req, res) => {
  try {
    const { data: event, error } = await req.supabase
      .from('events')
      .select('id, title, description, starts_at, ends_at, location, category, teams, price, available_tickets, total_tickets, image_url, created_at, updated_at')
      .eq('id', req.params.id)
      .single();

    if (error) throw error;
    if (!event) return res.status(404).json({ message: 'Event not found' });

    const meta = parseEventMeta(event);
    const transformedEvent = {
      id: event.id,
      title: event.title,
      description: event.description,
      date: event.starts_at,
      venue: event.location,
      location: event.location,
      category: meta.category,
      teams: meta.teams,
      price: meta.price,
      available_tickets: meta.available_tickets,
      total_tickets: meta.total_tickets,
      image_url: meta.image_url,
      created_at: event.created_at,
      updated_at: event.updated_at
    };

    res.json(transformedEvent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new event (admin only)
router.post('/', async (req, res) => {
  try {
    const { title, description, date, venue, location, category, teams, price, available_tickets, total_tickets, image_url } = req.body;

    // Prepare description JSON
    const descJson = JSON.stringify({
      category,
      teams,
      price,
      available_tickets,
      total_tickets,
      image_url
    });

    // Use date for both starts_at and ends_at (assuming date is an ISO string)
    const startsAt = new Date(date).toISOString();
    const endsAt = new Date(date).toISOString();

    const { data: newEvent, error } = await req.supabase
      .from('events')
      .insert([
        {
          title,
          description: descJson,
          starts_at: startsAt,
          ends_at: endsAt,
          location: venue // we use venue as location column
        }
      ])
      .select();

    if (error) throw error;

    // Transform the new event to match expected schema
    const transformedEvent = {
      id: newEvent[0].id,
      title: newEvent[0].title,
      description: newEvent[0].description,
      date: newEvent[0].starts_at,
      venue: newEvent[0].location,
      location: newEvent[0].location,
      category,
      teams,
      price,
      available_tickets,
      total_tickets,
      image_url,
      created_at: newEvent[0].created_at,
      updated_at: newEvent[0].updated_at
    };

    res.status(201).json(transformedEvent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update event
router.put('/:id', async (req, res) => {
  try {
    const { title, description, date, venue, location, category, teams, price, available_tickets, total_tickets, image_url } = req.body;

    // Prepare description JSON
    const descJson = JSON.stringify({
      category,
      teams,
      price,
      available_tickets,
      total_tickets,
      image_url
    });

    // Use date for both starts_at and ends_at (assuming date is an ISO string)
    const startsAt = new Date(date).toISOString();
    const endsAt = new Date(date).toISOString();

    const { data: updatedEvent, error } = await req.supabase
      .from('events')
      .update({
        title,
        description: descJson,
        starts_at: startsAt,
        ends_at: endsAt,
        location: venue
      })
      .eq('id', req.params.id)
      .select();

    if (error) throw error;
    if (!updatedEvent || updatedEvent.length === 0) return res.status(404).json({ message: 'Event not found' });

    // Transform the updated event to match expected schema
    const transformedEvent = {
      id: updatedEvent[0].id,
      title: updatedEvent[0].title,
      description: updatedEvent[0].description,
      date: updatedEvent[0].starts_at,
      venue: updatedEvent[0].location,
      location: updatedEvent[0].location,
      category,
      teams,
      price,
      available_tickets,
      total_tickets,
      image_url,
      created_at: updatedEvent[0].created_at,
      updated_at: updatedEvent[0].updated_at
    };

    res.json(transformedEvent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete event
router.delete('/:id', async (req, res) => {
  try {
    const { data: event, error } = await req.supabase
      .from('events')
      .delete()
      .eq('id', req.params.id)
      .select();

    if (error) throw error;
    if (!event || event.length === 0) return res.status(404).json({ message: 'Event not found' });
    res.json({ message: 'Event deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;