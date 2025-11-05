import React, { useState, useEffect } from 'react';

const AuthWrapper = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Check if already authenticated
  useEffect(() => {
    const auth = sessionStorage.getItem('auth');
    if (auth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    // Change this password to whatever you want
    const correctPassword = import.meta.env.VITE_APP_PASSWORD || 'your-secure-password';
    
    if (password === correctPassword) {
      setIsAuthenticated(true);
      sessionStorage.setItem('auth', 'true');
      setError('');
    } else {
      setError('Invalid password');
      setPassword('');
    }
  };

  if (!isAuthenticated) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif'
      }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '16px',
          padding: '48px',
          maxWidth: '400px',
          width: '100%',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h1 style={{
              background: 'linear-gradient(135deg, #60a5fa 0%, #fe8f0f 50%, #3b82f6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              fontSize: '2rem',
              fontWeight: '700',
              margin: '0 0 8px 0'
            }}>
              Butler Evaluation
            </h1>
            <p style={{ color: '#94a3b8', fontSize: '14px', margin: 0 }}>
              Please enter password to continue
            </p>
          </div>

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '24px' }}>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                autoFocus
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  border: error ? '1px solid #ef4444' : '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  color: '#f1f5f9',
                  fontSize: '15px',
                  outline: 'none',
                  transition: 'all 0.2s ease',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#fe8f0f';
                  e.target.style.boxShadow = '0 0 0 3px rgba(254, 143, 15, 0.15)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = error ? '#ef4444' : 'rgba(255, 255, 255, 0.1)';
                  e.target.style.boxShadow = 'none';
                }}
              />
              {error && (
                <p style={{
                  color: '#ef4444',
                  fontSize: '13px',
                  marginTop: '8px',
                  marginBottom: 0
                }}>
                  {error}
                </p>
              )}
            </div>

            <button
              type="submit"
              style={{
                width: '100%',
                padding: '14px',
                border: 'none',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #60a5fa 0%, #fe8f0f 100%)',
                color: '#ffffff',
                fontSize: '15px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 4px 12px rgba(254, 143, 15, 0.3)'
              }}
              onMouseOver={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 6px 20px rgba(254, 143, 15, 0.4)';
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 12px rgba(254, 143, 15, 0.3)';
              }}
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return children;
};

export default AuthWrapper;
