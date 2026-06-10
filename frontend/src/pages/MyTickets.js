import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';

const MyTickets = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Mock tickets data - in a real app, this would come from API
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Redirect if not authenticated
  if (!user) {
    navigate('/login');
    return null;
  };

  useEffect(() => {
    // Simulate fetching tickets from API
    // In a real app, you'd make an actual API call here
    setTimeout(() => {
      const mockTickets = [
        {
          id: 1,
          eventId: 1,
          event: {
            title: 'Opening Match',
            date: '2026-06-11T15:00:00Z',
            venue: 'Al Bayt Stadium'
          },
          seat_number: 'A12',
          section: 'A',
          price: 100,
          quantity: 2,
          status: 'confirmed',
          total: 200,
          reference: 'GOT-123456789'
        },
        {
          id: 2,
          eventId: 2,
          event: {
            title: 'USA vs Canada',
            date: '2026-06-15T18:00:00Z',
            venue: 'Allegiant Stadium'
          },
          seat_number: 'B05',
          section: 'B',
          price: 150,
          quantity: 1,
          status: 'confirmed',
          total: 150,
          reference: 'GOT-987654321'
        }
      ];
      setTickets(mockTickets);
      setLoading(false);
    }, 1000);
  }, [user]);

  if (loading) {
    return (
      <div className="my-tickets-page" style={{
        overflowX: "hidden",
        width: "100%",
        maxWidth: "100%"
      }}>
        <div className="tickets-content">
          <h2>My Tickets</h2>
          <p>Loading your tickets...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="my-tickets-page" style={{
        overflowX: "hidden",
        width: "100%",
        maxWidth: "100%"
      }}>
        <div className="tickets-content">
          <h2>My Tickets</h2>
          <p className="error">Error loading tickets: {error}</p>
          <button 
            className="btn btn-primary" 
            onClick={() => navigate('/events')}
          >
            Browse Events
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="my-tickets-page" style={{
      overflowX: "hidden",
      width: "100%",
      maxWidth: "100%"
    }}>
      <div className="tickets-header">
        <h2>My Tickets</h2>
        <p>Your purchased tickets for FIFA World Cup 2026</p>
      </div>
      
      {tickets.length === 0 ? (
        <div className="empty-state">
          <h3>You haven't purchased any tickets yet</h3>
          <p>Start browsing events to find matches you'd like to attend.</p>
          <button 
            className="btn btn-primary" 
            onClick={() => navigate('/events')}
          >
            Browse Events
          </button>
        </div>
      ) : (
        <div className="tickets-grid">
          {tickets.map(ticket => (
            <div key={ticket.id} className="ticket-card">
              <div className="ticket-header">
                <h3>{ticket.event?.title || 'Unknown Event'}</h3>
                <span className={`ticket-status ${ticket.status}`}>
                  {ticket.status.toUpperCase()}
                </span>
              </div>
              
              <div className="ticket-details">
                <div className="detail-row">
                  <span className="detail-label">Date:</span>
                  <span className="detail-value">
                    {ticket.event?.date ? new Date(ticket.event.date).toLocaleDateString() : 'TBD'}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Venue:</span>
                  <span className="detail-value">
                    {ticket.event?.venue || 'TBD'}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Seat:</span>
                  <span className="detail-value">
                    {ticket.section} {ticket.seat_number}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Quantity:</span>
                  <span className="detail-value">{ticket.quantity}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Price:</span>
                  <span className="detail-value">${ticket.price}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Total:</span>
                  <span className="detail-value">${ticket.total}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Reference:</span>
                  <span className="detail-value reference-number">{ticket.reference}</span>
                </div>
              </div>
              
              {ticket.status === 'confirmed' && (
                <div className="ticket-actions">
                  <button 
                    className="btn btn-outline" 
                    onClick={() => {
                      // In a real app, you might open a ticket viewer or PDF
                      alert('Ticket viewer would open here in a real implementation');
                    }}
                  >
                    View Ticket
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyTickets;