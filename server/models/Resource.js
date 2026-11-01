const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, default: 'Input' },
  description: { type: String, default: '' },
  price: { type: Number, default: 0 },
  stockQuantity: { type: Number, default: 0 },
  imageUrl: { type: String, default: '' },
  approvalStatus: { type: String, enum: ['Approved', 'Pending'], default: 'Approved' },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Resource', resourceSchema);
