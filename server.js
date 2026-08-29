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

app.get('/api/auth/status', (req, res) => {
  let data = { settings: { allowRegistrations: true }, users: [] };
  if (fs.existsSync(DATA_FILE)) {
    try {
      data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    } catch (e) {
      console.error('Error reading data_store.json:', e);
    }
  }
  const hasAdmin = Array.isArray(data.users) && data.users.some(u => u.role === 'admin');
  res.json({
    hasAdmin,
    allowRegistrations: data.settings?.allowRegistrations ?? true
  });
});

app.use(express.static(path.join(__dirname, 'dist')));

// Express 5 catch-all named parameter
app.get('*path', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server listening on port ${PORT}`);
});
