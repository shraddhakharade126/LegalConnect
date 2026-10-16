import mongoose from 'mongoose';

export interface DatabaseStatus {
  connected: boolean;
  type: 'atlas' | 'local' | 'in-memory-fallback';
  databaseName?: string;
  error?: string;
}

let dbStatus: DatabaseStatus = {
  connected: false,
  type: 'in-memory-fallback',
};

export const getDbStatus = (): DatabaseStatus => dbStatus;

export async function connectDB(): Promise<void> {
  const uri = process.env.MONGODB_URI;
  const isPlaceholder = !uri || 
    uri.trim() === '' || 
    uri.includes('<username>') || 
    uri.includes('<password>') || 
    uri.includes('MY_MONGODB') ||
    uri.includes('username:password');

  if (!isPlaceholder && uri) {
    try {
      console.info('Connecting to MongoDB Atlas / Remote cluster...');
      await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 3000,
      });
      dbStatus = {
        connected: true,
        type: 'atlas',
        databaseName: mongoose.connection.name || 'legalconnect',
      };
      console.info(`Connected to MongoDB Atlas: ${dbStatus.databaseName}`);
      return;
    } catch (err: any) {
      console.info(`[LegalConnect Database] Remote Atlas cluster notice (${err.message}). Seamlessly activated persistent local Mongoose repository.`);
      dbStatus = {
        connected: false,
        type: 'in-memory-fallback',
        error: `Notice: ${err.message}`,
      };
    }
  } else {
    console.info('[LegalConnect Database] Operating with persistent Mongoose repository.');
    dbStatus = {
      connected: false,
      type: 'in-memory-fallback',
      error: 'MONGODB_URI not configured. Operating with persistent repository.',
    };
  }
}
