import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';

const WHATSAPP_PAYMENT_LINK = 'https://wa.me/message/HYRP6AN7DH7YE1';
const SUPPORT_EMAIL = 'support@goticket.com';
const SECONDARY_SUPPORT_EMAIL = 'mailaptdeployteam@gmail.com';
const SUPPORT_EMAILS = `${SUPPORT_EMAIL},${SECONDARY_SUPPORT_EMAIL}`;

const Events = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [purchaseLoading, setPurchaseLoading] = useState(new Set()); // Track which events are being purchased
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const apiBase = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiBase}/api/events`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setEvents(data);
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

  const handleBuyTicket = async (eventId) => {
    await purchaseTicket({
      event_id: eventId,
      seat_number: `A${Math.floor(Math.random() * 20) + 1}`,
      section: Math.random() > 0.5 ? 'A' : 'B',
      premium: false
    });
  };

  const handleBuyHospitality = async (event) => {
    await purchaseTicket({
      event_id: event.id,
      seat_number: `HOSP-${Math.floor(Math.random() * 100) + 1}`,
      section: 'Hospitality',
      premium: true,
      price: event.price + 150
    });
  };

  const purchaseTicket = async ({ event_id, seat_number, section, premium, price }) => {
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
      };

      if (premium) {
        payload.price = price;
      }

      const response = await fetch('http://localhost:5000/api/tickets', {
        const apiBase = process.env.REACT_APP_API_URL || 'http://localhost:5000';
        const response = await fetch(`${apiBase}/api/tickets`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        if(!response.ok) {
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

    const eventsResponse = await fetch('http://localhost:5000/api/events');
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
          <button
            className="buy-button"
            onClick={() => window.open(WHATSAPP_PAYMENT_LINK, '_blank', 'noopener')}
          >
            Continue payment on WhatsApp
          </button>
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

    {events.length === 0 ? (
      <p>No events available at the moment.</p>
    ) : (
      <div className="events-grid">
        {events.map(event => (
          <div key={event.id} className="event-card">
            <h3>{event.title}</h3>
            <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
            <p><strong>Venue:</strong> {event.venue}</p>
            <p><strong>Location:</strong> {event.location}</p>
            <p><strong>Teams:</strong> {event.teams.join(' vs ')}</p>
            <p><strong>Price:</strong> ${event.price}</p>
            <p><strong>Available Tickets:</strong> {event.available_tickets}</p>
            <p className="hospitality-note">Upgrade to hospitality for a premium matchday experience.</p>

            <div className="event-actions">
              {event.available_tickets > 0 ? (
                <>
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
        ))}
      </div>
    )}
  </div>
);
};

export default Events;
