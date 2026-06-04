import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';

const WHATSAPP_PAYMENT_LINK = 'https://wa.me/message/HYRP6AN7DH7YE1';
const SUPPORT_EMAIL = 'support@goticket.com';
const SECONDARY_SUPPORT_EMAIL = 'mailaptdeployteam@gmail.com';
const SUPPORT_EMAILS = `${SUPPORT_EMAIL},${SECONDARY_SUPPORT_EMAIL}`;

const isPendingStatus = (status) => {
  return status === 'pending' || status === 'reserved' || status === null || status === undefined;
};

const Tickets = () => {
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const hasPendingPayment = tickets.some(ticket => isPendingStatus(ticket.status));

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setLoading(true);
        // If user is not authenticated, redirect to login
        if (!user) {
          // In a real app, you might want to redirect to login
          // For now, we'll just set loading to false and show empty state
          setLoading(false);
          return;
        }

        const response = await fetch(`http://localhost:5000/api/tickets/user/${user.id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setTickets(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchTickets();
  }, [user]); // Re-run effect when user changes

  if (loading) return <div className="tickets-page">Loading your tickets...</div>;
  if (error) return <div className="tickets-page">Error: {error}</div>;

  return (
    <div className="tickets-page">
      <h2>My Tickets</h2>
      {hasPendingPayment && (
        <div className="payment-instructions">
          <h3>Payment Instructions</h3>
          <p>Your ticket is pending. Complete payment and confirm with support to finalize your booking.</p>
          <p>
            Message us directly on WhatsApp for payment confirmation:
            <a href={WHATSAPP_PAYMENT_LINK} target="_blank" rel="noreferrer noopener">
              {WHATSAPP_PAYMENT_LINK}
            </a>
          </p>
          <p>
            Or email us as a second option:
            <a href={`mailto:${SUPPORT_EMAILS}?subject=Ticket%20Payment%20Confirmation`}>
              {SUPPORT_EMAIL} or {SECONDARY_SUPPORT_EMAIL}
            </a>
          </p>
        </div>
      )}
      {!user ? (
        <div className="auth-message">
          <p>Please log in to view your tickets.</p>
          <p><a href="/login">Log in</a> or <a href="/register">Register</a></p>
        </div>
      ) : (
        <>
          {tickets.length === 0 ? (
            <>
              <p>You haven't purchased any tickets yet.</p>
              <p><a href="/events">Browse Events</a></p>
            </>
          ) : (
            <div className="tickets-grid">
              {tickets.map(ticket => (
                <div key={ticket.id} className="ticket-card">
                  <h3>{ticket.event?.title || 'Event Title'}</h3>
                  <p><strong>Date:</strong> {ticket.event ? new Date(ticket.event.date).toLocaleDateString() : 'TBD'}</p>
                  <p><strong>Venue:</strong> {ticket.event?.venue || 'TBD'}</p>
                  <p><strong>Seat:</strong> {ticket.seat_number}</p>
                  <p><strong>Section:</strong> {ticket.section}</p>
                  <p><strong>Price:</strong> ${ticket.price}</p>
                  <p><strong>Status:</strong>
                    <span className={`status-${(ticket.status || 'pending').toLowerCase()}`}>
                      {ticket.status ? ticket.status : 'Pending'}
                    </span>
                  </p>
                  {isPendingStatus(ticket.status) && (
                    <div className="pending-actions">
                      <a
                        className="buy-button"
                        href={WHATSAPP_PAYMENT_LINK}
                        target="_blank"
                        rel="noreferrer noopener"
                      >
                        Continue payment on WhatsApp
                      </a>
                      <a
                        className="hospitality-button"
                        href={`mailto:${SUPPORT_EMAILS}?subject=Ticket%20Payment%20Confirmation`}
                      >
                        Confirm by email
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Tickets;
