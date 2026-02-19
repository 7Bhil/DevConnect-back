const express = require('express');
const router = express.Router();
const Talent = require('../models/Talent');

// Get all talents
router.get('/', async (req, res) => {
  try {
    const talents = await Talent.find().sort({ createdAt: -1 });
    res.json(talents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
