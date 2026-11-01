const mongoose = require('mongoose');

const pestAlertSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  farm: { type: mongoose.Schema.Types.ObjectId, ref: 'Farm', required: true },
  crop: { type: mongoose.Schema.Types.ObjectId, ref: 'Crop' },
  name: { type: String, required: true },
  severity: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
  description: { type: String, default: '' },
  recommendedActions: { type: String, default: '' },
  status: { type: String, enum: ['Open', 'Monitoring', 'Resolved'], default: 'Open' },
  source: { type: String, default: 'Field survey' },
}, { timestamps: true });

module.exports = mongoose.model('PestAlert', pestAlertSchema);
