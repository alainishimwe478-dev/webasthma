import { db } from '../config/firebase.js';

class Message {
  constructor(data) {
    this.id = data.id;
    this.sender = data.sender;
    this.receiver = data.receiver;
    this.content = data.content;
    this.messageType = data.messageType || 'text';
    this.read = data.read || false;
    this.readAt = data.readAt;
    this.createdAt = data.createdAt || new Date();
  }

  // Save to Firestore
  async save() {
    const messageRef = db.collection('messages').doc(this.id);
    await messageRef.set({
      sender: this.sender,
      receiver: this.receiver,
      content: this.content,
      messageType: this.messageType,
      read: this.read,
      readAt: this.readAt,
      createdAt: this.createdAt
    });
    return this;
  }

  // Find messages between users
  static async find(query) {
    let messagesRef = db.collection('messages');

    if (query.$or) {
      // For conversations between two users
      const [user1, user2] = query.$or.map(condition =>
        condition.sender || condition.receiver
      );
      messagesRef = messagesRef.where('sender', 'in', [user1, user2])
                               .where('receiver', 'in', [user1, user2]);
    }

    const snapshot = await messagesRef.orderBy('createdAt', 'desc').get();
    return snapshot.docs.map(doc => new Message({ id: doc.id, ...doc.data() }));
  }

  // Count unread messages
  static async countDocuments(query) {
    let messagesRef = db.collection('messages');

    if (query.receiver && query.read === false) {
      messagesRef = messagesRef.where('receiver', '==', query.receiver)
                               .where('read', '==', false);
    }

    const snapshot = await messagesRef.get();
    return snapshot.size;
  }

  // Update many messages
  static async updateMany(filter, update) {
    const batch = db.batch();
    let messagesRef = db.collection('messages');

    if (filter.sender && filter.receiver && filter.read === false) {
      const snapshot = await messagesRef
        .where('sender', '==', filter.sender)
        .where('receiver', '==', filter.receiver)
        .where('read', '==', false)
        .get();

      snapshot.docs.forEach(doc => {
        batch.update(doc.ref, update);
      });
    }

    await batch.commit();
  }

  // Delete all messages
  static async deleteMany() {
    const batch = db.batch();
    const snapshot = await db.collection('messages').get();
    snapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
    });
    await batch.commit();
  }
}

export default Message;