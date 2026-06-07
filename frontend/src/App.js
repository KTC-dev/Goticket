import React, { useState, useEffect, useRef } from 'react';
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
  const userName = user?.user_metadata?.username || user?.email?.split('@')[0] || 'User';
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const location = useLocation();

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    const handleEscapeKey = (event) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscapeKey);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, []);

  // Close menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  return (
    <>
      {/* Hamburger Menu Button - on the right */}
      <button 
        className="hamburger-btn"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-label={isMenuOpen ? "Close menu" : "Open menu"}
      >
        {isMenuOpen ? '✕' : '☰'}
      </button>
      
      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <nav ref={menuRef} className="mobile-nav">
          <Link to="/" className="nav-link" onClick={() => setIsMenuOpen(false)}>Home</Link>
          <Link to="/events" className="nav-link" onClick={() => setIsMenuOpen(false)}>Events</Link>
          {user ? (
            <>
              <Link to="/tickets" className="nav-link" onClick={() => setIsMenuOpen(false)}>My Tickets</Link>
              <Link to="/logout" className="nav-link" onClick={() => setIsMenuOpen(false)}>Logout ({userName})</Link>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link" onClick={() => setIsMenuOpen(false)}>Login</Link>
              <Link to="/register" className="nav-link" onClick={() => setIsMenuOpen(false)}>Register</Link>
            </>
          )}
          <Link to="/support" className="nav-link" onClick={() => setIsMenuOpen(false)}>Support</Link>
          <Link to="/about" className="nav-link" onClick={() => setIsMenuOpen(false)}>About</Link>
        </nav>
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
  const userName = user?.user_metadata?.username || user?.email?.split('@')[0] || 'User';

  return (
    <Router>
      <div className="App">
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

        <footer className="App-footer">
          <p>&copy; 2026 Goticket. All rights reserved.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;