import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

// Replace with your MongoDB connection string
const dbURI = process.env.MONGO_URI || 'mongodb://localhost:27017/mydatabase'; // Example URI

mongoose.connect(dbURI)
  .then(() => console.log('Database connected',process.env.MONGO_URI ))
  .catch((err) => console.log('Database connection error: ', err));
