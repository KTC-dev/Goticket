import React, { useState } from 'react';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';

const Checkout = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Mock cart data - in a real app, this would come from state or context
  const [cartItems, setCartItems] = useState([]);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [orderSummary, setOrderSummary] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Redirect if not authenticated
  if (!user) {
    navigate('/login');
    return null;
  }

  // Initialize with mock data for demo
  React.useEffect(() => {
    // In a real app, you'd get cart from context or localStorage
    const mockCart = [
      {
        id: 1,
        eventId: 1,
        eventTitle: 'Opening Match',
        eventDate: '2026-06-11T15:00:00Z',
        venue: 'Al Bayt Stadium',
        price: 100,
        quantity: 2,
        section: 'A',
        seatNumber: 'A12',
        isHospitality: false
      }
    ];
    setCartItems(mockCart);
    calculateOrderSummary();
  }, []);

  const calculateOrderSummary = () => {
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.1; // 10% tax
    const total = subtotal + tax;
    
    setOrderSummary({
      subtotal,
      tax,
      total,
      itemsCount: cartItems.reduce((sum, item) => sum + item.quantity, 0)
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNextStep = () => {
    // Validate form data for step 2
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim()) {
        setError('Please fill in all fields');
        return;
      }
      setStep(3);
    }
  };

  const handlePreviousStep = () => {
    setStep(prev => Math.max(1, prev - 1));
    setError(null);
  };

  const handlePlaceOrder = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API call to create order
      // In a real app, you'd make actual API calls here
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate order reference
      const orderReference = `GOT-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
      
      // Navigate to confirmation page with order data
      navigate(`/confirmation?reference=${orderReference}&amount=${orderSummary.total}`);
    } catch (err) {
      setError('Failed to place order. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (step === 1) {
    return (
      <div className="checkout-page">
        <div className="checkout-header">
          <h2>Checkout</h2>
          <div className="step-indicator">
            <div className="step active">1</div>
            <div className="step">2</div>
            <div className="step">3</div>
          </div>
        </div>
        
        <div className="checkout-content">
          <h3>Step 1: Review Order</h3>
          
          <div className="order-summary">
            <h4>Your Order</h4>
            {cartItems.map(item => (
              <div key={item.id} className="order-item">
                <div className="order-item-info">
                  <h5>{item.eventTitle}</h5>
                  <p>{new Date(item.eventDate).toLocaleDateString()} at {item.venue}</p>
                  {item.isHospitality && <span className="hospitality-tag">Hospitality</span>}
                </div>
                <div className="order-item-details">
                  <p>Section: {item.section}, Seat: {item.seatNumber}</p>
                  <p>Quantity: {item.quantity}</p>
                  <p className="item-price">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              </div>
            ))}
            
            <div className="order-divider"></div>
            
            <div className="order-totals">
              <div className="total-row">
                <span>Subtotal:</span>
                <span>${orderSummary.subtotal.toFixed(2)}</span>
              </div>
              <div className="total-row">
                <span>Tax (10%):</span>
                <span>${orderSummary.tax.toFixed(2)}</span>
              </div>
              <div className="total-row total">
                <span>Total:</span>
                <span>${orderSummary.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
          
          <div className="checkout-actions">
            <button 
              className="btn btn-secondary" 
              onClick={() => navigate('/events')}
            >
              Continue Shopping
            </button>
            <button 
              className="btn btn-primary" 
              onClick={handleNextStep}
            >
              Continue to Details
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className="checkout-page">
        <div className="checkout-header">
          <h2>Checkout</h2>
          <div className="step-indicator">
            <div className="step completed">1</div>
            <div className="step active">2</div>
            <div className="step">3</div>
          </div>
        </div>
        
        <div className="checkout-content">
          <h3>Step 2: Enter Details</h3>
          
          {error && <div className="error-message">{error}</div>}
          
          <form className="checkout-form">
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                placeholder="Enter your full name"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                placeholder="Enter your email"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
                placeholder="Enter your phone number"
              />
            </div>
          </form>
          
          <div className="checkout-actions">
            <button 
              className="btn btn-secondary" 
              onClick={handlePreviousStep}
            >
              Go Back
            </button>
            <button 
              className="btn btn-primary" 
              onClick={handleNextStep}
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : 'Continue to Payment'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (step === 3) {
    return (
      <div className="checkout-page">
        <div className="checkout-header">
          <h2>Checkout</h2>
          <div className="step-indicator">
            <div className="step completed">1</div>
            <div className="step completed">2</div>
            <div className="step active">3</div>
          </div>
        </div>
        
        <div className="checkout-content">
          <h3>Step 3: Payment Instructions</h3>
          
          <div className="payment-instructions">
            <h4>Complete Your Payment</h4>
            <p>To complete your purchase, please follow these steps:</p>
            <ol>
              <li>Send a WhatsApp message to our support team with your order details</li>
              <li>Include your name, email, and the items you're purchasing</li>
              <li>Make the payment of <strong>${orderSummary.total.toFixed(2)}</strong> using our secure payment link</li>
              <li>Wait for confirmation from our team</li>
            </ol>
            
            <div className="payment-actions">
              <a 
                href="https://wa.me/message/HYRP6AN7DH7YE1" 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                Message on WhatsApp
              </a>
              <button 
                className="btn btn-secondary" 
                onClick={handlePreviousStep}
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default Checkout;