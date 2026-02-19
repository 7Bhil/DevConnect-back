const MOCK_JOBS = [
  {
    id: '1',
    title: 'Ingénieur Frontend Senior (React/Next.js)',
    company: 'Vercel',
    location: 'Télétravail',
    salary: '75k€ - 95k€',
    type: 'CDI',
    description: 'Nous recherchons un ingénieur Frontend visionnaire pour rejoindre notre équipe Core UI. Vous serez responsable de la création d\'expériences web haute performance.',
    tags: ['React', 'TypeScript', 'Tailwind'],
    postedAt: 'Il y a 2 heures',
    logo: 'https://picsum.photos/seed/vercel/100/100',
  },
  {
    id: '2',
    title: 'Architecte DevOps',
    company: 'CloudScale Solutions',
    location: 'Paris, FR (Hybride)',
    salary: '700€ - 900€/jour',
    type: 'Freelance',
    description: 'Dirigez la migration d\'infrastructure pour une grande fintech européenne. Une expertise en Kubernetes, Terraform et stratégie multi-cloud est essentielle.',
    tags: ['Kubernetes', 'AWS', 'Terraform'],
    postedAt: 'Hier',
    logo: 'https://picsum.photos/seed/cloud/100/100',
  },
  {
    id: '3',
    title: 'Développeur Backend Python',
    company: 'NeuralNode AI',
    location: 'Lyon, FR',
    salary: '55k€ - 70k€',
    type: 'CDD',
    description: 'Rejoignez une startup IA en forte croissance spécialisée dans le traitement du langage naturel. Vous construirez des APIs robustes traitant des millions de requêtes.',
    tags: ['Python', 'Django', 'Redis'],
    postedAt: 'Il y a 3 jours',
    logo: 'https://picsum.photos/seed/neural/100/100',
  }
];

const MOCK_TALENTS = [
  {
    id: 'dev1',
    name: 'Sophie Laurent',
    role: 'Développeuse Full-stack Senior',
    location: 'Nantes, France',
    bio: 'Passionnée par la création d\'applications web évolutives et le mentorat de développeurs juniors. Spécialisée en architecture cloud.',
    skills: ['React', 'Node.js', 'GraphQL', 'AWS Lambda'],
    avatar: 'https://picsum.photos/seed/sophie/200/200',
    isAvailable: true,
    projectsCount: 12,
    followersCount: '1.2k',
  },
  {
    id: 'dev2',
    name: 'Alexandre Rivière',
    role: 'Spécialiste DevOps & Architecte Cloud',
    location: 'Paris, France',
    bio: 'Enthousiaste de l\'automatisation avec plus de 8 ans d\'expérience dans les pipelines CI/CD et la conteneurisation avec Kubernetes.',
    skills: ['Kubernetes', 'Terraform', 'Azure', 'Go'],
    avatar: 'https://picsum.photos/seed/alex/200/200',
    isAvailable: false,
    projectsCount: 8,
    followersCount: '850',
  },
  {
    id: 'dev3',
    name: 'Thomas Bernard',
    role: 'Ingénieur Mobile Senior',
    location: 'Bordeaux, France',
    bio: 'Spécialiste mobile dédié au développement Flutter et iOS Natif. Expert dans la création d\'animations fluides.',
    skills: ['Flutter', 'Swift', 'Dart', 'Firebase'],
    avatar: 'https://picsum.photos/seed/thomas/200/200',
    isAvailable: true,
    projectsCount: 15,
    followersCount: '2.1k',
  }
];

const MOCK_CONVERSATIONS = [
  {
    id: 'c1',
    participant: MOCK_TALENTS[0],
    lastMessage: 'Peux-tu relire la dernière PR pour l\'API ?',
    lastTimestamp: 'Il y a 2m',
    unread: 1,
  },
  {
    id: 'c2',
    participant: MOCK_TALENTS[1],
    lastMessage: 'Le responsable DevOps a mentionné le déploiement...',
    lastTimestamp: 'Il y a 1h',
  }
];

module.exports = {
  MOCK_JOBS,
  MOCK_TALENTS,
  MOCK_CONVERSATIONS
};
