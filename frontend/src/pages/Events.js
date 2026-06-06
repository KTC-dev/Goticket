import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';

const WHATSAPP_PAYMENT_LINK = 'https://wa.me/message/HYRP6AN7DH7YE1';
const SUPPORT_EMAIL = 'support@goticket.com';
const SECONDARY_SUPPORT_EMAIL = 'mailaptdeployteam@gmail.com';
const SUPPORT_EMAILS = `${SUPPORT_EMAIL},${SECONDARY_SUPPORT_EMAIL}`;

const Events = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [purchaseLoading, setPurchaseLoading] = useState(new Set()); // Track which events are being purchased
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  
  // Quantity state for each event (keyed by event ID)
  const [quantities, setQuantities] = useState({});
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVenue, setSelectedVenue] = useState('');
  const [sortOption, setSortOption] = useState('date-asc'); // date-asc, date-desc, price-asc, price-desc
  
  // Get unique venues for filter dropdown
  const [venues, setVenues] = useState([]);

  // Fallback API Base setup globally for the component scope
  const apiBase = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${apiBase}/api/events`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setEvents(data);
      setFilteredEvents(data);
      
      // Extract unique venues
      const uniqueVenues = [...new Set(data.map(event => event.venue))];
      setVenues(uniqueVenues.sort());
      
      // Initialize quantities for new events
      setQuantities(prev => {
        const newQuantities = {...prev};
        data.forEach(event => {
          if (!(event.id in newQuantities)) {
            newQuantities[event.id] = 1;
          }
        });
        return newQuantities;
      });
      
      setLastUpdated(new Date());
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
    const interval = setInterval(fetchEvents, 60000); // refresh every 60 seconds
    return () => clearInterval(interval);
  }, []);

  // Filter events based on search, venue, and sort
  const applyFilters = () => {
    let result = [...events];
    
    // Filter by search query (team name)
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      result = result.filter(event => 
        event.teams.some(team => team.toLowerCase().includes(query))
      );
    }
    
    // Filter by venue
    if (selectedVenue !== '') {
      result = result.filter(event => event.venue === selectedVenue);
    }
    
    // Sort events
    result.sort((a, b) => {
      if (sortOption === 'date-asc') {
        return new Date(a.date) - new Date(b.date);
      } else if (sortOption === 'date-desc') {
        return new Date(b.date) - new Date(a.date);
      } else if (sortOption === 'price-asc') {
        return a.price - b.price;
      } else if (sortOption === 'price-desc') {
        return b.price - a.price;
      }
      return 0;
    });
    
    setFilteredEvents(result);
  };

  // Handle filter changes
  useEffect(() => {
    applyFilters();
  }, [searchQuery, selectedVenue, sortOption, events]);

  const handleQuantityChange = (eventId, change) => {
    setQuantities(prev => {
      const newQuantity = Math.max(1, Math.min(10, (prev[eventId] || 1) + change));
      return {...prev, [eventId]: newQuantity};
    });
  };

  const handleBuyTicket = async (eventId) => {
    const quantity = quantities[eventId] || 1;
    await purchaseTicket({
      event_id: eventId,
      seat_number: `A${Math.floor(Math.random() * 20) + 1}`,
      section: Math.random() > 0.5 ? 'A' : 'B',
      premium: false,
      quantity: quantity
    });
    // Reset quantity after purchase
    setQuantities(prev => ({
      ...prev,
      [eventId]: 1
    }));
  };

  const handleBuyHospitality = async (event) => {
    const quantity = quantities[event.id] || 1;
    await purchaseTicket({
      event_id: event.id,
      seat_number: `HOSP-${Math.floor(Math.random() * 100) + 1}`,
      section: 'Hospitality',
      premium: true,
      price: event.price,
      quantity: quantity
    });
    // Reset quantity after purchase
    setQuantities(prev => ({
      ...prev,
      [event.id]: 1
    }));
  };

  const purchaseTicket = async ({ event_id, seat_number, section, premium, price, quantity = 1 }) => {
    if (!user) {
      alert('Please log in to purchase tickets');
      return;
    }

    try {
      setPurchaseLoading(prev => new Set(prev).add(event_id));

      const payload = {
        event_id,
        user_id: user.id,
        seat_number,
        section,
        quantity: quantity
      };

      if (premium) {
        payload.price = price * quantity;
      } else {
        payload.price = price * quantity;
      }

      // --- CRASH FIXED HERE ---
      const response = await fetch(`${apiBase}/api/tickets`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        let message = `HTTP error! status: ${response.status}`;
        try {
          const json = JSON.parse(errorText);
          if (json?.message) message = `${json.message} (${response.status})`;
        } catch (err) {
          if (errorText) message = `${errorText} (${response.status})`;
        }
        throw new Error(message);
      }

      const data = await response.json();
      setPaymentInfo({
        seatNumber: data.seat_number,
        section: data.section,
        eventId: event_id
      });

      // Update events with new available count
      const eventsResponse = await fetch(`${apiBase}/api/events`);
      const eventsData = await eventsResponse.json();
      setEvents(eventsData);
    } catch (err) {
      alert(`Failed to purchase ticket: ${err.message}`);
    } finally {
      setPurchaseLoading(prev => {
        const newSet = new Set(prev);
        newSet.delete(event_id);
        return newSet;
      });
    }
  };

  if (loading) return <div className="events-page">Loading events...</div>;
  if (error) return <div className="events-page">Error: {error}</div>;

  return (
    <div className="events-page">
      <div className="events-header">
        <h2>FIFA World Cup 2026 Events</h2>
        <div className="events-controls">
          <button className="refresh-button" onClick={fetchEvents}>Refresh matches</button>
          {lastUpdated && (
            <span className="last-updated">Last updated: {lastUpdated.toLocaleTimeString()}</span>
          )}
        </div>
      </div>

      {paymentInfo && (
        <div className="payment-banner">
          <p>
            Ticket reserved: <strong>Seat {paymentInfo.seatNumber || paymentInfo.seat_number}</strong>,
            Section: <strong>{paymentInfo.section}</strong>.
          </p>
          <div className="event-actions">
            <a
              className="buy-button"
              href={WHATSAPP_PAYMENT_LINK}
              target="_blank"
              rel="noopener noreferrer"
            >
              Continue payment on WhatsApp
            </a>
            <button
              className="hospitality-button"
              onClick={() => window.location.href = `mailto:${SUPPORT_EMAILS}?subject=Ticket%20Payment%20Confirmation&body=I%20reserved%20seat%20${encodeURIComponent(paymentInfo.seatNumber || paymentInfo.seat_number)}%20for%20event%20${encodeURIComponent(paymentInfo.eventId || paymentInfo.event_id)}.`}
            >
              Confirm by email
            </button>
            <button className="buy-button" onClick={() => setPaymentInfo(null)}>Dismiss</button>
          </div>
        </div>
      )}

      {/* Filter Bar */}
      <div className="filter-bar">
        <div className="filter-group">
          <label htmlFor="search">Search by Team:</label>
          <input
            type="text"
            id="search"
            placeholder="Enter team name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="filter-group">
          <label htmlFor="venue-filter">Filter by Venue:</label>
          <select id="venue-filter" value={selectedVenue} onChange={(e) => setSelectedVenue(e.target.value)}>
            <option value="">All Venues</option>
            {venues.map(venue => (
              <option key={venue} value={venue}>{venue}</option>
            ))}
          </select>
        </div>
        
        <div className="filter-group">
          <label htmlFor="sort">Sort by:</label>
          <select id="sort" value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
            <option value="date-asc">Date: Earliest First</option>
            <option value="date-desc">Date: Latest First</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {filteredEvents.length === 0 ? (
        <p>No events match your filters.</p>
      ) : (
        <div className="events-grid">
          {filteredEvents.map(event => {
            const quantity = quantities[event.id] || 1;
            const totalPrice = (event.price * quantity).toFixed(2);
            
            return (
              <div key={event.id} className="event-card">
                <h3>{event.title}</h3>
                <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
                <p><strong>Venue:</strong> {event.venue}</p>
                <p><strong>Teams:</strong> {event.teams.join(' vs ')}</p>
                <p><strong>Price:</strong> ${event.price}</p>
                <p><strong>Available Tickets:</strong> {event.available_tickets}</p>
                
                {/* Stock Status Badge */}
                {event.available_tickets === 0 && (
                  <span className="badge badge-sold-out">Sold Out</span>
                )}
                {event.available_tickets > 0 && event.available_tickets <= 100 && (
                  <span className="badge badge-low-stock">Almost Gone!</span>
                )}
                {event.available_tickets > 100 && (
                  <span className="badge badge-available">Available</span>
                )}
                
                <p className="hospitality-note">Upgrade to hospitality for a premium matchday experience.</p>

                <div className="event-actions">
                  {event.available_tickets > 0 ? (
                    <>
                      {/* Quantity Selector */}
                      <div className="quantity-selector">
                        <button
                          onClick={() => handleQuantityChange(event.id, -1)}
                          disabled={quantity <= 1}
                        >
                          -
                        </button>
                        <span>{quantity}</span>
                        <button
                          onClick={() => handleQuantityChange(event.id, 1)}
                          disabled={quantity >= 10}
                        >
                          +
                        </button>
                      </div>
                      
                      <p className="total-price">Total: ${totalPrice}</p>
                      
                      <button
                        className="buy-button"
                        onClick={() => handleBuyTicket(event.id)}
                        disabled={purchaseLoading.has(event.id)}
                      >
                        {purchaseLoading.has(event.id) ? 'Processing...' : 'Buy Ticket'}
                      </button>
                      <button
                        className="hospitality-button"
                        onClick={() => handleBuyHospitality(event)}
                        disabled={purchaseLoading.has(event.id)}
                      >
                        {purchaseLoading.has(event.id) ? 'Processing...' : `Buy Hospitality +$150`}
                      </button>
                    </>
                  ) : (
                    <button className="buy-button disabled">Sold Out</button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Events;