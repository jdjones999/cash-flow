import React, { useState, useEffect } from 'react';
import { User } from '../types/auth';
import { Check, X, Shield, UserCheck, Clock, ToggleLeft, ToggleRight } from 'lucide-react';

const API_BASE = 'http://192.168.0.3:3001/api';

export function AdminSettings() {
  const [users, setUsers] = useState<User[]>([]);
  const [allowRegistrations, setAllowRegistrations] = useState<boolean>(true);

  const fetchData = async () => {
    const resUsers = await fetch(`${API_BASE}/users`);
    const usersData = await resUsers.json();
    setUsers(usersData);

    const resSettings = await fetch(`${API_BASE}/admin/settings`);
    const settingsData = await resSettings.json();
    setAllowRegistrations(settingsData.allowRegistrations);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleToggleRegistration = async () => {
    const nextVal = !allowRegistrations;
    setAllowRegistrations(nextVal);
    await fetch(`${API_BASE}/admin/settings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ allowRegistrations: nextVal })
    });
  };

  const handleToggleVerify = async (id: string) => {
    const res = await fetch(`${API_BASE}/admin/users/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    });
    const updated = await res.json();
    setUsers(updated);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Registration Settings Toggle */}
      <div style={{ backgroundColor: '#131b2e', borderRadius: '12px', border: '1px solid #1e293b', padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h4 style={{ fontSize: '1rem', fontWeight: '600', color: '#f8fafc', margin: 0 }}>Allow New User Registrations</h4>
          <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '0.25rem 0 0 0' }}>When enabled, new users can submit sign-up requests on the login page.</p>
        </div>
        <button
          onClick={handleToggleRegistration}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: allowRegistrations ? '#4ade80' : '#64748b', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem', fontWeight: '600' }}
        >
          {allowRegistrations ? <ToggleRight style={{ width: '40px', height: '40px' }} /> : <ToggleLeft style={{ width: '40px', height: '40px' }} />}
          {allowRegistrations ? 'Enabled' : 'Disabled'}
        </button>
      </div>

      {/* User Management Table */}
      <div style={{ backgroundColor: '#131b2e', borderRadius: '12px', border: '1px solid #1e293b', padding: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
          <Shield style={{ color: '#38bdf8', width: '20px', height: '20px' }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: '600', color: '#f8fafc', margin: 0 }}>User Verification Roster</h3>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #1e293b', color: '#64748b' }}>
              <th style={{ padding: '0.75rem' }}>Email</th>
              <th style={{ padding: '0.75rem' }}>Role</th>
              <th style={{ padding: '0.75rem' }}>Status</th>
              <th style={{ padding: '0.75rem', textAlign: 'center' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id} style={{ borderBottom: '1px solid #1e293b' }}>
                <td style={{ padding: '0.75rem', fontWeight: '600', color: '#f8fafc' }}>{u.email}</td>
                <td style={{ padding: '0.75rem' }}>
                  <span style={{ backgroundColor: u.role === 'admin' ? '#1e3a8a' : '#1e293b', color: u.role === 'admin' ? '#60a5fa' : '#94a3b8', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: '700' }}>
                    {u.role}
                  </span>
                </td>
                <td style={{ padding: '0.75rem' }}>
                  {u.isVerified ? (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', color: '#4ade80', fontSize: '0.8rem', fontWeight: '600' }}>
                      <UserCheck style={{ width: '14px', height: '14px' }} /> Verified
                    </span>
                  ) : (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', color: '#fbbf24', fontSize: '0.8rem', fontWeight: '600' }}>
                      <Clock style={{ width: '14px', height: '14px' }} /> Pending Approval
                    </span>
                  )}
                </td>
                <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                  {u.role !== 'admin' && (
                    <button
                      onClick={() => handleToggleVerify(u.id)}
                      style={{
                        backgroundColor: u.isVerified ? '#334155' : '#16a34a',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '4px',
                        padding: '0.35rem 0.6rem',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        cursor: 'pointer'
                      }}
                    >
                      {u.isVerified ? 'Revoke' : 'Approve'}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
