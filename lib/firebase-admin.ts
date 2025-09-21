import admin from 'firebase-admin';

let serviceAccount: admin.ServiceAccount;

// Check the environment
if (process.env.NODE_ENV === 'production') {
  // In production (Vercel), use the Base64 environment variable
  if (!process.env.FIREBASE_SERVICE_ACCOUNT_BASE64) {
    throw new Error('Firebase service account key is not set for production.');
  }
  const serviceAccountString = Buffer.from(
    process.env.FIREBASE_SERVICE_ACCOUNT_BASE64,
    'base64'
  ).toString('utf-8');
  serviceAccount = JSON.parse(serviceAccountString);
} else {
  // In development, use the local key file
  try {
    serviceAccount = require('../serviceAccountKey.json');
  } catch (error) {
    throw new Error('Could not find serviceAccountKey.json in the project root for development.');
  }
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export default admin;