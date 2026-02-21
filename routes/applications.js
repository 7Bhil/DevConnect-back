const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
const Job = require('../models/Job');
const User = require('../models/UserSimple');
const { protect } = require('../middleware/authMiddleware');

// Apply to a job
router.post('/', protect, async (req, res) => {
  try {
    const { 
      jobId, 
      coverLetter, 
      resume, 
      portfolio, 
      expectedSalary, 
      availability 
    } = req.body;

    if (!jobId || !coverLetter) {
      return res.status(400).json({ message: 'Job ID and cover letter are required' });
    }

    // Check if job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check if already applied
    const existingApplication = await Application.findOne({
      job: jobId,
      applicant: req.user._id
    });

    if (existingApplication) {
      return res.status(400).json({ message: 'You have already applied to this job' });
    }

    const application = new Application({
      job: jobId,
      applicant: req.user._id,
      coverLetter,
      resume,
      portfolio,
      expectedSalary,
      availability
    });

    const savedApplication = await application.save();
    await savedApplication.populate('job', 'title company location salary');
    await savedApplication.populate('applicant', 'name email avatar');

    res.status(201).json(savedApplication);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'You have already applied to this job' });
    }
    res.status(400).json({ message: error.message });
  }
});

// Get user's applications
router.get('/my', protect, async (req, res) => {
  try {
    const applications = await Application.find({ applicant: req.user._id })
      .populate('job', 'title company location salary type')
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get applications for a specific job (for recruiters)
router.get('/job/:jobId', protect, async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check if user is the job poster or admin
    if (job.postedBy.toString() !== req.user._id.toString() && req.user.role !== 'superadmin') {
      return res.status(403).json({ message: 'Not authorized to view applications for this job' });
    }

    const applications = await Application.find({ job: req.params.jobId })
      .populate('applicant', 'name email avatar skills location')
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update application status (for recruiters)
router.put('/:applicationId/status', protect, async (req, res) => {
  try {
    const { status, notes } = req.body;

    if (!['pending', 'reviewed', 'shortlisted', 'rejected', 'accepted'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const application = await Application.findById(req.params.applicationId)
      .populate('job');

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Check if user is the job poster or admin
    if (application.job.postedBy.toString() !== req.user._id.toString() && req.user.role !== 'superadmin') {
      return res.status(403).json({ message: 'Not authorized to update this application' });
    }

    application.status = status;
    if (notes !== undefined) {
      application.notes = notes;
    }

    const updatedApplication = await application.save();
    await updatedApplication.populate('applicant', 'name email avatar');

    res.json(updatedApplication);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get application statistics (for recruiters)
router.get('/stats/my', protect, async (req, res) => {
  try {
    // Get all jobs posted by this user
    const userJobs = await Job.find({ postedBy: req.user._id }).select('_id');
    const jobIds = userJobs.map(job => job._id);

    // Get application statistics
    const stats = await Application.aggregate([
      { $match: { job: { $in: jobIds } } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const result = {
      pending: 0,
      reviewed: 0,
      shortlisted: 0,
      rejected: 0,
      accepted: 0,
      total: 0
    };

    stats.forEach(stat => {
      result[stat._id] = stat.count;
      result.total += stat.count;
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
