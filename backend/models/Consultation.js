import { db } from '../config/firebase.js';

class Consultation {
  constructor(data) {
    this.id = data.id;
    this.patient = data.patient;
    this.doctor = data.doctor;
    this.scheduledDate = data.scheduledDate;
    this.duration = data.duration || 30;
    this.status = data.status || 'scheduled';
    this.type = data.type || 'video';
    this.symptoms = data.symptoms || [];
    this.diagnosis = data.diagnosis;
    this.prescription = data.prescription || [];
    this.notes = data.notes;
    this.meetingLink = data.meetingLink;
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  // Save to Firestore
  async save() {
    const consultationRef = db.collection('consultations').doc(this.id);
    await consultationRef.set({
      patient: this.patient,
      doctor: this.doctor,
      scheduledDate: this.scheduledDate,
      duration: this.duration,
      status: this.status,
      type: this.type,
      symptoms: this.symptoms,
      diagnosis: this.diagnosis,
      prescription: this.prescription,
      notes: this.notes,
      meetingLink: this.meetingLink,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    });
    return this;
  }

  // Find consultations
  static async find(query) {
    let consultationsRef = db.collection('consultations');

    if (query.patient) {
      consultationsRef = consultationsRef.where('patient', '==', query.patient);
    }
    if (query.doctor) {
      consultationsRef = consultationsRef.where('doctor', '==', query.doctor);
    }

    const snapshot = await consultationsRef.orderBy('scheduledDate', 'desc').get();
    return snapshot.docs.map(doc => new Consultation({ id: doc.id, ...doc.data() }));
  }

  // Find by ID
  static async findById(id) {
    const docSnap = await db.collection('consultations').doc(id).get();
    if (!docSnap.exists) return null;
    return new Consultation({ id: docSnap.id, ...docSnap.data() });
  }

  // Find by ID and update
  static async findByIdAndUpdate(id, update) {
    const docRef = db.collection('consultations').doc(id);
    await docRef.update(update);
    const doc = await docRef.get();
    return new Consultation({ id: doc.id, ...doc.data() });
  }

  // Delete all consultations
  static async deleteMany() {
    const batch = db.batch();
    const snapshot = await db.collection('consultations').get();
    snapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
    });
    await batch.commit();
  }
}

export default Consultation;