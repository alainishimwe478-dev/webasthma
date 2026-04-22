import { db } from '../config/firebase.js';

class Doctor {
  constructor(data) {
    this.id = data.id;
    this.user = data.user;
    this.specialization = data.specialization;
    this.licenseNumber = data.licenseNumber;
    this.hospital = data.hospital;
    this.experience = data.experience;
    this.bio = data.bio;
    this.availability = data.availability || [];
    this.rating = data.rating || 0;
    this.reviewCount = data.reviewCount || 0;
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  // Save to Firestore
  async save() {
    const doctorRef = db.collection('doctors').doc(this.id);
    await doctorRef.set({
      user: this.user,
      specialization: this.specialization,
      licenseNumber: this.licenseNumber,
      hospital: this.hospital,
      experience: this.experience,
      bio: this.bio,
      availability: this.availability,
      rating: this.rating,
      reviewCount: this.reviewCount,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    });
    return this;
  }

  // Find by user ID
  static async findOne(query) {
    if (query.user) {
      const doctorsRef = db.collection('doctors');
      const snapshot = await doctorsRef.where('user', '==', query.user).limit(1).get();
      if (snapshot.empty) return null;
      const doc = snapshot.docs[0];
      return new Doctor({ id: doc.id, ...doc.data() });
    }
    return null;
  }

  // Find all doctors
  static async find(query = {}) {
    let doctorsRef = db.collection('doctors');
    const snapshot = await doctorsRef.get();
    return snapshot.docs.map(doc => new Doctor({ id: doc.id, ...doc.data() }));
  }

  // Delete all doctors
  static async deleteMany() {
    const batch = db.batch();
    const snapshot = await db.collection('doctors').get();
    snapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
    });
    await batch.commit();
  }
}

export default Doctor;