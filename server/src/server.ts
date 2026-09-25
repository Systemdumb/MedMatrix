import dotenv from 'dotenv';
import path from 'path';
import { createApp } from './app.js';
import { connectDatabase } from './config/database.js';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env') });
dotenv.config({ path: path.resolve(process.cwd(), '../.env') });

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    console.log('🚀 Initializing MedMatrix Backend Server...');
    await connectDatabase();

    const app = createApp();

    app.listen(PORT, () => {
      console.log(`📡 MedMatrix API Server running on port ${PORT}`);
      console.log(`🏥 Healthcheck: http://localhost:${PORT}/api/health`);
    });
  } catch (error: any) {
    console.error('❌ Failed to start MedMatrix Server:', error.message || error);
    process.exit(1);
  }
};

startServer();
