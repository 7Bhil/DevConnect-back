const express = require('express');
const router = express.Router();
const Job = require('../models/Job');

// Get all jobs with filters
router.get('/', async (req, res) => {
  try {
    const {
      search,
      type,
      location,
      salary,
      tags,
      page = 1,
      limit = 10
    } = req.query;

    // Build filter object
    const filter = {};

    // Search filter (title, company, description)
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Type filter
    if (type && type !== 'all') {
      filter.type = type;
    }

    // Location filter
    if (location && location !== 'all') {
      filter.location = { $regex: location, $options: 'i' };
    }

    // Salary filter
    if (salary && salary !== 'all') {
      const salaryRanges = {
        '0-30k': { $lte: 30000 },
        '30k-50k': { $gte: 30000, $lte: 50000 },
        '50k-70k': { $gte: 50000, $lte: 70000 },
        '70k-100k': { $gte: 70000, $lte: 100000 },
        '100k+': { $gte: 100000 }
      };
      
      // Extract numeric value from salary string for filtering
      if (salaryRanges[salary]) {
        filter.$expr = {
          $gte: [
            { $toInt: { $arrayElemAt: [{ $split: [{ $replaceAll: { input: '$salary', find: 'k', replacement: '000' } }, ' '] }, 0] } },
            salaryRanges[salary].$gte || 0
          ]
        };
        if (salaryRanges[salary].$lte) {
          filter.$expr.$lte = [
            filter.$expr.$gte[1],
            salaryRanges[salary].$lte
          ];
        }
      }
    }

    // Tags filter
    if (tags) {
      const tagArray = Array.isArray(tags) ? tags : tags.split(',');
      filter.tags = { $in: tagArray };
    }

    // Pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Execute query with pagination
    const jobs = await Job.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    // Get total count for pagination
    const total = await Job.countDocuments(filter);

    res.json({
      jobs,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create job (recruiter only)
router.post('/', async (req, res) => {
  try {
    const { title, company, location, salary, type, description, tags, logo } = req.body;
    
    const job = new Job({
      title,
      company,
      location,
      salary,
      type,
      description,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      logo,
      postedAt: new Date().toLocaleDateString('fr-FR')
    });

    const createdJob = await job.save();
    res.status(201).json(createdJob);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
