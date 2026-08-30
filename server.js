import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 9600;
const DATA_FILE = path.join(__dirname, 'data_store.json');

app.use(cors());
app.use(express.json());

// Helper to read data store
const readData = () => {
  if (!fs.existsSync(DATA_FILE)) {
    return { settings: { allowRegistrations: true }, users: [] };
  }
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  } catch (e) {
    return { settings: { allowRegistrations: true }, users: [] };
  }
};

// Helper to write data store safely
const writeData = (data) => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
};

// GET Auth Status
app.get('/api/auth/status', (req, res) => {
  const data = readData();
  const hasAdmin = Array.isArray(data.users) && data.users.some(u => u.role === 'admin');
  res.json({
    hasAdmin,
    allowRegistrations: data.settings?.allowRegistrations ?? true
  });
});

// POST Register / Primary Admin Setup
app.post('/api/auth/register', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required.' });
  }

  const data = readData();
  const hasAdmin = data.users.some(u => u.role === 'admin');

  // Check if user exists
  if (data.users.some(u => u.email === email)) {
    return res.status(400).json({ error: 'User already exists.' });
  }

  // Determine role and initial status
  const role = hasAdmin ? 'user' : 'admin';
  const status = hasAdmin ? 'pending' : 'approved';

  const newUser = {
    id: Date.now().toString(),
    email,
    password, // Stored locally
    role,
    status,
    createdAt: new Date().toISOString()
  };

  data.users.push(newUser);
  writeData(data);

  res.status(201).json({
    message: 'User registered successfully',
    user: { id: newUser.id, email: newUser.email, role: newUser.role, status: newUser.status }
  });
});

// POST Login
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const data = readData();
  const user = data.users.find(u => u.email === email && u.password === password);

  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials.' });
  }

  if (user.status !== 'approved') {
    return res.status(403).json({ error: 'Account pending admin approval.' });
  }

  res.json({
    user: { id: user.id, email: user.email, role: user.role, status: user.status }
  });
});

// Serve static frontend files
app.use(express.static(path.join(__dirname, 'dist')));

// Express 5 catch-all for SPA routes
app.get('*path', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server listening on port ${PORT}`);
});
