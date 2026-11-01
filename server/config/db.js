const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let memoryServer;

async function connectDB() {
  const mongoUri = process.env.MONGODB_URI;

  try {
    if (mongoUri) {
      await mongoose.connect(mongoUri);
      global.__MONGO_READY__ = true;
      console.log('MongoDB connected successfully.');
      return mongoose.connection;
    }

    memoryServer = await MongoMemoryServer.create({
      binary: { version: '4.4.29' },
    });
    const uri = memoryServer.getUri();
    await mongoose.connect(uri);
    global.__MONGO_READY__ = true;
    console.log('MongoDB connected to in-memory server.');
    return mongoose.connection;
  } catch (error) {
    global.__MONGO_READY__ = false;
    console.warn('MongoDB unavailable in this environment; continuing without database initialization.', error.message);
    return null;
  }
}

module.exports = connectDB;
