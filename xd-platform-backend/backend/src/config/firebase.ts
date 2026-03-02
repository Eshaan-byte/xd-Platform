import admin from 'firebase-admin';
import { env } from './env.js';
import { createModuleLogger } from './logger.js';

const logger = createModuleLogger('Firebase');

export const initializeFirebase = (): void => {
  try {
    if (!env.FIREBASE_PRIVATE_KEY || !env.FIREBASE_PROJECT_ID || !env.FIREBASE_CLIENT_EMAIL) {
      throw new Error('Firebase credentials not configured');
    }
    const privateKey = env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n');

    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: env.FIREBASE_PROJECT_ID,
        clientEmail: env.FIREBASE_CLIENT_EMAIL,
        privateKey: privateKey,
      }),
    });

    logger.info(
      { projectId: env.FIREBASE_PROJECT_ID },
      'Firebase Admin SDK initialized successfully'
    );
  } catch (error) {
    logger.error({ error }, 'Failed to initialize Firebase Admin SDK');
    throw error;
  }
};

export const verifyFirebaseToken = async (
  token: string
): Promise<admin.auth.DecodedIdToken> => {
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    return decodedToken;
  } catch (error) {
    logger.error({ error }, 'Failed to verify Firebase token');
    throw new Error('Invalid or expired token');
  }
};

export const getFirebaseAuth = () => admin.auth();
