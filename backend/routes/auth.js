import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { auth, db } from '../config/firebase.js';
import User from '../models/User.js';
import Patient from '../models/Patient.js';
import Doctor from '../models/Doctor.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    // Check if Firebase is initialized
    if (!auth || !db) {
      return res.status(503).json({
        error: 'Firebase not configured',
        message: 'Please set up Firebase credentials in your .env file'
      });
    }

    const { name, email, password, role, ...profileData } = req.body;

    // Create Firebase auth user
    const userRecord = await auth.createUser({
      email,
      password,
      displayName: name
    });

    const userId = userRecord.uid;

    // Create user document
    const user = new User({
      id: userId,
      name,
      email,
      password: '***', // Firebase handles password
      role,
      ...profileData
    });
    await user.save();

    // Create profile based on role
    if (role === 'patient') {
      const patient = new Patient({
        id: uuidv4(),
        user: userId,
        ...profileData
      });
      await patient.save();
    } else if (role === 'doctor') {
      const doctor = new Doctor({
        id: uuidv4(),
        user: userId,
        ...profileData
      });
      await doctor.save();
    }

    res.status(201).json({
      uid: userId,
      user: {
        id: userId,
        name: user.name,
        email: user.email,
        role: user.role
      },
      message: 'User registered successfully'
    });
  } catch (error) {
    if (error.code === 'auth/email-already-exists') {
      return res.status(400).json({ error: 'User already exists' });
    }
    res.status(500).json({ error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Note: Firebase client SDK handles login, this is for demo
    // In production, use Firebase client SDK on frontend
    res.json({
      message: 'Use Firebase Client SDK for login',
      instructions: 'Call firebase.auth().signInWithEmailAndPassword(email, password)'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get current user
router.get('/me', authenticate, async (req, res) => {
  try {
    const userId = req.user.uid;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    let profile = null;

    if (user.role === 'patient') {
      profile = await Patient.findOne({ user: userId });
    } else if (user.role === 'doctor') {
      profile = await Doctor.findOne({ user: userId });
    }

    res.json({ user, profile });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;