import admin from 'firebase-admin'

const serviceAccount = require(process.env.FIREBASE_ADMIN_PRIVATE_KEY_PATH!);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export default admin;