import { db } from '../config/firebase.js';

class Patient {
  constructor(data) {
    this.id = data.id;
    this.user = data.user;
    this.dateOfBirth = data.dateOfBirth;
    this.gender = data.gender;
    this.emergencyContact = data.emergencyContact;
    this.medicalHistory = data.medicalHistory || [];
    this.medications = data.medications || [];
    this.allergies = data.allergies || [];
    this.riskLevel = data.riskLevel || 'Low';
    this.lastRiskAssessment = data.lastRiskAssessment;
    this.activityLogs = data.activityLogs || [];
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  // Save to Firestore
  async save() {
    const patientRef = db.collection('patients').doc(this.id);
    await patientRef.set({
      user: this.user,
      dateOfBirth: this.dateOfBirth,
      gender: this.gender,
      emergencyContact: this.emergencyContact,
      medicalHistory: this.medicalHistory,
      medications: this.medications,
      allergies: this.allergies,
      riskLevel: this.riskLevel,
      lastRiskAssessment: this.lastRiskAssessment,
      activityLogs: this.activityLogs,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    });
    return this;
  }

  // Find by user ID
  static async findOne(query) {
    if (query.user) {
      const patientsRef = db.collection('patients');
      const snapshot = await patientsRef.where('user', '==', query.user).limit(1).get();
      if (snapshot.empty) return null;
      const doc = snapshot.docs[0];
      return new Patient({ id: doc.id, ...doc.data() });
    }
    return null;
  }

  // Find all patients
  static async find(query = {}) {
    let patientsRef = db.collection('patients');
    const snapshot = await patientsRef.get();
    return snapshot.docs.map(doc => new Patient({ id: doc.id, ...doc.data() }));
  }

  // Delete all patients
  static async deleteMany() {
    const batch = db.batch();
    const snapshot = await db.collection('patients').get();
    snapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
    });
    await batch.commit();
  }
}

export default Patient;