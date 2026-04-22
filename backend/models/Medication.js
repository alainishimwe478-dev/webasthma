import { db } from '../config/firebase.js';

class Medication {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.genericName = data.genericName;
    this.brandName = data.brandName;
    this.category = data.category;
    this.dosageForm = data.dosageForm;
    this.strength = data.strength;
    this.description = data.description;
    this.sideEffects = data.sideEffects || [];
    this.contraindications = data.contraindications || [];
    this.averagePrice = data.averagePrice;
    this.currency = data.currency || 'RWF';
    this.availability = data.availability !== false;
    this.pharmacies = data.pharmacies || [];
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  // Save to Firestore
  async save() {
    const medicationRef = db.collection('medications').doc(this.id);
    await medicationRef.set({
      name: this.name,
      genericName: this.genericName,
      brandName: this.brandName,
      category: this.category,
      dosageForm: this.dosageForm,
      strength: this.strength,
      description: this.description,
      sideEffects: this.sideEffects,
      contraindications: this.contraindications,
      averagePrice: this.averagePrice,
      currency: this.currency,
      availability: this.availability,
      pharmacies: this.pharmacies,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    });
    return this;
  }

  // Find medications
  static async find(query) {
    let medicationsRef = db.collection('medications');

    if (query.name) {
      const nameRegex = new RegExp(query.name, 'i');
      const snapshot = await medicationsRef.get();
      return snapshot.docs
        .filter(doc => nameRegex.test(doc.data().name))
        .map(doc => new Medication({ id: doc.id, ...doc.data() }));
    }

    if (query.category) {
      medicationsRef = medicationsRef.where('category', '==', query.category);
    }

    const snapshot = await medicationsRef.get();
    return snapshot.docs.map(doc => new Medication({ id: doc.id, ...doc.data() }));
  }

  // Find by ID
  static async findById(id) {
    const docSnap = await db.collection('medications').doc(id).get();
    if (!docSnap.exists) return null;
    return new Medication({ id: docSnap.id, ...docSnap.data() });
  }

  // Delete all medications
  static async deleteMany() {
    const batch = db.batch();
    const snapshot = await db.collection('medications').get();
    snapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
    });
    await batch.commit();
  }
}

export default Medication;