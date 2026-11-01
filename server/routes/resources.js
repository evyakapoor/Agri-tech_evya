const express = require('express');
const { body, validationResult } = require('express-validator');
const Resource = require('../models/Resource');
const { protect, requireAdmin } = require('../middleware/auth');

const router = express.Router();

router.get('/', async (req, res) => {
  const resources = await Resource.find({ approvalStatus: 'Approved' }).sort({ createdAt: -1 });
  res.json({ resources });
});

router.post('/', protect, [
  body('name').notEmpty(),
  body('price').isNumeric(),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const resource = await Resource.create({
    ...req.body,
    creator: req.user._id,
    approvalStatus: req.user.role === 'admin' ? 'Approved' : 'Pending',
  });

  res.status(201).json({ resource });
});

router.put('/:id', protect, requireAdmin, async (req, res) => {
  const updated = await Resource.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!updated) return res.status(404).json({ message: 'Resource not found.' });
  res.json({ resource: updated });
});

module.exports = router;
