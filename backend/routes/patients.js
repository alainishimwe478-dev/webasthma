import express from 'express';
import { db } from '../config/firebase.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Get patients assigned to the current doctor
router.get('/', authenticate, async (req, res) => {
  try {
    // Check if Firebase is initialized
    if (!db) {
      return res.status(503).json({
        error: 'Firebase not configured',
        message: 'Please set up Firebase credentials in your .env file'
      });
    }

    const doctorId = req.user.id;

    // Get patients assigned to this doctor
    const patientsSnapshot = await db.collection('patients')
      .where('assignedDoctorId', '==', doctorId)
      .get();

    const patients = [];
    patientsSnapshot.forEach(doc => {
      patients.push({ id: doc.id, ...doc.data() });
    });

    res.json(patients);
  } catch (error) {
    console.error('Error fetching patients:', error);
    res.status(500).json({ error: 'Failed to fetch patients' });
  }
});

// Get patient health logs
router.get('/health-logs', authenticate, async (req, res) => {
  try {
    if (!db) {
      return res.status(503).json({
        error: 'Firebase not configured',
        message: 'Please set up Firebase credentials in your .env file'
      });
    }

    const { patientId } = req.query;

    if (!patientId) {
      return res.status(400).json({ error: 'Patient ID is required' });
    }

    const healthLogsSnapshot = await db.collection('healthLogs')
      .where('patientId', '==', patientId)
      .orderBy('timestamp', 'desc')
      .get();

    const healthLogs = [];
    healthLogsSnapshot.forEach(doc => {
      healthLogs.push({ id: doc.id, ...doc.data() });
    });

    res.json(healthLogs);
  } catch (error) {
    console.error('Error fetching health logs:', error);
    res.status(500).json({ error: 'Failed to fetch health logs' });
  }
});

// Get patient risk history
router.get('/risk-history', authenticate, async (req, res) => {
  try {
    if (!db) {
      return res.status(503).json({
        error: 'Firebase not configured',
        message: 'Please set up Firebase credentials in your .env file'
      });
    }

    const { patientId } = req.query;

    if (!patientId) {
      return res.status(400).json({ error: 'Patient ID is required' });
    }

    const riskHistorySnapshot = await db.collection('riskHistory')
      .where('patientId', '==', patientId)
      .orderBy('timestamp', 'desc')
      .get();

    const riskHistory = [];
    riskHistorySnapshot.forEach(doc => {
      riskHistory.push({ id: doc.id, ...doc.data() });
    });

    res.json(riskHistory);
  } catch (error) {
    console.error('Error fetching risk history:', error);
    res.status(500).json({ error: 'Failed to fetch risk history' });
  }
});

// Get patient medications
router.get('/medications', authenticate, async (req, res) => {
  try {
    if (!db) {
      return res.status(503).json({
        error: 'Firebase not configured',
        message: 'Please set up Firebase credentials in your .env file'
      });
    }

    const { patientId } = req.query;

    if (!patientId) {
      return res.status(400).json({ error: 'Patient ID is required' });
    }

    const medicationsSnapshot = await db.collection('medications')
      .where('patientId', '==', patientId)
      .get();

    const medications = [];
    medicationsSnapshot.forEach(doc => {
      medications.push({ id: doc.id, ...doc.data() });
    });

    res.json(medications);
  } catch (error) {
    console.error('Error fetching medications:', error);
    res.status(500).json({ error: 'Failed to fetch medications' });
  }
});

// Get patient prescriptions
router.get('/prescriptions', authenticate, async (req, res) => {
  try {
    if (!db) {
      return res.status(503).json({
        error: 'Firebase not configured',
        message: 'Please set up Firebase credentials in your .env file'
      });
    }

    const { patientId } = req.query;

    if (!patientId) {
      return res.status(400).json({ error: 'Patient ID is required' });
    }

    const prescriptionsSnapshot = await db.collection('prescriptions')
      .where('patientId', '==', patientId)
      .orderBy('createdAt', 'desc')
      .get();

    const prescriptions = [];
    prescriptionsSnapshot.forEach(doc => {
      prescriptions.push({ id: doc.id, ...doc.data() });
    });

    res.json(prescriptions);
  } catch (error) {
    console.error('Error fetching prescriptions:', error);
    res.status(500).json({ error: 'Failed to fetch prescriptions' });
  }
});

// Get patient consultations
router.get('/consultations', authenticate, async (req, res) => {
  try {
    if (!db) {
      return res.status(503).json({
        error: 'Firebase not configured',
        message: 'Please set up Firebase credentials in your .env file'
      });
    }

    const { patientId } = req.query;

    if (!patientId) {
      return res.status(400).json({ error: 'Patient ID is required' });
    }

    const consultationsSnapshot = await db.collection('consultations')
      .where('patientId', '==', patientId)
      .orderBy('createdAt', 'desc')
      .get();

    const consultations = [];
    consultationsSnapshot.forEach(doc => {
      consultations.push({ id: doc.id, ...doc.data() });
    });

    res.json(consultations);
  } catch (error) {
    console.error('Error fetching consultations:', error);
    res.status(500).json({ error: 'Failed to fetch consultations' });
  }
});

export default router;