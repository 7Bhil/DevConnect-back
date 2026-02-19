require('dotenv').config();
const mongoose = require('mongoose');
const Job = require('./models/Job');
const Talent = require('./models/Talent');
const Conversation = require('./models/Conversation');
const { MOCK_JOBS, MOCK_TALENTS, MOCK_CONVERSATIONS } = require('./data/mockData');

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing data
    await Job.deleteMany({});
    await Talent.deleteMany({});
    await Conversation.deleteMany({});
    console.log('Cleared existing collections.');

    // Seed Talents
    const createdTalents = await Talent.insertMany(MOCK_TALENTS.map(t => {
      const { id, ...rest } = t;
      return rest;
    }));
    console.log(`Seeded ${createdTalents.length} talents.`);

    // Seed Jobs
    await Job.insertMany(MOCK_JOBS.map(j => {
      const { id, ...rest } = j;
      return rest;
    }));
    console.log(`Seeded ${MOCK_JOBS.length} jobs.`);

    // Seed Conversations (mapping participants to new Mongo IDs)
    const conversationsToSeed = MOCK_CONVERSATIONS.map((conv, index) => {
      // For simplicity, we match by index as mockData is small
      return {
        participant: createdTalents[index]._id,
        lastMessage: conv.lastMessage,
        lastTimestamp: conv.lastTimestamp,
        unread: conv.unread || 0
      };
    });
    await Conversation.insertMany(conversationsToSeed);
    console.log(`Seeded ${conversationsToSeed.length} conversations.`);

    console.log('Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDB();
