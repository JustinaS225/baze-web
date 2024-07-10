import { firestore, initializeApp } from "firebase-admin";
import admin from "./admin";
import { IAlbumData, IAsset, IAssetsCollection, IAssetsDynamicSubcollection, IAssetsStaticSubcollection, IDynamicAssetData, IDynamicAssetDataImage } from "@/interfaces/firestore";
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

export async function fetchAlbumData(collectionName: string, docName: string): Promise<IAlbumData> {
  try {
    const { firestore } = getFirebaseAdmin();
    const db = firestore;

    const realDocName = docName.startsWith('slug_') ? docName.substring(5) : docName;

    // Fetching data for a single album document
    const docRef = db.collection(collectionName).doc(realDocName);
    const docSnapshot = await docRef.get();

    if (!docSnapshot.exists) {
      console.error('Album document not found');
      throw new Error('Album document not found');
    }

    // Assuming the structure of the album data is consistent with the Firestore structure
    const data = docSnapshot.data();

    // Constructing the album data object
    const albumData: IAlbumData = {
      article_body_lt: data?.article_body_lt || "",
      article_subtitle_lt: data?.article_subtitle_lt || "",
      article_title_lt: data?.article_title_lt || "",
      artist: data?.artist || "",
      genre: data?.genre || "",
      image_url: data?.image_url || "",
      product_description_lt: data?.product_description_lt || "",
      product_id: data?.product_id || "",
      product_name: data?.product_name || "",
      product_title_lt: data?.product_title_lt || "",
      rating: data?.rating || 0,
      review_author: data?.review_author || "",
      review_date: data?.review_date || "",
      type: data?.type || "",
    };

    return albumData;

  } catch (error) {
    console.error('Error in fetchAlbumData:', error);
    throw error;
  }
}