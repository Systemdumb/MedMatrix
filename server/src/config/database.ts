import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

// Ensure env variables are loaded
dotenv.config({ path: path.resolve(process.cwd(), '.env') });
dotenv.config({ path: path.resolve(process.cwd(), '../.env') });

let isConnected = false;

export const connectDatabase = async (): Promise<typeof mongoose | undefined> => {
  if (isConnected) {
    return mongoose;
  }

  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error('❌ MONGODB_URI environment variable is missing.');
    throw new Error('MONGODB_URI environment variable is missing in server configuration.');
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });

    isConnected = true;
    // Log success WITHOUT printing credentials
    console.log(`✅ MongoDB connected successfully to database: "${conn.connection.name}"`);
    return mongoose;
  } catch (error: any) {
    console.error('❌ MongoDB connection error:', error.message || error);
    throw error;
  }
};

export const closeDatabase = async (): Promise<void> => {
  if (isConnected) {
    await mongoose.connection.close();
    isConnected = false;
    console.log('🔌 MongoDB connection closed gracefully.');
  }
};

process.on('SIGINT', async () => {
  await closeDatabase();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await closeDatabase();
  process.exit(0);
});
