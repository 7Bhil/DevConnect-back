const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['developer', 'recruiter', 'superadmin'], default: 'developer' },
  avatar: { type: String, default: '' },
  bio: { type: String, default: '' },
  skills: { type: [String], default: [] },
  location: { type: String, default: 'Non renseigné' },
  country: { type: String, default: '' },
  whatsapp: { type: String, default: '' },
  linkedin: { type: String, default: '' },
  contractType: { type: String, default: '' },
  isAvailable: { type: Boolean, default: true },
  projectsCount: { type: Number, default: 0 },
  followersCount: { type: Number, default: 0 }
}, { timestamps: true });

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('UserSimple', userSchema);
