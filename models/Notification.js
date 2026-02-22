const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserSimple',
    required: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserSimple'
  },
  type: {
    type: String,
    enum: ['message', 'project', 'job', 'application', 'profile', 'system'],
    required: true
  },
  title: {
    type: String,
    required: true,
    maxlength: 100
  },
  message: {
    type: String,
    required: true,
    maxlength: 500
  },
  relatedId: {
    type: mongoose.Schema.Types.ObjectId // ID du projet, job, message, etc.
  },
  read: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index pour optimiser les requêtes
notificationSchema.index({ recipient: 1, read: 1, createdAt: -1 });
notificationSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);
