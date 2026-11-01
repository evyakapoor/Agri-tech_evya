const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{ name: String, quantity: Number, price: Number }],
  total: { type: Number, default: 0 },
  status: { type: String, enum: ['Pending', 'Packed', 'Shipped', 'Delivered'], default: 'Pending' },
  deliveryDetails: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
