const request = require('supertest');
const mongoose = require('mongoose');
const { app } = require('../server');
const connectDB = require('../config/db');

jest.setTimeout(120000);

beforeAll(async () => {
  const db = await connectDB();
  global.__MONGO_READY__ = !!db;
});

afterAll(async () => {
  if (global.__MONGO_READY__) {
    await mongoose.disconnect();
  }
});

test('registers a new user and returns profile', async () => {
  if (!global.__MONGO_READY__) {
    return;
  }

  const response = await request(app)
    .post('/api/auth/register')
    .send({
      name: 'Test Farmer',
      email: 'farmertest@example.com',
      password: 'Password123',
      location: 'Bhopal',
    });

  expect(response.status).toBe(201);
  expect(response.body.user.email).toBe('farmertest@example.com');
});

test('logs in an existing user', async () => {
  if (!global.__MONGO_READY__) {
    return;
  }

  const response = await request(app)
    .post('/api/auth/login')
    .send({
      email: 'farmertest@example.com',
      password: 'Password123',
    });

  expect(response.status).toBe(200);
  expect(response.body.user.name).toBe('Test Farmer');
});
