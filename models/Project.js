const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  tags: [String],
  githubUrl: String,
  demoUrl: String,
  image: String,
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserSimple',
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);
