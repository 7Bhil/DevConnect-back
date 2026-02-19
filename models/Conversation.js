const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
  participant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Talent',
    required: true
  },
  lastMessage: { type: String, required: true },
  lastTimestamp: { type: String, required: true },
  unread: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Conversation', conversationSchema);
