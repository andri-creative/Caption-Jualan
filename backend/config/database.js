const { Sequelize } = require('sequelize');
const mongoose = require('mongoose');
require('dotenv').config();

// 1. PostgreSQL Connection (Sequelize)
const sequelize = new Sequelize("postgresql://postgres.swrmxxjzpvhpawrpzjpc:b2xJrJYDiDAKdA15@aws-1-ap-northeast-1.pooler.supabase.com:6543/postgres", {
      dialect: 'postgres',
      logging: false,
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false
        }
      }
});

// 2. MongoDB Connection (Mongoose)
const connectMongo = async () => {
  try {
    await mongoose.connect("mongodb+srv://Vercel-Admin-atlas-gray-desert:Rw8y5xpIm0xkEJGZ@atlas-gray-desert.77dppkb.mongodb.net/?retryWrites=true&w=majority");
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
    throw error; 
  }
};

module.exports = { sequelize, connectDB, mongoose };
