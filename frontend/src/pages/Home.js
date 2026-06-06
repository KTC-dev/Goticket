import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';

const Home = () => {
  const { user } = useAuth();
  const userName = user?.user_metadata?.username || user?.email?.split('@')[0] || 'User';
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const updateCountdown = () => {
      const targetDate = new Date('June 11, 2026 00:00:00').getTime();
      const now = new Date().getTime();
      const diff = targetDate - now;
      
      if (diff <= 0) {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      setCountdown({ days, hours, minutes, seconds });
    };
    
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="home-page">
      {/* Stadium Hero Banner */}
      <div className="stadium-banner">
        <div className="stadium-banner-content">
          <h2>Welcome to Goticket FIFA World Cup 2026</h2>
          {user ? (
            <>
              <p>Hello, {userName}! Welcome back to your ticket portal.</p>
              <p>Here you can browse upcoming events and manage your ticket purchases.</p>
            </>
          ) : (
            <>
              <p>Your official destination for FIFA World Cup 2026 tickets</p>
              <p>Please log in or register to access personalized features.</p>
            </>
          )}
          
          {/* Countdown Timer */}
          <div className="countdown-timer">
            <div className="countdown-number">
              <span>{countdown.days}</span>
              <span>Days</span>
            </div>
            <div className="countdown-number">
              <span>{countdown.hours}</span>
              <span>Hours</span>
            </div>
            <div className="countdown-number">
              <span>{countdown.minutes}</span>
              <span>Minutes</span>
            </div>
            <div className="countdown-number">
              <span>{countdown.seconds}</span>
              <span>Seconds</span>
            </div>
          </div>
          
          {/* Browse Events CTA Button */}
          <a href="/events" className="home-cta">
            Browse Events
          </a>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="trust-badges">
        <div className="trust-badge">
          <div className="badge-icon">✅</div>
          <div className="badge-text">FIFA Authorized Vendor</div>
        </div>
        <div className="trust-badge">
          <div className="badge-icon">🔒</div>
          <div className="badge-text">Secure Payments</div>
        </div>
        <div className="trust-badge">
          <div className="badge-icon">🎫</div>
          <div className="badge-text">Verified Tickets</div>
        </div>
      </div>
      
      <div className="features">
        <div className="feature">
          <h3>Official Tickets</h3>
          <p>Purchase authentic tickets directly from FIFA authorized vendors</p>
        </div>
        <div className="feature">
          <h3>Secure Transactions</h3>
          <p>All payments are processed with bank-level security</p>
        </div>
        <div className="feature">
          <h3>Mobile Access</h3>
          <p>Access your tickets anytime through our mobile app</p>
        </div>
      </div>
      
      {!user && (
        <div className="auth-call-to-action">
          <h3>Get Started</h3>
          <p>Create an account to start purchasing tickets for the World Cup events</p>
          <div className="auth-buttons">
            <a href="/login" className="btn btn-primary">Login</a>
            <a href="/register" className="btn btn-secondary">Register</a>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;