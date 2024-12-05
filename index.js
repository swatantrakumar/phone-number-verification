require('dotenv').config();
const mongoose = require('mongoose');
const loadApi = require('./api/api');




const connectToDatabase = async () => {
  try {
    const DB_HOST = process.env.DB_HOST
    const DB_NAME = process.env.DB_NAME;
    await mongoose.connect(DB_HOST,{"dbName":DB_NAME});
    loadApi();
    console.log('Connected successfully to MongoDB');
  } catch (err) {
    console.error('Failed to connect to MongoDB:', err);
    process.exit(1);
  }
};
connectToDatabase();