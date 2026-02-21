const express = require('express');
const router = express.Router();
const User = require('../models/UserSimple');

// Get all developers as talents with filtering
router.get('/', async (req, res) => {
  try {
    const { 
      search, 
      role, 
      location, 
      availability, 
      skills, 
      contractType, 
      experience,
      page = 1, 
      limit = 12 
    } = req.query;

    // Build filter
    const filter = { role: 'developer' };

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { bio: { $regex: search, $options: 'i' } },
        { skills: { $in: search.split(',').map(s => new RegExp(s.trim(), 'i')) } }
      ];
    }

    if (location && location !== 'all') {
      filter.location = { $regex: location, $options: 'i' };
    }

    if (availability === 'true') {
      filter.isAvailable = true;
    } else if (availability === 'false') {
      filter.isAvailable = false;
    }

    if (skills && skills !== '') {
      const skillArray = skills.split(',').map(s => s.trim());
      filter.skills = { $in: skillArray };
    }

    if (contractType && contractType !== 'all') {
      filter.contractType = contractType;
    }

    // Pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Get talents with pagination
    const talents = await User.find(filter)
      .select('name email role avatar bio skills location country whatsapp linkedin contractType isAvailable projectsCount followersCount createdAt')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    // Get total count for pagination
    const total = await User.countDocuments(filter);
    const pages = Math.ceil(total / limitNum);

    // Get unique skills and locations for filters
    const allTalents = await User.find({ role: 'developer' }).select('skills location');
    const uniqueSkills = [...new Set(allTalents.flatMap(t => t.skills))];
    const uniqueLocations = [...new Set(allTalents.map(t => t.location).filter(loc => loc && loc !== 'Non renseigné'))];

    res.json({
      talents,
      pagination: {
        current: pageNum,
        pages,
        total,
        limit: limitNum
      },
      filters: {
        skills: uniqueSkills,
        locations: uniqueLocations
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single talent by ID
router.get('/:id', async (req, res) => {
  try {
    const talent = await User.findOne({ 
      _id: req.params.id, 
      role: 'developer' 
    });
    
    if (!talent) {
      return res.status(404).json({ message: 'Talent not found' });
    }
    
    res.json(talent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get featured talents
router.get('/featured/list', async (req, res) => {
  try {
    const featuredTalents = await User.find({ 
      role: 'developer',
      available: true
    })
    .sort({ followersCount: -1, projectsCount: -1 })
    .limit(6);
    
    res.json(featuredTalents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
