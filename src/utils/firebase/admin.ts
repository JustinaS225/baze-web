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

import { firestore, initializeApp } from "firebase-admin";
import { IAsset, IAssetsCollection, IAssetsDynamicSubcollection, IAssetsStaticSubcollection, IDynamicAssetData, IDynamicAssetDataImage } from "@/interfaces/firestore";

export async function fetchData(pageId: string, locale: any, dynamicAssetTypes: string[]): Promise<IAssetsCollection> {
  try {
    const db = firestore();
    
  // Fetching common assets
  const commonImagesData: Record<string, IAsset> = {};
  const commonStringsData: Record<string, string> = {};

  const commonImagesSnapshot = await db.collection('Assets').doc('common').collection('Images').get();
  commonImagesSnapshot.forEach((doc) => {
    commonImagesData[doc.id] = doc.data() as IAsset;
  });

  const commonStringsSnapshot = await db.collection('Assets').doc('common').collection('LocalizedStrings').doc(locale).get();
  if (commonStringsSnapshot.exists) {
    const strings = commonStringsSnapshot.data() as Record<string, string>;
    for (const key in strings) {
      commonStringsData[key] = strings[key];
    }
  }

  // Fetching specific assets
  const specificImagesData: Record<string, IAsset> = {};
  const specificStringsData: Record<string, string> = {};

  const specificImagesSnapshot = await db.collection('Assets').doc(pageId).collection('Images').get();
  specificImagesSnapshot.forEach((doc) => {
    specificImagesData[doc.id] = doc.data() as IAsset;
  });

  const specificStringsSnapshot = await db.collection('Assets').doc(pageId).collection('LocalizedStrings').doc(locale).get();
  if (specificStringsSnapshot.exists) {
    const strings = specificStringsSnapshot.data() as Record<string, string>;
    for (const key in strings) {
      specificStringsData[key] = strings[key];
    }
  }

  const dynamicData: IAssetsDynamicSubcollection = {};

  // Fetching dynamic assets
  for (const assetType of dynamicAssetTypes) {
    const assetImagesData: IDynamicAssetDataImage[] = [];
    const assetStringsData: string[] = [];
    const assetSlugsData: string[] = [];

    const assetImagesSnapshot = await db.collection('AssetsDynamic').doc(assetType).collection('Images').get();
    assetImagesSnapshot.forEach((doc) => {
      assetImagesData.push(doc.data() as IDynamicAssetDataImage);
    });

    const assetStringsSnapshot = await db.collection('AssetsDynamic').doc(assetType).collection('LocalizedStrings').doc(locale).get();
    if (assetStringsSnapshot.exists) {
      const strings = assetStringsSnapshot.data() as Record<string, string>;
      for (const key in strings) {
        if (key.startsWith('slug_')) {
          assetSlugsData.push(strings[key]);
        } else {
          assetStringsData.push(strings[key]);
        }
      }
    }

    // Sorting based on product_name
    assetImagesData.sort((a, b) => a.product_name.localeCompare(b.product_name));
    assetStringsData.sort();
    assetSlugsData.sort();

    dynamicData[assetType] = {
      images: assetImagesData,
      strings: assetStringsData,
      slugs: assetSlugsData,
    };
  }

  return {
    static: {
      common: {
        images: commonImagesData,
        strings: commonStringsData,
      },
      pageData: {
        images: specificImagesData,
        strings: specificStringsData,
      },
    },
    dynamic: dynamicData,
  }

  } catch (error) {
    console.error('Error in fetchData:', error);
    throw error;
  }
}

/** 
 * The purpose of this code is to get an instance of the Firebase admin SDK that can be used to interact with the Firebase 
 * backend. The Firebase service account credentials are loaded from environment variables and used to initialize the
 * Firebase admin instance. The getFirebaseAdmin() function returns the cached Firebase admin instance along with the
 * Firebase storage and firestore instances that can be used to interact with Firebase storage and firestore respectively. 
 * */