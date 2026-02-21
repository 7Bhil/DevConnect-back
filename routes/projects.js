const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');
const { validateProject } = require('../middleware/validation');

// @route   GET api/projects
// @desc    Get all projects
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find()
      .populate('author', 'name avatar')
      .sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST api/projects
// @desc    Create a project
router.post('/', protect, validateProject, async (req, res) => {
  try {
    const { title, description, tags, githubUrl, demoUrl, image } = req.body;
    
    const project = new Project({
      title,
      description,
      tags: tags.split(',').map(tag => tag.trim()),
      githubUrl,
      demoUrl,
      image,
      author: req.user._id
    });

    const createdProject = await project.save();
    
    // Update user's projects count
    await User.findByIdAndUpdate(req.user._id, { $inc: { projectsCount: 1 } });
    
    res.status(201).json(createdProject);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route   GET api/projects/my
// @desc    Get current user's projects
router.get('/my', protect, async (req, res) => {
  try {
    const projects = await Project.find({ author: req.user._id })
      .sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET api/projects/:id
// @desc    Get single project by ID
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate('author', 'name avatar role');
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT api/projects/:id
// @desc    Update a project
router.put('/:id', protect, validateProject, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    // Check if user is the author
    if (project.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this project' });
    }
    
    const { title, description, tags, githubUrl, demoUrl, image } = req.body;
    
    project.title = title || project.title;
    project.description = description || project.description;
    project.tags = tags ? tags.split(',').map(tag => tag.trim()) : project.tags;
    project.githubUrl = githubUrl || project.githubUrl;
    project.demoUrl = demoUrl || project.demoUrl;
    project.image = image || project.image;
    
    const updatedProject = await project.save();
    res.json(updatedProject);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route   DELETE api/projects/:id
// @desc    Delete a project
router.delete('/:id', protect, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    // Check if user is the author
    if (project.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this project' });
    }
    
    await project.deleteOne();
    
    // Update user's projects count
    await User.findByIdAndUpdate(req.user._id, { $inc: { projectsCount: -1 } });
    
    res.json({ message: 'Project removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
