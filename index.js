require('dotenv').config();
const mongoose = require('mongoose');
const loadApi = require('./server/api/api');




const connectToDatabase = async () => {
  try {
    const DB_HOST = process.env.DB_HOST || 'mongodb://127.0.0.1:27017';
    const DB_NAME = process.env.DB_NAME || 'central-elabs-prod';
    await mongoose.connect(DB_HOST,{"dbName":DB_NAME});
    loadApi();
    console.log('Connected successfully to MongoDB');
  } catch (err) {
    console.error('Failed to connect to MongoDB:', err);
    process.exit(1);
  }
};
connectToDatabase();