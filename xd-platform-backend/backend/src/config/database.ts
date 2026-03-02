import mongoose from 'mongoose';
import { env } from './env.js';
import { createModuleLogger } from './logger.js';

const logger = createModuleLogger('Database');

export const connectDatabase = async (): Promise<void> => {
  try {
    const mongoUri = env.MONGODB_URI;
    const maskedUri = mongoUri.replace(
      /:\/\/([^:]+):([^@]+)@/,
      '://$1:****@'
    );

    logger.info({ uri: maskedUri }, 'Connecting to MongoDB...');

    await mongoose.connect(mongoUri);

    logger.info('MongoDB connected successfully');
  } catch (error) {
    logger.error({ error }, 'MongoDB connection failed');
    throw error;
  }
};

mongoose.connection.on('disconnected', () => {
  logger.warn('MongoDB disconnected');
});

mongoose.connection.on('error', (error) => {
  logger.error({ error }, 'MongoDB connection error');
});

process.on('SIGINT', async () => {
  try {
    await mongoose.connection.close();
    logger.info('MongoDB connection closed through app termination');
    process.exit(0);
  } catch (error) {
    logger.error({ error }, 'Error closing MongoDB connection');
    process.exit(1);
  }
});
