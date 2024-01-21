import admin, { ServiceAccount } from 'firebase-admin';
import * as dotenv from 'dotenv';
import { Bucket } from "@google-cloud/storage"

// Load environment variables
dotenv.config();

// Define Firebase service account credentials
const serviceAccount: ServiceAccount = {
  type: process.env.FIREBASE_TYPE!,
  project_id: process.env.FIREBASE_PROJECT_ID!,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID!,
  private_key: process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, '\n'),
  client_email: process.env.FIREBASE_CLIENT_EMAIL!,
  client_id: process.env.FIREBASE_CLIENT_ID!,
  auth_uri: process.env.FIREBASE_AUTH_URI!,
  token_uri: process.env.FIREBASE_TOKEN_URI!,
  auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL!,
  client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL!
} as ServiceAccount;

let cachedAdmin: any;

export default function getFirebaseAdmin(): {
  app: any,
  firestore: admin.firestore.Firestore,
  storage: Bucket
} {

  if (!cachedAdmin) {
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        storageBucket: `gs://${process.env.FIREBASE_PROJECT_ID}.appspot.com`,
        databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com`
      });
    }
    cachedAdmin = admin;
  }

  const storage = admin.storage().bucket();
  const firestore = admin.firestore();

  return {
    app: cachedAdmin,
    firestore,
    storage
  };
}

/** 
 * The purpose of this code is to get an instance of the Firebase admin SDK that can be used to interact with the Firebase 
 * backend. The Firebase service account credentials are loaded from environment variables and used to initialize the
 * Firebase admin instance. The getFirebaseAdmin() function returns the cached Firebase admin instance along with the
 * Firebase storage and firestore instances that can be used to interact with Firebase storage and firestore respectively. 
 * */