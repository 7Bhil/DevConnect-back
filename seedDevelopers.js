const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');

const developers = [
  {
    name: 'Sophie Laurent',
    email: 'sophie@example.com',
    password: 'password123',
    role: 'developer',
    bio: 'Passionnée par React et Node.js. 10 ans d\'expérience dans le SaaS.',
    skills: ['React', 'Node.js', 'PostgreSQL', 'AWS'],
    avatar: 'https://picsum.photos/seed/sophie/200',
    location: 'Paris, France',
    isAvailable: true,
    projectsCount: 12,
    followersCount: '1.2k'
  },
  {
    name: 'Thomas Bernard',
    email: 'thomas@example.com',
    password: 'password123',
    role: 'developer',
    bio: 'Expert Flutter et Firebase. J\'adore créer des expériences mobiles fluides.',
    skills: ['Flutter', 'Firebase', 'Dart', 'Swift'],
    avatar: 'https://picsum.photos/seed/thomas/200',
    location: 'Lyon, France',
    isAvailable: true,
    projectsCount: 8,
    followersCount: '850'
  },
  {
    name: 'Alex Rivière',
    email: 'alex@example.com',
    password: 'password123',
    role: 'developer',
    bio: 'Un pont entre le design et le code. Spécialiste Vue.js et Tailwind CSS.',
    skills: ['Vue.js', 'Tailwind', 'Figma', 'TypeScript'],
    avatar: 'https://picsum.photos/seed/alex/200',
    location: 'Bordeaux, France',
    isAvailable: false,
    projectsCount: 15,
    followersCount: '2.4k'
  }
];

const seedDevelopers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB for seeding developers...');

    // Delete existing developers to avoid duplicates (optional, but good for clean seed)
    // Avoid deleting the superadmin or other users if possible
    await User.deleteMany({ email: { $in: developers.map(d => d.email) } });

    await User.insertMany(developers);

    console.log('Successfully seeded Developers into User collection!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding developers:', error);
    process.exit(1);
  }
};

seedDevelopers();
