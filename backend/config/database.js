const { Sequelize } = require('sequelize');
const mongoose = require('mongoose');
require('dotenv').config();

// 1. PostgreSQL Connection (Sequelize)
const sequelize = new Sequelize(
  process.env.DB_NAME || 'caption_jualan',
  process.env.DB_USER || 'postgres',
  process.env.DB_PASS || 'postgres',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: false
  }
);

// 2. MongoDB Connection (Mongoose)
const connectMongo = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/caption_jualan');
    console.log('✅ MongoDB Connected (for AI Models)');
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
  }
};

// Function to connect both
const connectDB = async () => {
  try {
    // Connect Postgres
    await sequelize.authenticate();
    console.log('✅ PostgreSQL Connected (for User & Captions)');
    
    // Connect Mongo
    await connectMongo();
  } catch (error) {
    console.error('❌ Database Connection Error:', error);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB, mongoose };
