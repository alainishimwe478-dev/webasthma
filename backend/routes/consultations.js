import express from 'express';
import { authenticate } from '../middleware/auth.js';
import Consultation from '../models/Consultation.js';
import User from '../models/User.js';

const router = express.Router();

// Get consultations for user
router.get('/', authenticate, async (req, res) => {
  try {
    const userId = req.user._id;
    const role = req.user.role;

    let consultations;
    if (role === 'patient') {
      consultations = await Consultation.find({ patient: userId })
        .populate('doctor', 'name avatar specialization')
        .sort({ scheduledDate: -1 });
    } else if (role === 'doctor') {
      consultations = await Consultation.find({ doctor: userId })
        .populate('patient', 'name avatar')
        .sort({ scheduledDate: -1 });
    }

    res.json(consultations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create consultation
router.post('/', authenticate, async (req, res) => {
  try {
    const { doctor, scheduledDate, duration, type, symptoms } = req.body;
    const patient = req.user._id;

    const consultation = new Consultation({
      patient,
      doctor,
      scheduledDate,
      duration: duration || 30,
      type: type || 'video',
      symptoms
    });

    await consultation.save();
    await consultation.populate('doctor', 'name avatar specialization');
    await consultation.populate('patient', 'name avatar');

    res.status(201).json(consultation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update consultation
router.put('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const userId = req.user._id;
    const role = req.user.role;

    const consultation = await Consultation.findById(id);
    if (!consultation) {
      return res.status(404).json({ error: 'Consultation not found' });
    }

    // Check permissions
    if (role === 'patient' && consultation.patient.toString() !== userId.toString()) {
      return res.status(403).json({ error: 'Access denied' });
    }
    if (role === 'doctor' && consultation.doctor.toString() !== userId.toString()) {
      return res.status(403).json({ error: 'Access denied' });
    }

    Object.assign(consultation, updates);
    consultation.updatedAt = new Date();
    await consultation.save();

    await consultation.populate('doctor', 'name avatar specialization');
    await consultation.populate('patient', 'name avatar');

    res.json(consultation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get consultation by ID
router.get('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const role = req.user.role;

    const consultation = await Consultation.findById(id)
      .populate('doctor', 'name avatar specialization')
      .populate('patient', 'name avatar');

    if (!consultation) {
      return res.status(404).json({ error: 'Consultation not found' });
    }

    // Check permissions
    if (role === 'patient' && consultation.patient.toString() !== userId.toString()) {
      return res.status(403).json({ error: 'Access denied' });
    }
    if (role === 'doctor' && consultation.doctor.toString() !== userId.toString()) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json(consultation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;