const mongoose = require('mongoose');
require('dotenv').config();
const Talent = require('./models/Talent');
const Job = require('./models/Job');

const talents = [
  {
    name: 'Sophie Laurent',
    role: 'Senior Fullstack Developer',
    location: 'Paris, France',
    bio: 'Passionnée par React et Node.js. 10 ans d\'expérience dans le SaaS.',
    skills: ['React', 'Node.js', 'PostgreSQL', 'AWS'],
    avatar: 'https://picsum.photos/seed/sophie/200',
    isAvailable: true,
    projectsCount: 12,
    followersCount: '1.2k'
  },
  {
    name: 'Thomas Bernard',
    role: 'Mobile App Specialist',
    location: 'Lyon, France',
    bio: 'Expert Flutter et Firebase. J\'adore créer des expériences mobiles fluides.',
    skills: ['Flutter', 'Firebase', 'Dart', 'Swift'],
    avatar: 'https://picsum.photos/seed/thomas/200',
    isAvailable: true,
    projectsCount: 8,
    followersCount: '850'
  },
  {
    name: 'Alex Rivière',
    role: 'UI/UX Designer & Dev',
    location: 'Bordeaux, France',
    bio: 'Un pont entre le design et le code. Spécialiste Vue.js et Tailwind CSS.',
    skills: ['Vue.js', 'Tailwind', 'Figma', 'TypeScript'],
    avatar: 'https://picsum.photos/seed/alex/200',
    isAvailable: false,
    projectsCount: 15,
    followersCount: '2.4k'
  }
];

const jobs = [
  {
    title: 'Senior Frontend Engineer',
    company: 'TechFlow',
    location: 'Remote / Paris',
    salary: '65k€ - 85k€',
    type: 'CDI',
    description: 'Nous recherchons un expert React pour mener le développement de notre nouveau dashboard analytique.',
    tags: ['React', 'TypeScript', 'Tailwind'],
    postedAt: 'Il y a 2 jours',
    logo: 'https://picsum.photos/seed/techflow/100'
  },
  {
    title: 'Fullstack Developer (Node/Vue)',
    company: 'StartupX',
    location: 'Lyon / Hybride',
    salary: '45k€ - 55k€',
    type: 'CDI',
    description: 'Rejoignez une équipe agile pour construire le futur de la logistique urbaine.',
    tags: ['Node.js', 'Vue.js', 'MongoDB'],
    postedAt: 'Il y a 5 heures',
    logo: 'https://picsum.photos/seed/startupx/100'
  },
  {
    title: 'Développeur Mobile Flutter',
    company: 'AppMaster',
    location: 'Nantes',
    salary: '500€ - 700€ / jour',
    type: 'Freelance',
    description: 'Mission de 6 mois pour refondre une application de e-commerce grand public.',
    tags: ['Flutter', 'Dart', 'Firebase'],
    postedAt: 'Hier',
    logo: 'https://picsum.photos/seed/appmaster/100'
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB for seeding...');

    await Talent.deleteMany({});
    await Job.deleteMany({});

    await Talent.insertMany(talents);
    await Job.insertMany(jobs);

    console.log('Successfully seeded Jobs and Talents!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDB();
