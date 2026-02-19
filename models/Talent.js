const mongoose = require('mongoose');

const talentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  location: { type: String, required: true },
  bio: { type: String, required: true },
  skills: [String],
  avatar: { type: String, required: true },
  isAvailable: { type: Boolean, default: true },
  projectsCount: { type: Number, default: 0 },
  followersCount: { type: String, default: '0' },
}, { timestamps: true });

module.exports = mongoose.model('Talent', talentSchema);
