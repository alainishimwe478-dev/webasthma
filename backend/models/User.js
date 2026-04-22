import { db } from '../config/firebase.js';
import bcrypt from 'bcryptjs';

class User {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.email = data.email;
    this.password = data.password;
    this.role = data.role || 'patient';
    this.avatar = data.avatar;
    this.phone = data.phone;
    this.address = data.address;
    this.district = data.district;
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  // Hash password before saving
  async hashPassword() {
    if (this.password && !this.password.startsWith('$2a$')) {
      this.password = await bcrypt.hash(this.password, 12);
    }
  }

  // Compare password
  async comparePassword(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
  }

  // Save to Firestore
  async save() {
    await this.hashPassword();
    const userRef = db.collection('users').doc(this.id);
    await userRef.set({
      name: this.name,
      email: this.email,
      password: this.password,
      role: this.role,
      avatar: this.avatar,
      phone: this.phone,
      address: this.address,
      district: this.district,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    });
    return this;
  }

  // Find by ID
  static async findById(id) {
    const userDoc = await db.collection('users').doc(id).get();
    if (!userDoc.exists) return null;
    return new User({ id: userDoc.id, ...userDoc.data() });
  }

  // Find by email
  static async findOne(query) {
    if (query.email) {
      const usersRef = db.collection('users');
      const snapshot = await usersRef.where('email', '==', query.email).limit(1).get();
      if (snapshot.empty) return null;
      const doc = snapshot.docs[0];
      return new User({ id: doc.id, ...doc.data() });
    }
    return null;
  }

  // Find all users
  static async find(query = {}) {
    let usersRef = db.collection('users');

    if (query.role) {
      usersRef = usersRef.where('role', '==', query.role);
    }

    const snapshot = await usersRef.get();
    return snapshot.docs.map(doc => new User({ id: doc.id, ...doc.data() }));
  }

  // Delete user
  static async deleteMany() {
    const batch = db.batch();
    const snapshot = await db.collection('users').get();
    snapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
    });
    await batch.commit();
  }
}

export default User;