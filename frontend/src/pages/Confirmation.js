import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

const Confirmation = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Parse query parameters
  const urlParams = new URLSearchParams(location.search);
  const reference = urlParams.get('reference') || 'N/A';
  const amount = urlParams.get('amount') || '0';
  
  // Mock order data - in a real app, this would come from API or context
  const [orderDetails, setOrderDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Redirect if not authenticated
  if (!user) {
    navigate('/login');
    return null;
  };

  useEffect(() => {
    // Simulate fetching order details
    // In a real app, you'd fetch from API using the reference
    setTimeout(() => {
      setOrderDetails({
        eventName: 'Opening Match',
        eventDate: 'June 11, 2026',
        venue: 'Al Bayt Stadium',
        quantity: 2,
        section: 'A',
        seatNumbers: ['A12', 'A13'],
        totalAmount: parseFloat(amount),
        reference: reference
      });
      setIsLoading(false);
    }, 1000);
  }, [reference, amount]);

  if (isLoading) {
    return (
      <div className="confirmation-page">
        <div className="confirmation-content">
          <h2>Processing...</h2>
          <p>Please wait while we confirm your order.</p>
        </div>
      </div>
    );
  }

  if (!orderDetails) {
    return (
      <div className="confirmation-page">
        <div className="confirmation-content">
          <h2>Order Not Found</h2>
          <p>We couldn't find your order details. Please contact support.</p>
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
    <div className="confirmation-page">
      <div className="confirmation-content">
        <div className="confirmation-icon">✅</div>
        <h2>Order Confirmed!</h2>
        <p>Thank you for your purchase! Your tickets are confirmed.</p>
        
        <div className="order-details">
          <h3>Order Summary</h3>
          <div className="order-detail-row">
            <span>Event:</span>
            <span>{orderDetails.eventName}</span>
          </div>
          <div className="order-detail-row">
            <span>Date:</span>
            <span>{orderDetails.eventDate}</span>
          </div>
          <div className="order-detail-row">
            <span>Venue:</span>
            <span>{orderDetails.venue}</span>
          </div>
          <div className="order-detail-row">
            <span>Quantity:</span>
            <span>{orderDetails.quantity}</span>
          </div>
          <div className="order-detail-row">
            <span>Section:</span>
            <span>{orderDetails.section}</span>
          </div>
          <div className="order-detail-row">
            <span>Seat Numbers:</span>
            <span>{orderDetails.seatNumbers.join(', ')}</span>
          </div>
          <div className="order-detail-row">
            <span>Total Paid:</span>
            <span>${orderDetails.totalAmount.toFixed(2)}</span>
          </div>
          <div className="order-detail-row">
            <span>Reference Number:</span>
            <span className="reference-number">{orderDetails.reference}</span>
          </div>
        </div>
        
        <div className="confirmation-actions">
          <button 
            className="btn btn-outline" 
            onClick={() => navigate('/my-tickets')}
          >
            View My Tickets
          </button>
          <button 
            className="btn btn-primary" 
            onClick={() => navigate('/events')}
          >
            Browse More Events
          </button>
        </div>
        
        <div className="confirmation-note">
          <p>Please save your reference number for future reference. We've also sent a confirmation email to your registered email address.</p>
        </div>
      </div>
    </div>
  );
};

export default Confirmation;