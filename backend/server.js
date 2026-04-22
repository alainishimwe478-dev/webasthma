import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { firebase } from './config/firebase.js';

// Routes
import authRoutes from './routes/auth.js';
import dashboardRoutes from './routes/dashboard.js';
import messageRoutes from './routes/messages.js';
import consultationRoutes from './routes/consultations.js';
import environmentRoutes from './routes/environment.js';
import pharmacyRoutes from './routes/pharmacy.js';
import notificationRoutes from './routes/notifications.js';
import aiRoutes from './routes/ai.js';
import patientsRoutes from './routes/patients.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Firebase is initialized when imported from config/firebase.js

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:4173",
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/consultations', consultationRoutes);
app.use('/api/environment', environmentRoutes);
app.use('/api/pharmacy', pharmacyRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/patients', patientsRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString(), backend: 'Firebase' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`WebAsthma backend server running on port ${PORT} with Firebase`);
});

