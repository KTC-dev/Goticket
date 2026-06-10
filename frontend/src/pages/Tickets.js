import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';

const WHATSAPP_PAYMENT_LINK = 'https://wa.me/message/HYRP6AN7DH7YE1';
const SUPPORT_EMAIL = 'support@goticket.com';
const SECONDARY_SUPPORT_EMAIL = 'mailaptdeployteam@gmail.com';
const SUPPORT_EMAILS = `${SUPPORT_EMAIL},${SECONDARY_SUPPORT_EMAIL}`;

const Tickets = () => {
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      setLoading(true);
      const stored = localStorage.getItem('goticket_orders');
      if (stored) {
        const orders = JSON.parse(stored);
        setTickets(orders);
      } else {
        setTickets([]);
      }
    } catch (err) {
      setTickets([]);
    } finally {
      setLoading(false);
    }
  }, []);

  if (loading) return <div className="tickets-page">Loading your tickets...</div>;

  return (
    <div className="tickets-page" style={{
      overflowX: "hidden",
      width: "100%",
      maxWidth: "100%"
    }}>
      <h2>My Tickets</h2>
      {tickets.length === 0 ? (
        <>
          <p>You have no tickets yet.</p>
          <p><a href="/events" className="btn btn-primary">Browse Events</a></p>
        </>
      ) : (
        <div className="tickets-grid">
          {tickets.map(ticket => (
            <div key={ticket.id} className="ticket-card">
              <h3>{ticket.matchName}</h3>
              <p><strong>Teams:</strong> {ticket.teams.join(' vs ')}</p>
              <p><strong>Date:</strong> {new Date(ticket.date).toLocaleDateString()}</p>
              <p><strong>Time:</strong> {ticket.time}</p>
              <p><strong>Venue:</strong> {ticket.venue}</p>
              <p><strong>Location:</strong> {ticket.location}</p>
              <p><strong>Quantity:</strong> {ticket.quantity}</p>
              <p><strong>Total Price:</strong> ${ticket.totalPrice}</p>
              <p><strong>Order Ref:</strong> #{ticket.id}</p>
              <p><strong>Seat:</strong> {ticket.seat}</p>
              <p><strong>Section:</strong> {ticket.section}</p>
              <p><strong>Status:</strong>
                <span className={`status-${ticket.status.toLowerCase().replace(' ', '-')}`}>
                  {ticket.status}
                </span>
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Tickets;