import React, { useState } from 'react';
import { User } from '../types/auth';
import { getUsers, toggleUserVerification, deleteUser } from '../data/users';
import { Check, X, Trash2, Shield, UserCheck, Clock } from 'lucide-react';

export function AdminSettings() {
  const [users, setUsers] = useState<User[]>(getUsers());

  const handleToggle = (id: string) => {
    const updated = toggleUserVerification(id);
    setUsers(updated);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      const updated = deleteUser(id);
      setUsers(updated);
    }
  };

  return (
    <div style={{ backgroundColor: '#131b2e', borderRadius: '12px', border: '1px solid #1e293b', padding: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
        <Shield style={{ color: '#38bdf8', width: '20px', height: '20px' }} />
        <h3 style={{ fontSize: '1.2rem', fontWeight: '600', color: '#f8fafc', margin: 0 }}>Admin Settings - User Verification</h3>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid #1e293b', color: '#64748b' }}>
            <th style={{ padding: '0.75rem' }}>User Email</th>
            <th style={{ padding: '0.75rem' }}>Role</th>
            <th style={{ padding: '0.75rem' }}>Status</th>
            <th style={{ padding: '0.75rem' }}>Registered</th>
            <th style={{ padding: '0.75rem', textAlign: 'center' }}>Actions</th>
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
              <td style={{ padding: '0.75rem', color: '#64748b' }}>
                {new Date(u.createdAt).toLocaleDateString()}
              </td>
              <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                {u.role !== 'admin' && (
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                    <button
                      onClick={() => handleToggle(u.id)}
                      style={{
                        backgroundColor: u.isVerified ? '#334155' : '#16a34a',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '4px',
                        padding: '0.35rem 0.6rem',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.2rem'
                      }}
                    >
                      {u.isVerified ? <X style={{ width: '14px', height: '14px' }} /> : <Check style={{ width: '14px', height: '14px' }} />}
                      {u.isVerified ? 'Revoke' : 'Approve'}
                    </button>
                    <button
                      onClick={() => handleDelete(u.id)}
                      style={{ backgroundColor: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                    >
                      <Trash2 style={{ width: '15px', height: '15px' }} />
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
