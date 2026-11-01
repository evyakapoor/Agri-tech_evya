const mongoose = require('mongoose');

const farmSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true, trim: true },
  address: { type: String, default: '' },
  region: { type: String, default: '' },
  coordinates: {
    lat: { type: Number, default: null },
    lng: { type: Number, default: null },
  },
  totalArea: { type: Number, required: true },
  areaUnit: { type: String, default: 'acre' },
  soilType: { type: String, default: 'Loamy' },
  irrigationMethod: { type: String, default: 'Drip' },
}, { timestamps: true });

farmSchema.index({ owner: 1, name: 1 });

module.exports = mongoose.model('Farm', farmSchema);
