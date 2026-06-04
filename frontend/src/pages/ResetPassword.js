import React, { useState } from 'react';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';

const ResetPassword = () => {
  const { resetPassword, loading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setMessage('');
    try {
      await resetPassword(email);
      setSuccess('If an account exists with that email, you will receive a password reset link shortly.');
      setMessage('Please check your inbox (and spam folder) for the reset link.');
      setEmail('');
    } catch (err) {
      setError(err.message || 'Failed to send reset link');
    }
  };

  return (
    <div className="reset-password-page">
      <div className="reset-password-container">
        <h2>Reset Your Password</h2>
        <p>Enter your email address to receive a password reset link.</p>
        
        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}
        {message && <div className="alert alert-info">{message}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <button type="submit" disabled={loading}>
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
          
          <p className="switch-to-login">
            Remember your password? <span onClick={() => navigate('/login')}>Login here</span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;