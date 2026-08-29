const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3001;
const DB_FILE = path.join(__dirname, 'data_store.json');

app.use(cors());
app.use(express.json());

// Initialize store if missing
if (!fs.existsSync(DB_FILE)) {
  fs.writeFileSync(DB_FILE, JSON.stringify({
    settings: { allowRegistrations: true },
    users: []
  }, null, 2));
}

const readData = () => JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
const writeData = (data) => fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));

// Get Auth Context (Users summary & Settings)
app.get('/api/auth/status', (e, res) => {
  const data = readData();
  res.json({
    hasAdmin: data.users.some(u => u.role === 'admin'),
    allowRegistrations: data.settings.allowRegistrations
  });
});

// Get Settings (Admin)
app.get('/api/admin/settings', (req, res) => {
  const data = readData();
  res.json(data.settings);
});

// Update Settings (Admin)
app.post('/api/admin/settings', (req, res) => {
  const data = readData();
  data.settings = { ...data.settings, ...req.body };
  writeData(data);
  res.json(data.settings);
});

// Get All Users (Admin)
app.get('/api/users', (req, res) => {
  const data = readData();
  res.json(data.users);
});

// Register User
app.post('/api/register', (req, res) => {
  const { email, password } = req.body;
  const data = readData();

  const hasAdmin = data.users.some(u => u.role === 'admin');

  // If admin exists, verify registrations are allowed
  if (hasAdmin && !data.settings.allowRegistrations) {
    return res.status(403).json({ error: 'New user registration is currently disabled by administrator.' });
  }

  const existing = data.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.status(400).json({ error: 'An account with this email already exists.' });
  }

  const newUser = {
    id: `usr_${Date.now()}`,
    email,
    passwordHash: password,
    role: !hasAdmin ? 'admin' : 'user',
    isVerified: !hasAdmin, // First admin is auto-verified
    createdAt: new Date().toISOString()
  };

  data.users.push(newUser);
  writeData(data);

  res.json({ user: newUser });
});

// Login User
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  const data = readData();

  const user = data.users.find(u => u.email.toLowerCase() === email.toLowerCase());

  if (!user || user.passwordHash !== password) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  if (!user.isVerified) {
    return res.status(403).json({ error: 'Your account is pending admin approval.' });
  }

  res.json({ user });
});

// Toggle Verification
app.post('/api/admin/users/verify', (req, res) => {
  const { id } = req.body;
  const data = readData();

  data.users = data.users.map(u => u.id === id && u.role !== 'admin' ? { ...u, isVerified: !u.isVerified } : u);
  writeData(data);

  res.json(data.users);
});

app.listen(PORT, () => console.log(`Backend server running on port ${PORT}`));
