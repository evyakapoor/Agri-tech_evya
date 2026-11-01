const mongoose = require('mongoose');

const soilReportSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  farm: { type: mongoose.Schema.Types.ObjectId, ref: 'Farm', required: true },
  crop: { type: mongoose.Schema.Types.ObjectId, ref: 'Crop' },
  source: { type: String, enum: ['Manual', 'Laboratory', 'Sample'], default: 'Manual' },
  pH: { type: Number, required: true },
  nitrogen: { type: Number, required: true },
  phosphorus: { type: Number, required: true },
  potassium: { type: Number, required: true },
  moisture: { type: Number, required: true },
  organicMatter: { type: Number, required: true },
  testDate: { type: Date, default: Date.now },
  recommendations: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('SoilReport', soilReportSchema);
