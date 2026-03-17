import express from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import apiRouter from './routes/api';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5173;

app.use(cors());
app.use(express.json());

// API routes
app.use('/api', apiRouter);

app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

// Serve frontend static files
const frontendDistPath = path.join(__dirname, '..', '..', 'frontend', 'dist');
app.use(express.static(frontendDistPath));

// SPA catch-all: serve index.html for any non-API route
app.get('/{*splat}', (req, res) => {
    res.sendFile(path.join(frontendDistPath, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
