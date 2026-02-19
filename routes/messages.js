const express = require('express');
const router = express.Router();
const Conversation = require('../models/Conversation');

// Get all conversations with participant details
router.get('/', async (req, res) => {
  try {
    const conversations = await Conversation.find()
      .populate('participant')
      .sort({ updatedAt: -1 });
    res.json(conversations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
