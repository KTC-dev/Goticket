const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const cors = require('cors');
require('dotenv').config();

// Polyfills for Node.js 16
const fetch = require('node-fetch');
const { Headers } = require('headers-polyfill');
global.fetch = fetch;
global.Headers = Headers;

// WebSocket setup for Node.js 16
const WebSocket = require('ws');
global.WebSocket = WebSocket;

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Supabase client
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase configuration. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in backend/.env.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Make supabase client available to routes
app.use((req, res, next) => {
  req.supabase = supabase;
  next();
});

// Routes
const eventRoutes = require('./routes/events');
const ticketRoutes = require('./routes/tickets');
const authRoutes = require('./routes/auth');

app.use('/api/events', eventRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Goticket FIFA World Cup API' });
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

server.on('error', (err) => {
  console.error('Server error:', err);
});

module.exports = app;
