#!/bin/bash

# Find the main App file
if [ -f "src/App.tsx" ]; then
  APP_FILE="src/App.tsx"
elif [ -f "src/App.jsx" ]; then
  APP_FILE="src/App.jsx"
elif [ -f "src/App.js" ]; then
  APP_FILE="src/App.js"
else
  echo "Could not find App file"
  exit 1
fi

echo "Found App file: $APP_FILE"

# Backup original
cp $APP_FILE $APP_FILE.bak

# Create a version that auto-authenticates
cat > $APP_FILE << 'EOF'
import React, { useState, useEffect } from 'react';
import { Dashboard } from './components/Dashboard';

function App() {
  // Auto-login for demo
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [user, setUser] = useState({
    id: '1',
    email: 'demo@example.com',
    role: 'admin',
    status: 'approved'
  });

  return (
    <div className="App">
      <Dashboard user={user} />
    </div>
  );
}

export default App;
