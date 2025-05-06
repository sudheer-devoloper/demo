
import admin from 'firebase-admin';
import serviceAccount from './fir-fbc76-firebase-adminsdk-fbsvc-2c5318ddf7.json'; 

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  });
}

export default admin;
