const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');

const seedEmails = ['sophie@example.com', 'thomas@example.com', 'alex@example.com'];

const deleteSeedTalents = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB for cleaning talents...');

    const result = await User.deleteMany({ email: { $in: seedEmails } });
    console.log(`Successfully deleted ${result.deletedCount} seed developers.`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error deleting seed developers:', error);
    process.exit(1);
  }
};

deleteSeedTalents();
