import { firestore, initializeApp } from "firebase-admin";
import admin from "./admin";
import { IAsset, IAssetsCollection, IAssetsDynamicSubcollection, IAssetsStaticSubcollection, IDynamicAssetData, IDynamicAssetDataImage } from "@/interfaces/firestore";
import getFirebaseAdmin from "./admin";

export async function fetchData(pageId: string, locale: any, dynamicAssetTypes: string[]): Promise<IAssetsCollection> {
  try {
  const { storage, firestore } = getFirebaseAdmin();
  const db = firestore;
    
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