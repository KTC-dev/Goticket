import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Events from './pages/Events';
import Tickets from './pages/Tickets';
import About from './pages/About';
import Support from './pages/Support';
import Login from './pages/Login';
import Register from './pages/Register';
import ResetPassword from './pages/ResetPassword';
import WhatsAppChatButton from './components/WhatsAppChatButton';
import Checkout from './pages/Checkout';
import Confirmation from './pages/Confirmation';
import MyTickets from './pages/MyTickets';
import { useAuth } from './AuthContext';

// Menu component with internal state management
function HeaderMenu() {
  const { user } = useAuth();
  const userName = user?.user_metadata?.fullName || user?.user_metadata?.username || user?.email?.split('@')[0] || 'User';
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  // Close menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  return (
    <>
      {/* Hamburger Menu Button - on the right */}
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-label="Menu"
        style={{
          background: 'none',
          border: 'none',
          color: 'white',
          fontSize: '1.8rem',
          cursor: 'pointer',
          padding: '4px',
          borderRadius: '4px'
        }}
      >
        {isMenuOpen ? '✕' : '☰'}
      </button>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 9998,
            background: 'rgba(0,0,0,0.5)'
          }}
          onClick={() => setIsMenuOpen(false)}
        >
          <div
            style={{
              position: 'fixed',
              top: 0,
              right: 0,
              height: '100vh',
              width: '75%',
              maxWidth: '300px',
              backgroundColor: '#0a2342',
              zIndex: 9999,
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsMenuOpen(false)}
              style={{
                alignSelf: 'flex-end',
                color: 'white',
                fontSize: '24px',
                background: 'none',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              ✕
            </button>

            <Link to="/" onClick={() => setIsMenuOpen(false)} style={{ color: 'white', textDecoration: 'none' }}>
              Home
            </Link>
            <Link to="/events" onClick={() => setIsMenuOpen(false)} style={{ color: 'white', textDecoration: 'none' }}>
              Events
            </Link>
            {user ? (
              <>
                <Link to="/tickets" onClick={() => setIsMenuOpen(false)} style={{ color: 'white', textDecoration: 'none' }}>
                  My Tickets
                </Link>
                <Link to="/logout" onClick={() => setIsMenuOpen(false)} style={{ color: 'white', textDecoration: 'none' }}>
                  Logout ({userName})
                </Link>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setIsMenuOpen(false)} style={{ color: 'white', textDecoration: 'none' }}>
                  Login
                </Link>
                <Link to="/register" onClick={() => setIsMenuOpen(false)} style={{ color: 'white', textDecoration: 'none' }}>
                  Register
                </Link>
              </>
            )}
            <Link to="/support" onClick={() => setIsMenuOpen(false)} style={{ color: 'white', textDecoration: 'none' }}>
              Support
            </Link>
            <Link to="/about" onClick={() => setIsMenuOpen(false)} style={{ color: 'white', textDecoration: 'none' }}>
              About
            </Link>

            <a
              href="https://wa.me/message/HYRP6AN7DH7YE1"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: '#2a9d8f',
                color: 'white',
                padding: '12px',
                borderRadius: '8px',
                textAlign: 'center',
                marginTop: 'auto',
                textDecoration: 'none'
              }}
            >
              Chat with Support
            </a>
          </div>
        </div>
      )}
    </>
  );
}

function Logout() {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  // Sign out on mount
  useEffect(() => {
    signOut().then(() => {
      navigate('/');
    }).catch(console.error);
  }, [signOut, navigate]);

  return <div>Logging out...</div>;
}

function App() {
  const { user } = useAuth();
  const userName = user?.user_metadata?.fullName || user?.user_metadata?.username || user?.email?.split('@')[0] || 'User';

  return (
    <Router>
      <div className="App" style={{
  overflowX: "hidden",
  width: "100%",
  maxWidth: "100%",
  position: "relative"
}}>
        {/* Mobile-first Header */}
        <header className="App-header">
          {/* Logo/Wordmark - on the left */}
          <div className="logo">
            Goticket
          </div>
          
          <HeaderMenu />
          
          {/* Desktop Navigation (visible on desktop) */}
          <nav className="desktop-nav">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/events" className="nav-link">Events</Link>
            {user ? (
              <>
                <Link to="/tickets" className="nav-link">My Tickets</Link>
                <Link to="/logout" className="nav-link">Logout ({userName})</Link>
              </>
            ) : (
              <>
                <Link to="/login" className="nav-link">Login</Link>
                <Link to="/register" className="nav-link">Register</Link>
              </>
            )}
            <Link to="/support" className="nav-link">Support</Link>
            <Link to="/about" className="nav-link">About</Link>
          </nav>
        </header>

        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/events" element={<Events />} />
            <Route path="/tickets" element={<Tickets />} />
            <Route path="/support" element={<Support />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/confirmation" element={<Confirmation />} />
            <Route path="/my-tickets" element={<MyTickets />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="*" element={<h2>404 - Not Found</h2>} />
          </Routes>
        </main>

        <div className="floating-chat-container">
          <WhatsAppChatButton />
        </div>

        <footer className="detailed-footer">
          <div className="footer-container">
            <div className="footer-brand">
              <h2>⚽ Goticket</h2>
              <p>Your official destination for FIFA World Cup 2026 tickets</p>
            </div>
            <div className="footer-links">
              <h3>Quick Links</h3>
              <Link to="/">Home</Link>
              <Link to="/events">Events</Link>
              <Link to="/tickets">My Tickets</Link>
              <Link to="/support">Support</Link>
              <Link to="/about">About</Link>
            </div>
            <div className="footer-contact">
              <h3>Contact</h3>
              <a href="https://wa.me/message/HYRP6AN7DH7YE1" target="_blank" rel="noopener noreferrer">💬 WhatsApp</a>
              <a href="mailto:support@goticket.com">📧 support@goticket.com</a>
            </div>
            <div className="footer-bottom">
              <p>© 2026 Goticket. All rights reserved. Not affiliated with FIFA.</p>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;