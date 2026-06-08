import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
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

  const featuredMatches = [
    { teams: 'Mexico 🇲🇽 vs South Africa 🇿🇦', date: 'June 11', time: '3:00PM ET', venue: 'Estadio Azteca', group: 'Group A' },
    { teams: 'Canada 🇨🇦 vs Bosnia 🇧🇦', date: 'June 12', time: '6:00PM ET', venue: 'BMO Field', group: 'Group B' },
    { teams: 'USA 🇺🇸 vs Paraguay 🇵🇾', date: 'June 12', time: '9:00PM ET', venue: 'SoFi Stadium', group: 'Group D', hot: true },
    { teams: 'Brazil 🇧🇷 vs Morocco 🇲🇦', date: 'June 13', time: '9:00PM ET', venue: 'MetLife Stadium', group: 'Group C', hot: true },
    { teams: 'Argentina 🇦🇷 vs Algeria 🇩🇿', date: 'June 16', time: '9:00PM ET', venue: 'Arrowhead Stadium', group: 'Group J', hot: true },
    { teams: 'England 🏴 vs Croatia 🇭🇷', date: 'June 17', time: '3:00PM ET', venue: 'AT&T Stadium', group: 'Group L', hot: true },
    { teams: 'Spain 🇪🇸 vs Cape Verde 🇨🇻', date: 'June 18', time: '12:00PM ET', venue: 'Mercedes-Benz Stadium', group: 'Group H' },
    { teams: 'Germany 🇩🇪 vs Ecuador 🇪🇨', date: 'June 18', time: '6:00PM ET', venue: 'AT&T Stadium', group: 'Group E' },
    { teams: 'France 🇫🇷 vs Senegal 🇸🇳', date: 'June 19', time: '3:00PM ET', venue: 'MetLife Stadium', group: 'Group I', hot: true },
    { teams: 'Netherlands 🇳🇱 vs Japan 🇯🇵', date: 'June 20', time: '6:00PM ET', venue: 'Lumen Field', group: 'Group F' },
  ];

  const venues = [
    { name: 'Estadio Azteca', city: 'Mexico City', matches: 13, img: 'https://images.unsplash.com/photo-1568515387631-8b650bbcdb90?w=400&q=80' },
    { name: 'MetLife Stadium', city: 'New York', matches: 18, img: 'https://images.unsplash.com/photo-1577223625816-7546f13df25d?w=400&q=80' },
    { name: 'SoFi Stadium', city: 'Los Angeles', matches: 12, img: 'https://images.unsplash.com/photo-1504450758481-7338eba7524a?w=400&q=80' },
    { name: 'AT&T Stadium', city: 'Dallas', matches: 20, img: 'https://images.unsplash.com/photo-1606925797300-0b35e9d1794e?w=400&q=80' },
    { name: 'Mercedes-Benz Stadium', city: 'Atlanta', matches: 10, img: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=400&q=80' },
    { name: 'BMO Field', city: 'Toronto', matches: 8, img: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=400&q=80' },
  ];

  const testimonials = [
    {
      rating: 5,
      text: "Bought my tickets for Brazil vs Morocco in minutes. The WhatsApp support was instant and professional!",
      author: "Carlos M. 🇧🇷 Brazil"
    },
    {
      rating: 5,
      text: "Finally a ticketing platform that actually works on mobile. Got my Argentina tickets confirmed same day.",
      author: "Amira K. 🇩🇿 Algeria"
    },
    {
      rating: 5,
      text: "The seat selection and checkout process was smooth. Can't wait for the Opening Match!",
      author: "James T. 🏴 England"
    }
  ];

  return (
    <div className="home-page">
      {/* 1. HERO SECTION */}
      <section className="hero-section">
        <div className="hero-overlay">
          <div className="hero-content">
            {user && (
              <p className="hero-welcome">Welcome back, {userName}! 👋</p>
            )}
            <h1 className="hero-headline">Experience the World Cup Live</h1>
            <p className="hero-subtext">Official tickets. Verified seats. Unforgettable moments.</p>
            <div className="hero-buttons">
              <a href="/events" className="btn btn-primary hero-btn">🎟️ Get Tickets</a>
              <a href="/events" className="btn btn-secondary hero-btn">📅 View Schedule</a>
            </div>
            <div className="countdown-timer">
              <div className="countdown-item">
                <span className="countdown-number">{countdown.days}</span>
                <span className="countdown-label">DAYS</span>
              </div>
              <div className="countdown-divider"></div>
              <div className="countdown-item">
                <span className="countdown-number">{countdown.hours}</span>
                <span className="countdown-label">HOURS</span>
              </div>
              <div className="countdown-divider"></div>
              <div className="countdown-item">
                <span className="countdown-number">{countdown.minutes}</span>
                <span className="countdown-label">MINUTES</span>
              </div>
              <div className="countdown-divider"></div>
              <div className="countdown-item">
                <span className="countdown-number">{countdown.seconds}</span>
                <span className="countdown-label">SECONDS</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. TOURNAMENT STATS BAR */}
      <section className="stats-bar">
        <div className="stat-item">
          <span className="stat-number">48</span>
          <span className="stat-label">Teams</span>
        </div>
        <div className="stat-divider"></div>
        <div className="stat-item">
          <span className="stat-number">104</span>
          <span className="stat-label">Matches</span>
        </div>
        <div className="stat-divider"></div>
        <div className="stat-item">
          <span className="stat-number">16</span>
          <span className="stat-label">Stadiums</span>
        </div>
        <div className="stat-divider"></div>
        <div className="stat-item">
          <span className="stat-number">3</span>
          <span className="stat-label">Countries</span>
        </div>
        <div className="stat-divider"></div>
        <div className="stat-item">
          <span className="stat-number">1</span>
          <span className="stat-label">Trophy</span>
        </div>
      </section>

      {/* 3. FEATURED MATCHES CAROUSEL */}
      <section className="featured-matches">
        <h2 className="section-title">🔥 Featured Matches</h2>
        <div className="matches-scroll">
          {featuredMatches.map((match, index) => (
            <div key={index} className="match-card">
              <div className="match-header">
                <span className="match-group">{match.group}</span>
                {match.hot && <span className="match-hot">🔥 HOT</span>}
              </div>
              <h3 className="match-teams">{match.teams}</h3>
              <p className="match-info">{match.date} • {match.time}</p>
              <p className="match-venue">{match.venue}</p>
              <span className="match-badge available">Available</span>
              <button className="btn btn-primary match-btn" onClick={() => navigate('/events')}>Book Now →</button>
            </div>
          ))}
        </div>
      </section>

      {/* 4. HOW IT WORKS SECTION */}
      <section className="how-it-works">
        <h2 className="section-title">How It Works</h2>
        <div className="steps-container">
          <div className="step-card">
            <div className="step-icon">🔍</div>
            <h3>Browse Matches</h3>
            <p>Search and filter from 104 confirmed World Cup matches across 16 stadiums</p>
          </div>
          <div className="step-arrow">→</div>
          <div className="step-card">
            <div className="step-icon">💺</div>
            <h3>Select Your Seats</h3>
            <p>Choose your ticket quantity, seat section and hospitality options</p>
          </div>
          <div className="step-arrow">→</div>
          <div className="step-card">
            <div className="step-icon">💬</div>
            <h3>Pay via WhatsApp</h3>
            <p>Complete your secure payment through our verified WhatsApp support agent</p>
          </div>
        </div>
      </section>

      {/* 5. LIVE TICKER STRIP */}
      <section className="live-ticker">
        <div className="ticker-content">
          <span>🟢 OPENING MATCH: Mexico vs South Africa — June 11 — Estadio Azteca | 🔥 HIGH DEMAND: Brazil vs Morocco — Limited tickets available | ⏰ STARTS IN 3 DAYS: FIFA World Cup 2026 Opening Ceremony | 🎟️ NOW AVAILABLE: Argentina vs Algeria — Arrowhead Stadium, Kansas City | 💬 Need help? Chat with us on WhatsApp</span>
        </div>
      </section>

      {/* 6. VENUES SECTION */}
      <section className="venues-section">
        <h2 className="section-title">🏟️ Host Venues</h2>
        <div className="venues-grid">
          {venues.map((venue, index) => (
            <div key={index} className="venue-card" onClick={() => navigate('/events')}>
              <img src={venue.img} alt={venue.name} />
              <div className="venue-overlay">
                <h3>{venue.name}</h3>
                <p className="venue-city">{venue.city}</p>
                <p className="venue-matches">{venue.matches} matches</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. TRUST BADGES SECTION */}
      <section className="trust-badges-new">
        <h2 className="section-title">Why Choose Goticket?</h2>
        <div className="badges-container">
          <div className="trust-badge-new">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#2a9d8f" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              <circle cx="12" cy="13" r="3"/>
            </svg>
            <h4>FIFA Authorized Vendor</h4>
            <p>All tickets sourced from authorized FIFA channels only</p>
          </div>
          <div className="trust-badge-new">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#2a9d8f" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
            <h4>Secure Payments</h4>
            <p>Your payment details are protected at all times</p>
          </div>
          <div className="trust-badge-new">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#2a9d8f" strokeWidth="2">
              <path d="M2 9l10 12 10-12"/>
              <path d="M2 9v12"/>
              <path d="M22 9v12"/>
            </svg>
            <h4>Verified Tickets</h4>
            <p>Every ticket authenticated before delivery to you</p>
          </div>
          <div className="trust-badge-new">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#2a9d8f" strokeWidth="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
            <h4>24/7 WhatsApp Support</h4>
            <p>Our support team is always available on WhatsApp</p>
          </div>
        </div>
      </section>

      {/* 8. HOST COUNTRIES BANNER */}
      <section className="host-countries">
        <h2>🌍 3 Nations. 1 Tournament.</h2>
        <div className="countries-container">
          <div className="country-card">
            <span className="country-flag">🇺🇸</span>
            <h3>United States</h3>
            <p>11 Venues · 60 Matches</p>
          </div>
          <div className="country-card">
            <span className="country-flag">🇲🇽</span>
            <h3>Mexico</h3>
            <p>3 Venues · 13 Matches</p>
          </div>
          <div className="country-card">
            <span className="country-flag">🇨🇦</span>
            <h3>Canada</h3>
            <p>2 Venues · 13 Matches</p>
          </div>
        </div>
      </section>

      {/* 9. TESTIMONIALS SECTION */}
      <section className="testimonials">
        <h2 className="section-title">What Fans Are Saying</h2>
        <div className="testimonials-container">
          {testimonials.map((t, index) => (
            <div key={index} className="testimonial-card">
              <div className="stars">{'⭐'.repeat(t.rating)}</div>
              <p className="testimonial-text">"{t.text}"</p>
              <p className="testimonial-author">— {t.author}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 10. WHATSAPP SUPPORT SECTION */}
      <section className="whatsapp-section">
        <div className="whatsapp-content">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="#ffffff">
            <path d="M12.001 21.998c-2.798 0-5.555-.75-8.167-2.188-2.381-1.305-4.381-3.305-5.714-5.714C-.75 13.494-.75 10.714-.75 7.998c0-2.716.917-5.216 2.375-7.216.75-.984 1.584-1.884 2.5-2.7l1.25 1.2c-.75.583-1.417 1.25-1.967 2C4.05 6.38 3.75 7.65 3.75 8.998c0 1.25.25 2.45.75 3.583l7.45 7.45c1.134.5 2.334.75 3.584.75 1.348 0 2.615-.298 3.798-.848l1.2 1.25c-.816.916-1.716 1.75-2.7 2.5C15.486 21.248 13.786 21.998 12.001 21.998z"/>
            <path d="M17.951 14.998c-.25-.25-1.25-1.25-1.5-1.5-.25-.25-.5-.5-.75-.5-.5 0-1-.25-1.25-.5-.25-.25-.25-.5 0-1l.5-.5c.25-.25.5-.25.75 0l1 1c.25.25.25.5 0 .75l-.5.5c-.25.25-.25.5 0 .75l1.25 1.25c.25.25.5.25.75 0l.5-.5c.25-.25.5-.25.75 0l1.25-1.25c.25-.25.25-.5 0-.75z"/>
          </svg>
          <h2>Need Help With Your Tickets?</h2>
          <p>Our support team is available 24/7 on WhatsApp. Get instant help with payments, seat selection, and ticket confirmation.</p>
          <div className="whatsapp-buttons">
            <a href="https://wa.me/message/HYRP6AN7DH7YE1" target="_blank" rel="noopener noreferrer" className="btn btn-primary">💬 Chat on WhatsApp Now</a>
            <a href="mailto:support@goticket.com" className="btn btn-secondary">📧 Email Support</a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;