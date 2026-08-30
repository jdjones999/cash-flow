import React from 'react';

interface User {
  id: string;
  email: string;
  role: string;
  status: string;
}

interface DashboardProps {
  user?: User;
}

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>💰 Cash Flow Dashboard</h1>
      {user && (
        <div style={{ 
          background: '#f0f0f0', 
          padding: '15px', 
          borderRadius: '8px',
          marginBottom: '20px'
        }}>
          <p><strong>Welcome!</strong> You are logged in as: {user.email}</p>
          <p>Role: <span style={{ color: '#4CAF50' }}>{user.role}</span></p>
        </div>
      )}
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        marginTop: '30px'
      }}>
        <div style={{ 
          background: '#e3f2fd', 
          padding: '20px', 
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <h3>📊 Revenue</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold' }}>$12,450</p>
        </div>
        <div style={{ 
          background: '#e8f5e9', 
          padding: '20px', 
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <h3>💳 Expenses</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold' }}>$8,230</p>
        </div>
        <div style={{ 
          background: '#fff3e0', 
          padding: '20px', 
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <h3>💰 Profit</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#2e7d32' }}>$4,220</p>
        </div>
        <div style={{ 
          background: '#f3e5f5', 
          padding: '20px', 
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <h3>📈 Growth</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#1976d2' }}>+12.5%</p>
        </div>
      </div>

      <div style={{ marginTop: '40px', padding: '20px', background: '#fafafa', borderRadius: '8px' }}>
        <h3>⚙️ Quick Actions</h3>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button style={{ 
            padding: '10px 20px', 
            background: '#1976d2', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            cursor: 'pointer'
          }}>
            Add Transaction
          </button>
          <button style={{ 
            padding: '10px 20px', 
            background: '#2e7d32', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            cursor: 'pointer'
          }}>
            Generate Report
          </button>
          <button style={{ 
            padding: '10px 20px', 
            background: '#ed6c02', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            cursor: 'pointer'
          }}>
            Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
