const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');
const { validateUser } = require('../middleware/validation');

const JWT_SECRET = process.env.JWT_SECRET || 'devconnect_secret_key';

// Function to generate neutral avatar based on name
const generateNeutralAvatar = (name) => {
  // Use UI Avatars API with initials - neutral and professional
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  const colors = ['7f9cf5', '96f2d7', 'ffd93d', 'ff6b6b', '4ecdc4', '45b7d1'];
  const colorIndex = name.charCodeAt(0) % colors.length;
  return `https://ui-avatars.com/api/?name=${initials}&background=${colors[colorIndex]}&color=fff&size=200&font-size=100&bold=true`;
};

// @route   GET api/auth/user/:id
// @desc    Get user by ID
router.get('/user/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST api/auth/register
// @desc    Register user
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, bio, skills, location, country, whatsapp, linkedin, contractType, isAvailable } = req.body;

    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'User already exists' });

    // Generate avatar
    const avatar = generateNeutralAvatar(name);

    user = new User({ 
      name, 
      email, 
      password, 
      role: role || 'developer', 
      bio: bio || '', 
      skills: skills || [], 
      location: location || 'Non renseigné',
      country: country || '',
      whatsapp: whatsapp || '',
      linkedin: linkedin || '',
      contractType: contractType || '',
      isAvailable: isAvailable !== undefined ? isAvailable : true,
      avatar: avatar
    });
    await user.save();

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1d' });
    res.status(201).json({ token, user: { id: user._id, name, email, role, bio, skills, location, country, whatsapp, linkedin, contractType, isAvailable, avatar } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST api/auth/login
// @desc    Authenticate user & get token
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, user: { id: user._id, name: user.name, email, role: user.role } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT api/auth/profile
// @desc    Update user profile
router.put('/profile', protect, validateUser, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.bio = req.body.bio !== undefined ? req.body.bio : user.bio;
      user.skills = req.body.skills || user.skills;
      user.location = req.body.location || user.location;
      user.isAvailable = req.body.isAvailable !== undefined ? req.body.isAvailable : user.isAvailable;

      const updatedUser = await user.save();
      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        avatar: updatedUser.avatar,
        bio: updatedUser.bio,
        skills: updatedUser.skills,
        location: updatedUser.location,
        isAvailable: updatedUser.isAvailable,
        token: req.header('Authorization').split(' ')[1]
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
