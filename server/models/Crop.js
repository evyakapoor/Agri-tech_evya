const mongoose = require('mongoose');

const cropSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  farm: { type: mongoose.Schema.Types.ObjectId, ref: 'Farm', required: true },
  cropName: { type: String, required: true },
  variety: { type: String, default: '' },
  plantingDate: { type: Date, required: true },
  expectedHarvestDate: { type: Date, required: true },
  fieldArea: { type: Number, required: true },
  growthStage: { type: String, enum: ['Seedling', 'Vegetative', 'Flowering', 'Fruiting', 'Maturity'], default: 'Vegetative' },
  healthStatus: { type: String, enum: ['Healthy', 'Monitoring', 'At Risk'], default: 'Healthy' },
  notes: { type: String, default: '' },
}, { timestamps: true });

cropSchema.index({ owner: 1, farm: 1, cropName: 1 });

module.exports = mongoose.model('Crop', cropSchema);
