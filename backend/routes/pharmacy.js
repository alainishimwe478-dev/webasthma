import express from 'express';
import Pharmacy from '../models/Pharmacy.js';
import Medication from '../models/Medication.js';

const router = express.Router();

// Get all pharmacies
router.get('/', async (req, res) => {
  try {
    const { district, service } = req.query;
    let query = {};

    if (district) query.district = district;
    if (service) query.services = service;

    const pharmacies = await Pharmacy.find(query);
    res.json(pharmacies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get pharmacy by ID
router.get('/:id', async (req, res) => {
  try {
    const pharmacy = await Pharmacy.findById(req.params.id);
    if (!pharmacy) {
      return res.status(404).json({ error: 'Pharmacy not found' });
    }
    res.json(pharmacy);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Search pharmacies near location
router.get('/near/:lat/:lon', async (req, res) => {
  try {
    const { lat, lng } = req.params;
    const radius = req.query.radius || 10; // km

    // Simple distance calculation (not accurate for large distances)
    const pharmacies = await Pharmacy.find({
      latitude: { $gte: parseFloat(lat) - 0.1, $lte: parseFloat(lat) + 0.1 },
      longitude: { $gte: parseFloat(lng) - 0.1, $lte: parseFloat(lng) + 0.1 }
    });

    res.json(pharmacies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get medications
router.get('/medications/search', async (req, res) => {
  try {
    const { name, category } = req.query;
    let query = {};

    if (name) query.name = new RegExp(name, 'i');
    if (category) query.category = category;

    const medications = await Medication.find(query)
      .populate('pharmacies', 'name address phone')
      .limit(20);

    res.json(medications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get medication by ID
router.get('/medications/:id', async (req, res) => {
  try {
    const medication = await Medication.findById(req.params.id)
      .populate('pharmacies', 'name address phone district');

    if (!medication) {
      return res.status(404).json({ error: 'Medication not found' });
    }

    res.json(medication);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get medication prices
router.get('/medications/:id/prices', async (req, res) => {
  try {
    const medication = await Medication.findById(req.params.id)
      .populate('pharmacies', 'name address phone district');

    if (!medication) {
      return res.status(404).json({ error: 'Medication not found' });
    }

    const prices = medication.pharmacies.map(pharmacy => ({
      pharmacy: pharmacy.name,
      address: pharmacy.address,
      district: pharmacy.district,
      phone: pharmacy.phone,
      price: medication.averagePrice,
      currency: medication.currency
    }));

    res.json(prices);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;