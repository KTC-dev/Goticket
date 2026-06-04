import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import Home from './pages/Home';
import Events from './pages/Events';
import Tickets from './pages/Tickets';
import About from './pages/About';
import Support from './pages/Support';
import Login from './pages/Login';
import Register from './pages/Register';
import ResetPassword from './pages/ResetPassword';
import WhatsAppChatButton from './components/WhatsAppChatButton';
import { useAuth } from './AuthContext';

function App() {
  const { user } = useAuth();
  const userName = user?.user_metadata?.username || user?.email?.split('@')[0] || 'User';

  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>Goticket FIFA World Cup 2026</h1>
          <nav>
            <Link to="/">Home</Link>
            <Link to="/events">Events</Link>
            {user ? (
              <>
                <Link to="/tickets">My Tickets</Link>
                <Link to="/logout">Logout ({userName})</Link>
              </>
            ) : (
              <>
                <Link to="/login">Login</Link>
                <Link to="/register">Register</Link>
              </>
            )}
            <Link to="/support">Support</Link>
            <Link to="/about">About</Link>
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

// Simple logout component
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

export default App;
