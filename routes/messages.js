const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const User = require('../models/UserSimple');
const { protect } = require('../middleware/authMiddleware');

// Get all conversations for current user
router.get('/', protect, async (req, res) => {
  try {
    const conversations = await Message.aggregate([
      {
        $match: {
          $or: [
            { sender: req.user._id },
            { receiver: req.user._id }
          ]
        }
      },
      {
        $sort: { createdAt: -1 }
      },
      {
        $group: {
          _id: {
            $cond: [
              { $eq: ['$sender', req.user._id] },
              '$receiver',
              '$sender'
            ]
          },
          lastMessage: { $first: '$content' },
          lastTimestamp: { $first: '$createdAt' },
          unread: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ['$receiver', req.user._id] },
                    { $eq: ['$read', false] }
                  ]
                },
                1,
                0
              ]
            }
          },
          participant: { $first: '$$ROOT' }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'participant'
        }
      },
      {
        $unwind: '$participant'
      }
    ]);

    res.json(conversations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get messages between two users
router.get('/:userId', protect, async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { sender: req.user._id, receiver: req.params.userId },
        { sender: req.params.userId, receiver: req.user._id }
      ]
    })
    .populate('sender', 'name avatar')
    .populate('receiver', 'name avatar')
    .sort({ createdAt: 1 });

    // Mark messages as read
    await Message.updateMany(
      { 
        sender: req.params.userId, 
        receiver: req.user._id, 
        read: false 
      },
      { read: true }
    );

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Send message
router.post('/', protect, async (req, res) => {
  try {
    const { receiver, content, messageType, relatedId } = req.body;

    if (!receiver || !content) {
      return res.status(400).json({ message: 'Receiver and content are required' });
    }

    const message = new Message({
      sender: req.user._id,
      receiver,
      content,
      messageType: messageType || 'text',
      relatedId: relatedId || null
    });

    const savedMessage = await message.save();
    await savedMessage.populate('sender', 'name avatar');
    await savedMessage.populate('receiver', 'name avatar');

    res.status(201).json(savedMessage);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Mark message as read
router.put('/:messageId/read', protect, async (req, res) => {
  try {
    const message = await Message.findOneAndUpdate(
      { 
        _id: req.params.messageId,
        receiver: req.user._id 
      },
      { read: true },
      { new: true }
    );

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    res.json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
