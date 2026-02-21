// Validation middleware for incoming data

const validateProject = (req, res, next) => {
  const { title, description, tags, githubUrl, demoUrl } = req.body;
  
  // Title validation
  if (!title || title.trim().length < 3) {
    return res.status(400).json({ message: 'Title must be at least 3 characters long' });
  }
  
  if (title.length > 100) {
    return res.status(400).json({ message: 'Title must be less than 100 characters' });
  }
  
  // Description validation
  if (!description || description.trim().length < 10) {
    return res.status(400).json({ message: 'Description must be at least 10 characters long' });
  }
  
  if (description.length > 2000) {
    return res.status(400).json({ message: 'Description must be less than 2000 characters' });
  }
  
  // Tags validation
  if (tags) {
    const tagArray = tags.split(',').map(tag => tag.trim());
    if (tagArray.length > 10) {
      return res.status(400).json({ message: 'Maximum 10 tags allowed' });
    }
    
    for (const tag of tagArray) {
      if (tag.length > 20) {
        return res.status(400).json({ message: 'Each tag must be less than 20 characters' });
      }
    }
  }
  
  // URL validation
  const urlRegex = /^https?:\/\/.+/;
  
  if (githubUrl && !urlRegex.test(githubUrl)) {
    return res.status(400).json({ message: 'GitHub URL must be a valid URL' });
  }
  
  if (demoUrl && !urlRegex.test(demoUrl)) {
    return res.status(400).json({ message: 'Demo URL must be a valid URL' });
  }
  
  next();
};

const validateUser = (req, res, next) => {
  const { name, email, bio, skills, location } = req.body;
  
  // Name validation
  if (name && (name.trim().length < 2 || name.length > 50)) {
    return res.status(400).json({ message: 'Name must be between 2 and 50 characters' });
  }
  
  // Email validation
  if (email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }
  }
  
  // Bio validation
  if (bio && bio.length > 500) {
    return res.status(400).json({ message: 'Bio must be less than 500 characters' });
  }
  
  // Skills validation
  if (skills) {
    if (Array.isArray(skills) && skills.length > 20) {
      return res.status(400).json({ message: 'Maximum 20 skills allowed' });
    }
  }
  
  // Location validation
  if (location && location.length > 100) {
    return res.status(400).json({ message: 'Location must be less than 100 characters' });
  }
  
  next();
};

const validateJob = (req, res, next) => {
  const { title, company, location, salary, type, description, tags } = req.body;
  
  // Title validation
  if (!title || title.trim().length < 3) {
    return res.status(400).json({ message: 'Job title must be at least 3 characters long' });
  }
  
  // Company validation
  if (!company || company.trim().length < 2) {
    return res.status(400).json({ message: 'Company name must be at least 2 characters long' });
  }
  
  // Location validation
  if (!location || location.trim().length < 2) {
    return res.status(400).json({ message: 'Location must be at least 2 characters long' });
  }
  
  // Salary validation
  if (!salary || salary.trim().length < 2) {
    return res.status(400).json({ message: 'Salary information is required' });
  }
  
  // Type validation
  if (!type || !['full-time', 'part-time', 'contract', 'internship', 'remote'].includes(type)) {
    return res.status(400).json({ message: 'Invalid job type' });
  }
  
  // Description validation
  if (!description || description.trim().length < 20) {
    return res.status(400).json({ message: 'Job description must be at least 20 characters long' });
  }
  
  next();
};

module.exports = {
  validateProject,
  validateUser,
  validateJob
};
