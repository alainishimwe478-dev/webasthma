import { db } from '../config/firebase.js';

class Pharmacy {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.address = data.address;
    this.district = data.district;
    this.latitude = data.latitude;
    this.longitude = data.longitude;
    this.phone = data.phone;
    this.email = data.email;
    this.operatingHours = data.operatingHours;
    this.services = data.services || [];
    this.rating = data.rating || 0;
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  // Save to Firestore
  async save() {
    const pharmacyRef = db.collection('pharmacies').doc(this.id);
    await pharmacyRef.set({
      name: this.name,
      address: this.address,
      district: this.district,
      latitude: this.latitude,
      longitude: this.longitude,
      phone: this.phone,
      email: this.email,
      operatingHours: this.operatingHours,
      services: this.services,
      rating: this.rating,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    });
    return this;
  }

  // Find pharmacies
  static async find(query) {
    let pharmaciesRef = db.collection('pharmacies');

    if (query.district) {
      pharmaciesRef = pharmaciesRef.where('district', '==', query.district);
    }

    const snapshot = await pharmaciesRef.get();
    return snapshot.docs.map(doc => new Pharmacy({ id: doc.id, ...doc.data() }));
  }

  // Find by ID
  static async findById(id) {
    const docSnap = await db.collection('pharmacies').doc(id).get();
    if (!docSnap.exists) return null;
    return new Pharmacy({ id: docSnap.id, ...docSnap.data() });
  }

  // Delete all pharmacies
  static async deleteMany() {
    const batch = db.batch();
    const snapshot = await db.collection('pharmacies').get();
    snapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
    });
    await batch.commit();
  }
}

export default Pharmacy;