const mongoose = require('mongoose');

const consultationSchema = new mongoose.Schema({
  farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  expert: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  subject: { type: String, required: true },
  question: { type: String, required: true },
  response: { type: String, default: '' },
  status: { type: String, enum: ['Open', 'Answered', 'Closed'], default: 'Open' },
}, { timestamps: true });

module.exports = mongoose.model('Consultation', consultationSchema);
