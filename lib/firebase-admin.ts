import admin from 'firebase-admin';

// Directly import the service account key from the root
import serviceAccount from '../serviceAccountKey.json';

if (!admin.apps.length) {
  admin.initializeApp({
    // Cast the imported JSON to the correct type
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  });
}

export default admin;