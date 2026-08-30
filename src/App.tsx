import React from 'react';
import Dashboard from './components/Dashboard';

// Mock user data
const DEMO_USER = {
  id: 'demo-1',
  email: 'demo@example.com',
  role: 'admin',
  status: 'approved'
};

function App() {
  return (
    <div className="App">
      <Dashboard user={DEMO_USER} />
    </div>
  );
}

export default App;
