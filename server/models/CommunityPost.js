const mongoose = require('mongoose');

const communityPostSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  category: { type: String, default: 'General' },
  comments: [{ author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, message: String, createdAt: { type: Date, default: Date.now } }],
  moderationStatus: { type: String, enum: ['Approved', 'Pending'], default: 'Approved' },
}, { timestamps: true });

module.exports = mongoose.model('CommunityPost', communityPostSchema);
