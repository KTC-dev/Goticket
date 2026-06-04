const express = require('express');
const router = express.Router();

const parseEventMeta = (event) => {
  let meta = {};
  try {
    if (typeof event.description === 'string') {
      meta = JSON.parse(event.description);
    }
  } catch (err) {
    meta = {};
  }

  return {
    category: meta.category ?? event.category ?? 'Match',
    teams: meta.teams ?? event.teams ?? [],
    price: meta.price ?? event.price ?? 0,
    available_tickets: meta.available_tickets ?? event.available_tickets ?? 0,
    total_tickets: meta.total_tickets ?? event.total_tickets ?? 0,
    image_url: meta.image_url ?? event.image_url ?? ''
  };
};

const sendSupabaseError = (res, error) => {
  const statusCode = error?.status || 500;
  const message = error?.message || 'Internal Server Error';
  return res.status(statusCode).json({ message });
};

const formatTicketEvent = (event) => {
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
    price: calculatePrice(meta.price, event.location),
    available_tickets: meta.available_tickets,
    total_tickets: meta.total_tickets,
    image_url: meta.image_url
  };
};

const isValidUUID = (value) => {
  return typeof value === 'string' && /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(value);
};

const DEFAULT_TICKET_STATUS = 'pending';
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

// Get all tickets with event and user details
router.get('/', async (req, res) => {
  try {
    const { data: tickets, error } = await req.supabase
      .from('tickets')
      .select(`
        *,
        event:event_id(id, title, description, starts_at, ends_at, location, category, teams, price, available_tickets, total_tickets, image_url)
      `);

    if (error) throw error;

    // Transform event data to match expected shape
    const transformedTickets = tickets.map(ticket => {
      if (ticket.event) {
        ticket.event = formatTicketEvent(ticket.event);
      }
      return ticket;
    });

    res.json(transformedTickets);
  } catch (error) {
    return sendSupabaseError(res, error);
  }
});

// Get ticket by ID with event and user details
router.get('/:id', async (req, res) => {
  if (!isValidUUID(req.params.id)) {
    return res.status(400).json({ message: 'Invalid ticket id' });
  }

  try {
    const { data: ticket, error } = await req.supabase
      .from('tickets')
      .select(`
        *,
        event:event_id(id, title, description, starts_at, ends_at, location, category, teams, price, available_tickets, total_tickets, image_url)
      `)
      .eq('id', req.params.id)
      .single();

    if (error) throw error;
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });

    // Transform event data
    if (ticket.event) {
      ticket.event = formatTicketEvent(ticket.event);
    }

    res.json(ticket);
  } catch (error) {
    return sendSupabaseError(res, error);
  }
});

// Create new ticket
router.post('/', async (req, res) => {
  const event_id = req.body.event_id || req.body.eventId;
  const user_id = req.body.user_id || req.body.userId;
  const seat_number = req.body.seat_number || req.body.seatNumber;
  const section = req.body.section;
  const priceOverride = typeof req.body.price === 'number' ? req.body.price : undefined;

  if (!event_id) return res.status(400).json({ message: 'event_id is required' });
  if (!isValidUUID(event_id)) return res.status(400).json({ message: 'event_id must be a valid UUID' });
  if (!user_id) return res.status(400).json({ message: 'user_id is required' });
  if (!isValidUUID(user_id)) return res.status(400).json({ message: 'user_id must be a valid UUID' });
  if (!seat_number) return res.status(400).json({ message: 'seat_number is required' });
  if (!section) return res.status(400).json({ message: 'section is required' });

  try {
    const { data: event, error: eventError } = await req.supabase
      .from('events')
      .select('id, description, price, available_tickets, category, teams, total_tickets, image_url, starts_at, ends_at, location')
      .eq('id', event_id)
      .single();

    if (eventError) throw eventError;
    if (!event) return res.status(404).json({ message: 'Event not found' });

    const meta = parseEventMeta(event);
    const available_tickets = meta.available_tickets;
    const rawPrice = priceOverride ?? calculatePrice(meta.price, event.location);
    const ticketPrice = Math.max(rawPrice, MIN_TICKET_PRICE);

    if (available_tickets <= 0) {
      return res.status(400).json({ message: 'No tickets available for this event' });
    }

    const ticketPayload = {
      event_id,
      user_id,
      seat_number,
      section,
      price: ticketPrice,
      status: DEFAULT_TICKET_STATUS
    };

    let insertAttempt = await req.supabase.from('tickets').insert([ticketPayload]).select();
    if (insertAttempt.error) {
      const message = insertAttempt.error.message || '';
      if (/status/i.test(message)) {
        // Database may not have 'status' column yet; retry without it
        delete ticketPayload.status;
        insertAttempt = await req.supabase.from('tickets').insert([ticketPayload]).select();
      }
    }

    if (insertAttempt.error) throw insertAttempt.error;
    const newTicket = insertAttempt.data;

    const newAvailable = available_tickets - 1;
    const updatePayload = { available_tickets: newAvailable };

    try {
      const currentMeta = JSON.parse(event.description);
      updatePayload.description = JSON.stringify({
        ...currentMeta,
        available_tickets: newAvailable
      });
    } catch (err) {
      // Keep description unchanged if it is plain text
    }

    const { data: updatedEvent, error: updateError } = await req.supabase
      .from('events')
      .update(updatePayload)
      .eq('id', event_id)
      .select();

    if (updateError) throw updateError;

    const { data: ticketWithDetails, error: detailsError } = await req.supabase
      .from('tickets')
      .select(`
        *,
        event:event_id(id, title, description, starts_at, ends_at, location, category, teams, price, available_tickets, total_tickets, image_url)
      `)
      .eq('id', newTicket[0].id)
      .single();

    if (detailsError) throw detailsError;

    if (ticketWithDetails.event) {
      ticketWithDetails.event = formatTicketEvent(ticketWithDetails.event);
    }

    res.status(201).json(ticketWithDetails);
  } catch (error) {
    return sendSupabaseError(res, error);
  }
});

// Update ticket status
router.put('/:id', async (req, res) => {
  if (!isValidUUID(req.params.id)) {
    return res.status(400).json({ message: 'Invalid ticket id' });
  }

  try {
    const { data: ticket, error } = await req.supabase
      .from('tickets')
      .update(req.body)
      .eq('id', req.params.id)
      .select();

    if (error) throw error;
    if (!ticket || ticket.length === 0) return res.status(404).json({ message: 'Ticket not found' });
    res.json(ticket[0]);
  } catch (error) {
    return sendSupabaseError(res, error);
  }
});

// Get tickets by user ID
router.get('/user/:userId', async (req, res) => {
  if (!isValidUUID(req.params.userId)) {
    return res.status(400).json({ message: 'Invalid user id' });
  }

  try {
    const { data: tickets, error } = await req.supabase
      .from('tickets')
      .select(`
        *,
        event:event_id(id, title, description, starts_at, ends_at, location, category, teams, price, available_tickets, total_tickets, image_url)
      `)
      .eq('user_id', req.params.userId);

    if (error) throw error;

    // Transform event data
    const transformedTickets = tickets.map(ticket => {
      if (ticket.event) {
        ticket.event = formatTicketEvent(ticket.event);
      }
      return ticket;
    });

    res.json(transformedTickets);
  } catch (error) {
    return sendSupabaseError(res, error);
  }
});

module.exports = router;