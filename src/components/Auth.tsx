import React, { useState, useEffect } from 'react';
import { Wallet, LogIn, UserPlus, ShieldAlert, CheckCircle } from 'lucide-react';
import { User } from '../types/auth';

interface AuthProps {
  onLoginSuccess: (user: User) => void;
}

const API_BASE = 'http://192.168.0.3:3001/api';

export function Auth({ onLoginSuccess }: AuthProps) {
  const [hasAdmin, setHasAdmin] = useState<boolean>(true);
  const [allowRegistrations, setAllowRegistrations] = useState<boolean>(true);
  
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const checkStatus = async () => {
    try {
      const res = await fetch(`${API_BASE}/auth/status`);
      const data = await res.json();
      setHasAdmin(data.hasAdmin);
      setAllowRegistrations(data.allowRegistrations);

      if (!data.hasAdmin) {
        setMode('signup');
      }
    } catch (e) {
      setError('Unable to connect to backend service.');
    }
  };

  useEffect(() => {
    checkStatus();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (mode === 'signup') {
      if (password !== confirmPassword) {
        setError('Passwords do not match. Please try again.');
        return;
      }

      try {
        const res = await fetch(`${API_BASE}/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data.error || 'Failed to register account.');
          return;
        }

        if (data.user.role === 'admin') {
          onLoginSuccess(data.user);
        } else {
          setSuccess('Account created! Awaiting admin approval before you can sign in.');
          setEmail('');
          setPassword('');
          setConfirmPassword('');
          setMode('signin');
          checkStatus();
        }
      } catch (e) {
        setError('Server communication error during registration.');
      }
      return;
    }

    // Sign In Flow
    try {
      const res = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Login failed.');
        return;
      }

      onLoginSuccess(data.user);
    } catch (e) {
      setError('Server communication error during login.');
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#0b0f19', justifyContent: 'center', alignItems: 'center', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <div style={{ backgroundColor: '#0f172a', padding: '2.5rem', borderRadius: '16px', border: '1px solid #1e293b', width: '100%', maxWidth: '420px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', justifyContent: 'center', marginBottom: '1.5rem' }}>
          <div style={{ backgroundColor: '#2563eb', padding: '0.6rem', borderRadius: '10px', display: 'flex' }}>
            <Wallet style={{ color: '#ffffff', width: '24px', height: '24px' }} />
          </div>
          <span style={{ fontSize: '1.5rem', fontWeight: '700', color: '#f8fafc' }}>Cash Flow</span>
        </div>

        <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#f8fafc', marginBottom: '0.25rem', textAlign: 'center' }}>
          {!hasAdmin ? 'Setup Primary Admin Account' : mode === 'signin' ? 'Sign in to your account' : 'Create Standard User Account'}
        </h2>
        <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1.5rem', textAlign: 'center' }}>
          {!hasAdmin ? 'First run detected. Create primary admin user.' : mode === 'signin' ? 'Enter credentials to access portal' : 'New accounts require admin approval'}
        </p>

        {error && (
          <div style={{ backgroundColor: '#450a0a', border: '1px solid #991b1b', color: '#fca5a5', padding: '0.75rem', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShieldAlert style={{ width: '16px', height: '16px', flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div style={{ backgroundColor: '#052e16', border: '1px solid #166534', color: '#86efac', padding: '0.75rem', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckCircle style={{ width: '16px', height: '16px', flexShrink: 0 }} />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', color: '#94a3b8', marginBottom: '0.4rem', textTransform: 'uppercase' }}>Email Address</label>
            <input
              type="email"
              required
              placeholder="user@neoconn.local"
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={{ width: '100%', backgroundColor: '#131b2e', border: '1px solid #334155', borderRadius: '8px', padding: '0.75rem', color: '#f8fafc', fontSize: '0.875rem', boxSizing: 'border-box' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', color: '#94a3b8', marginBottom: '0.4rem', textTransform: 'uppercase' }}>Password</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              style={{ width: '100%', backgroundColor: '#131b2e', border: '1px solid #334155', borderRadius: '8px', padding: '0.75rem', color: '#f8fafc', fontSize: '0.875rem', boxSizing: 'border-box' }}
            />
          </div>

          {mode === 'signup' && (
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', color: '#94a3b8', marginBottom: '0.4rem', textTransform: 'uppercase' }}>Confirm Password</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                style={{ width: '100%', backgroundColor: '#131b2e', border: '1px solid #334155', borderRadius: '8px', padding: '0.75rem', color: '#f8fafc', fontSize: '0.875rem', boxSizing: 'border-box' }}
              />
            </div>
          )}

          <button
            type="submit"
            style={{ backgroundColor: '#2563eb', color: '#ffffff', border: 'none', borderRadius: '8px', padding: '0.75rem', fontWeight: '600', fontSize: '0.875rem', cursor: 'pointer', marginTop: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
          >
            {mode === 'signin' ? <LogIn style={{ width: '18px', height: '18px' }} /> : <UserPlus style={{ width: '18px', height: '18px' }} />}
            {!hasAdmin ? 'Create Primary Admin' : mode === 'signin' ? 'Sign In' : 'Register Account'}
          </button>
        </form>

        {hasAdmin && (
          <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.85rem', color: '#64748b' }}>
            {mode === 'signin' ? (
              <span>Need an account? {allowRegistrations ? (
                <button onClick={() => { setMode('signup'); setError(''); }} style={{ background: 'none', border: 'none', color: '#38bdf8', cursor: 'pointer', fontWeight: '600' }}>Sign Up</button>
              ) : (
                <span style={{ color: '#ef4444', marginLeft: '0.25rem' }}>(Registrations Disabled)</span>
              )}</span>
            ) : (
              <span>Already registered? <button onClick={() => { setMode('signin'); setError(''); }} style={{ background: 'none', border: 'none', color: '#38bdf8', cursor: 'pointer', fontWeight: '600' }}>Sign In</button></span>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
