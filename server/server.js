import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import apiRouter from './routes/api.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/tourism_crm';

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' })); // Support larger payloads for base64 file preview uploading

// API Routes
app.use('/api', apiRouter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date(),
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Graceful connection to MongoDB
console.log('Connecting to MongoDB...');
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Successfully connected to MongoDB.');
  })
  .catch((err) => {
    console.warn('------------------------------------------------------------');
    console.warn('WARNING: Could not connect to MongoDB database at:', MONGODB_URI);
    console.warn('The Express backend will run, but API actions relying on MongoDB will fail.');
    console.warn('To resolve: Make sure MongoDB is running locally or specify a MONGODB_URI in .env');
    console.warn('Error details:', err.message);
    console.warn('------------------------------------------------------------');
  });

// Start Express Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
