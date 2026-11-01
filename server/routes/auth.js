const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const router = express.Router();

function signToken(user) {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'agri-tech-secret-key', { expiresIn: '7d' });
}

function setAuthCookie(res, token) {
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 1000 * 60 * 60 * 24 * 7,
  });
}

router.post('/register', [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Use a valid email address'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { name, email, password, phone, location, preferredLanguage } = req.body;

    const existing = await User.findOne({ email: String(email).toLowerCase() });
    if (existing) {
      return res.status(409).json({ message: 'User already exists.' });
    }

    const user = await User.create({
      name,
      email: String(email).toLowerCase(),
      password: await bcrypt.hash(password, 10),
      phone: phone || '',
      location: location || '',
      preferredLanguage: preferredLanguage === 'hi' ? 'hi' : 'en',
      role: 'farmer',
    });

    const token = signToken(user);
    setAuthCookie(res, token);

    return res.status(201).json({
      message: 'Registration successful.',
      user: { ...user.toObject(), password: undefined },
    });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to register user.', error: error.message });
  }
});

router.post('/login', [
  body('email').isEmail(),
  body('password').notEmpty(),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: String(email).toLowerCase() });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const token = signToken(user);
    setAuthCookie(res, token);

    return res.json({
      message: 'Login successful.',
      user: { ...user.toObject(), password: undefined },
    });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to login.', error: error.message });
  }
});

router.get('/me', protect, async (req, res) => {
  res.json({ user: req.user });
});

router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out successfully.' });
});

router.put('/profile', protect, async (req, res) => {
  try {
    const { name, phone, location, preferredLanguage } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        name: name || req.user.name,
        phone: phone || req.user.phone,
        location: location || req.user.location,
        preferredLanguage: preferredLanguage === 'hi' ? 'hi' : 'en',
      },
      { new: true }
    ).select('-password');

    return res.json({ user: updatedUser });
  } catch (error) {
    return res.status(500).json({ message: 'Profile update failed.', error: error.message });
  }
});

router.put('/password', protect, [body('currentPassword').notEmpty(), body('newPassword').isLength({ min: 6 })], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);

    const valid = await bcrypt.compare(currentPassword, user.password);
    if (!valid) {
      return res.status(400).json({ message: 'Current password is incorrect.' });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    return res.json({ message: 'Password updated successfully.' });
  } catch (error) {
    return res.status(500).json({ message: 'Password change failed.', error: error.message });
  }
});

module.exports = router;
