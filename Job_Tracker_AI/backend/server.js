import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

const dataPath = path.join(__dirname, 'data.json');

// Helper to read data
const readData = () => {
  try {
    const data = fs.readFileSync(dataPath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    if (err.code === 'ENOENT') {
      fs.writeFileSync(dataPath, JSON.stringify([]));
      return [];
    }
    throw err;
  }
};

// Helper to write data
const writeData = (data) => {
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
};

// Routes
app.get('/api/jobs', (req, res) => {
  const jobs = readData();
  res.json(jobs);
});

app.post('/api/jobs', (req, res) => {
  const jobs = readData();
  const newJob = req.body;
  jobs.push(newJob);
  writeData(jobs);
  res.status(201).json(newJob);
});

app.put('/api/jobs/:id', (req, res) => {
  const jobs = readData();
  const idx = jobs.findIndex(j => j.id === req.params.id);
  
  if (idx !== -1) {
    jobs[idx] = { ...jobs[idx], ...req.body };
    writeData(jobs);
    res.json(jobs[idx]);
  } else {
    res.status(404).json({ error: 'Job not found' });
  }
});

app.delete('/api/jobs/:id', (req, res) => {
  let jobs = readData();
  const initialLength = jobs.length;
  jobs = jobs.filter(j => j.id !== req.params.id);
  
  if (jobs.length < initialLength) {
    writeData(jobs);
    res.status(204).send();
  } else {
    res.status(404).json({ error: 'Job not found' });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
