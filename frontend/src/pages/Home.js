import React from 'react';
import { useAuth } from '../AuthContext';

const Home = () => {
  const { user } = useAuth();
  const userName = user?.user_metadata?.username || user?.email?.split('@')[0] || 'User';

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
          
          {/* Browse Events CTA Button */}
          <a href="/events" className="home-cta">
            Browse Events
          </a>
        </div>
      </div>

      {/* Trust Badges (will be added in Prompt 2) */}
      {/* Countdown Timer (will be added in Prompt 2) */}
      
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