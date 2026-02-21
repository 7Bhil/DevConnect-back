const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Function to generate neutral avatar based on name
const generateNeutralAvatar = (name) => {
  // Use DiceBear API with neutral style based on name seed
  const seed = name.toLowerCase().replace(/\s+/g, '');
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}&backgroundColor=b6e3f4,c0aede,d1d4f9&radius=50`;
};

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

// Hash password before saving
userSchema.pre('save', function(next) {
  // Hash password if it's modified
  if (this.isModified('password')) {
    const salt = bcrypt.genSaltSync(10);
    this.password = bcrypt.hashSync(this.password, salt);
  }
  
  next();
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
