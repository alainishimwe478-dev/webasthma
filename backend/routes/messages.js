import express from 'express';
import { authenticate } from '../middleware/auth.js';
import Message from '../models/Message.js';
import User from '../models/User.js';

const router = express.Router();

// Get messages between two users
router.get('/:otherUserId', authenticate, async (req, res) => {
  try {
    const { otherUserId } = req.params;
    const userId = req.user._id;

    const messages = await Message.find({
      $or: [
        { sender: userId, receiver: otherUserId },
        { sender: otherUserId, receiver: userId }
      ]
    })
    .populate('sender', 'name avatar')
    .populate('receiver', 'name avatar')
    .sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Send message
router.post('/', authenticate, async (req, res) => {
  try {
    const { receiver, content, messageType } = req.body;
    const sender = req.user._id;

    const message = new Message({
      sender,
      receiver,
      content,
      messageType: messageType || 'text'
    });

    await message.save();
    await message.populate('sender', 'name avatar');
    await message.populate('receiver', 'name avatar');

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mark messages as read
router.put('/read/:otherUserId', authenticate, async (req, res) => {
  try {
    const { otherUserId } = req.params;
    const userId = req.user._id;

    await Message.updateMany(
      { sender: otherUserId, receiver: userId, read: false },
      { read: true, readAt: new Date() }
    );

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get unread message count
router.get('/unread/count', authenticate, async (req, res) => {
  try {
    const userId = req.user._id;

    const count = await Message.countDocuments({
      receiver: userId,
      read: false
    });

    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;