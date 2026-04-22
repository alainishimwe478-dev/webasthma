import { db, auth } from './config/firebase.js';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';

dotenv.config();

const seedData = async () => {
  try {
    console.log('Starting Firebase seed data...');

    // Create sample users in Firebase Auth
    const users = [
      {
        email: 'patient@example.com',
        password: 'password123',
        name: 'John Doe',
        role: 'patient'
      },
      {
        email: 'doctor@example.com',
        password: 'password123',
        name: 'Dr. Sarah Johnson',
        role: 'doctor'
      }
    ];

    const userIds = {};

    // Create users in Firebase Auth and Firestore
    for (const userData of users) {
      try {
        // Check if user exists
        const existingUser = await auth.getUserByEmail(userData.email).catch(() => null);
        
        if (!existingUser) {
          const userRecord = await auth.createUser({
            email: userData.email,
            password: userData.password,
            displayName: userData.name,
            disabled: false
          });
          userIds[userData.email] = userRecord.uid;
          console.log(`Created user: ${userData.email}`);
        } else {
          userIds[userData.email] = existingUser.uid;
          console.log(`User exists: ${userData.email}`);
        }

        // Save user to Firestore
        const userRef = db.collection('users').doc(userIds[userData.email]);
        await userRef.set({
          name: userData.name,
          email: userData.email,
          role: userData.role,
          phone: userData.role === 'patient' ? '+250788123456' : '+250788654321',
          district: 'Kigali',
          createdAt: new Date(),
          updatedAt: new Date()
        });
      } catch (error) {
        console.log(`User creation note: ${error.message}`);
      }
    }

    // Create patient profile
    const patientId = uuidv4();
    await db.collection('patients').doc(patientId).set({
      user: userIds['patient@example.com'],
      dateOfBirth: new Date('1990-05-15'),
      gender: 'Male',
      emergencyContact: {
        name: 'Jane Doe',
        phone: '+250788111111',
        relationship: 'Wife'
      },
      medicalHistory: [
        {
          condition: 'Asthma',
          diagnosedDate: new Date('2015-03-20'),
          notes: 'Moderate persistent asthma'
        }
      ],
      medications: [
        {
          name: 'Fluticasone Propionate',
          dosage: '100mcg twice daily',
          frequency: 'Twice daily',
          startDate: new Date('2023-01-01')
        },
        {
          name: 'Salbutamol',
          dosage: '100mcg as needed',
          frequency: 'As needed',
          startDate: new Date('2023-01-01')
        }
      ],
      allergies: ['Dust mites', 'Pollen'],
      riskLevel: 'Medium',
      activityLogs: [],
      createdAt: new Date(),
      updatedAt: new Date()
    });
    console.log('Created patient profile');

    // Create doctor profile
    const doctorId = uuidv4();
    await db.collection('doctors').doc(doctorId).set({
      user: userIds['doctor@example.com'],
      specialization: 'Pulmonology',
      licenseNumber: 'MD123456',
      hospital: 'Kigali University Teaching Hospital',
      experience: 8,
      bio: 'Specialist in respiratory diseases with 8 years of experience.',
      availability: [
        { day: 'Monday', startTime: '09:00', endTime: '17:00' },
        { day: 'Wednesday', startTime: '09:00', endTime: '17:00' },
        { day: 'Friday', startTime: '09:00', endTime: '17:00' }
      ],
      rating: 4.8,
      reviewCount: 45,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    console.log('Created doctor profile');

    // Create pharmacies
    const pharmacies = [
      {
        name: 'Central Pharmacy',
        address: 'KG 123 St, Kigali',
        district: 'Kigali',
        latitude: -1.9441,
        longitude: 30.0619,
        phone: '+250788000001',
        services: ['Prescription filling', 'Health screening'],
        rating: 4.5,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Huye Medical Center Pharmacy',
        address: 'KN 45 Ave, Huye',
        district: 'Huye',
        latitude: -2.5858,
        longitude: 29.7390,
        phone: '+250788000002',
        services: ['Emergency medication', 'Consultation'],
        rating: 4.3,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    for (const pharmacyData of pharmacies) {
      const pharmacyId = uuidv4();
      await db.collection('pharmacies').doc(pharmacyId).set(pharmacyData);
    }
    console.log('Created pharmacies');

    // Create medications
    const medications = [
      {
        name: 'Fluticasone Propionate',
        genericName: 'Fluticasone',
        brandName: 'Flovent',
        category: 'controller',
        dosageForm: 'inhaler',
        strength: '100mcg',
        description: 'Corticosteroid for asthma control',
        sideEffects: ['Throat irritation', 'Hoarseness'],
        contraindications: [],
        averagePrice: 25000,
        currency: 'RWF',
        availability: true,
        pharmacies: [],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Salbutamol',
        genericName: 'Albuterol',
        brandName: 'Ventolin',
        category: 'rescue',
        dosageForm: 'inhaler',
        strength: '100mcg',
        description: 'Short-acting bronchodilator for asthma attacks',
        sideEffects: ['Tremor', 'Rapid heartbeat'],
        contraindications: [],
        averagePrice: 15000,
        currency: 'RWF',
        availability: true,
        pharmacies: [],
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    for (const medData of medications) {
      const medId = uuidv4();
      await db.collection('medications').doc(medId).set(medData);
    }
    console.log('Created medications');

    console.log('✅ Firebase seed data completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding data:', error.message);
    process.exit(1);
  }
};

seedData();