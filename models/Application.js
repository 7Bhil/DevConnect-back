const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  applicant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  coverLetter: {
    type: String,
    required: true,
    trim: true,
    maxlength: 2000
  },
  resume: {
    type: String, // URL to resume file
    required: false
  },
  portfolio: {
    type: String, // URL to portfolio
    required: false
  },
  expectedSalary: {
    type: Number,
    required: false
  },
  availability: {
    type: String,
    enum: ['immediate', '2weeks', '1month', '2months', '3months'],
    required: false
  },
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'shortlisted', 'rejected', 'accepted'],
    default: 'pending'
  },
  notes: {
    type: String,
    maxlength: 1000
  }
}, { timestamps: true });

// Prevent duplicate applications
applicationSchema.index({ job: 1, applicant: 1 }, { unique: true });

// Index for performance
applicationSchema.index({ applicant: 1 });
applicationSchema.index({ job: 1 });
applicationSchema.index({ status: 1 });

module.exports = mongoose.model('Application', applicationSchema);
