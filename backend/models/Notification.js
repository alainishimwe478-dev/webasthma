import { db } from '../config/firebase.js';

class Notification {
  constructor(data) {
    this.id = data.id;
    this.user = data.user;
    this.title = data.title;
    this.message = data.message;
    this.type = data.type || 'alert';
    this.read = data.read || false;
    this.readAt = data.readAt;
    this.data = data.data;
    this.createdAt = data.createdAt || new Date();
  }

  // Save to Firestore
  async save() {
    const notificationRef = db.collection('notifications').doc(this.id);
    await notificationRef.set({
      user: this.user,
      title: this.title,
      message: this.message,
      type: this.type,
      read: this.read,
      readAt: this.readAt,
      data: this.data,
      createdAt: this.createdAt
    });
    return this;
  }

  // Find notifications
  static async find(query) {
    let notificationsRef = db.collection('notifications');

    if (query.user) {
      notificationsRef = notificationsRef.where('user', '==', query.user);
    }

    const snapshot = await notificationsRef.orderBy('createdAt', 'desc').get();
    return snapshot.docs.map(doc => new Notification({ id: doc.id, ...doc.data() }));
  }

  // Find and update notification
  static async findOneAndUpdate(filter, update) {
    const snapshot = await db.collection('notifications')
      .where('_id', '==', filter._id)
      .where('user', '==', filter.user)
      .limit(1)
      .get();

    if (snapshot.empty) return null;

    const doc = snapshot.docs[0];
    await doc.ref.update(update);
    const updated = await doc.ref.get();
    return new Notification({ id: updated.id, ...updated.data() });
  }

  // Update many notifications
  static async updateMany(filter, update) {
    const batch = db.batch();
    let notificationsRef = db.collection('notifications');

    if (filter.user && filter.read === false) {
      const snapshot = await notificationsRef
        .where('user', '==', filter.user)
        .where('read', '==', false)
        .get();

      snapshot.docs.forEach(doc => {
        batch.update(doc.ref, update);
      });
    }

    await batch.commit();
  }

  // Count documents
  static async countDocuments(query) {
    let notificationsRef = db.collection('notifications');

    if (query.user) {
      notificationsRef = notificationsRef.where('user', '==', query.user);
    }

    const snapshot = await notificationsRef.get();
    return snapshot.size;
  }

  // Delete all notifications
  static async deleteMany() {
    const batch = db.batch();
    const snapshot = await db.collection('notifications').get();
    snapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
    });
    await batch.commit();
  }
}

export default Notification;