const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');

const listUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB...');

    const users = await User.find({}, 'name email role');
    console.log('Current Users in DB:');
    users.forEach(u => console.log(`- ${u.name} (${u.email}) [${u.role}]`));
    
    process.exit(0);
  } catch (error) {
    console.error('Error listing users:', error);
    process.exit(1);
  }
};

listUsers();
