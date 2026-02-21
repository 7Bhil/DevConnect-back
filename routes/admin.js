const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const User = require('../models/UserSimple');
const Job = require('../models/Job');

// @route   GET api/admin/stats
// @desc    Get platform stats
router.get('/stats', protect, admin, async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    const jobCount = await Job.countDocuments();
    const developerCount = await User.countDocuments({ role: 'developer' });
    const recruiterCount = await User.countDocuments({ role: 'recruiter' });

    res.json({
      users: userCount,
      jobs: jobCount,
      developers: developerCount,
      recruiters: recruiterCount
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET api/admin/users
// @desc    Get all users (admin only)
router.get('/users', protect, admin, async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
