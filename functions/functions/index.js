/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const functions = require("firebase-functions");
const admin = require('firebase-admin');
const { Storage } = require('@google-cloud/storage');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs').promises;

admin.initializeApp();
const db = admin.firestore();
const storage = new Storage();

function generateRandomId(length) {
    let result           = '';
    let characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

exports.onUploadProduct = functions.storage.object().onFinalize(async (object) => {
    try {
        const bucket = storage.bucket(object.bucket);
        const filePath = object.name;

        if (filePath.startsWith('Albums/AdditionalImages/')) {
            return;
        }

        if (!filePath.startsWith('Albums/')) {
            return;
        }

        const fileName = filePath.split('/').pop();
        const fileFolder = filePath.substring(0, filePath.lastIndexOf("/"));
  
        // Only continue if the file is not a webp
        if (fileName.endsWith('.webp')) {
            return;
        }
  
        const tempLocalFile = `/tmp/${fileName}`;
        const tempLocalDir = path.dirname(tempLocalFile);
  
        await fs.mkdir(tempLocalDir, { recursive: true });
  
        await bucket.file(filePath).download({destination: tempLocalFile});
  
        await sharp(tempLocalFile)
            .webp()
            .toFile(tempLocalFile + '.webp');
  
        const product_id = generateRandomId(10); // Generate a random ID
        const product_name = fileName.replace(/\.[^/.]+$/, ""); // Get original product name
  
        const webpFileName = product_id + ".webp";
  
        await bucket.upload(tempLocalFile + '.webp', {
            destination: filePath.replace(fileName, webpFileName),
            metadata: { contentType: 'image/webp' }
        });
  
        await bucket.file(filePath).delete();
  
        const fileURL = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(fileFolder + '/' + webpFileName)}?alt=media`;
  
        const assetsRef = db.collection('AssetsDynamic').doc('albums');
  
        const imagesRef = assetsRef.collection('Images');
        await imagesRef.doc(product_id).set({
            image_url: fileURL,
            product_id: product_id,
            product_name: product_name
        });
  
        const localizedStringsRef = assetsRef.collection('LocalizedStrings');
  
        const localizedStringsEnRef = localizedStringsRef.doc('en');
        await localizedStringsEnRef.set({
            [product_name]: {
                author: 'Author',
                title: 'Title',
                type: 'EP/ALBUM/SINGLE',
                genre: 'Genre',
                review_author: 'Author of the review',
                created_at: admin.firestore.FieldValue.serverTimestamp(),
            },
            [`slug_${product_name}`]: `slug_${product_name}`,
        }, { merge: true });
  
        const localizedStringsLtRef = localizedStringsRef.doc('lt');
        await localizedStringsLtRef.set({
            [product_name]: {
                author: 'Autorius',
                title: 'Pavadinimas',
                type: 'Tipas',
                genre: 'Žanras',
                review_author: 'Recenzijos autorius',
                created_at: admin.firestore.FieldValue.serverTimestamp(),
            },
            [`slug_${product_name}`]: `slug_${product_name}`,
        }, { merge: true });

        const albumsRef = db.collection('Albums').doc(product_name);
        await albumsRef.set({
            product_id: product_id,
            product_name: product_name,
            product_title_lt: 'Produkto pavadinimas lietuvių kalba',
            product_description_lt: '',
            type: '',
            artist: '',
            review_author: '',
            genre: '',
            review_date: '',
            article_title_lt: '',
            article_subtitle_lt: '',
            article_body_lt: '',
            rating: 0,
            image_url: fileURL
        });

        // Create an additionalImages folder in Cloud Storage
        const additionalImagesFolder = `Albums/AdditionalImages/${product_name}`;
        await bucket.dir(additionalImagesFolder).create();

        // Create an AdditionalImages collection in Firestore
        await albumsRef.collection('AdditionalImages').add({});
  } catch (error) {
    console.error('Error occurred:', error);
  }
});

exports.onUploadStaticAsset = functions.storage.object().onFinalize(async (object) => {
    try {
        const bucket = storage.bucket(object.bucket);
        const filePath = object.name;

        if (!filePath.startsWith('Assets/')) {
            return;
        }

        const fileName = filePath.split('/').pop();
        const fileFolder = filePath.split('/')[1]; // Get the specific folder the file was uploaded to
  
        // Only continue if the file is not a webp
        if (fileName.endsWith('.webp')) {
            return;
        }
  
        const tempLocalFile = `/tmp/${fileName}`;
        const tempLocalDir = path.dirname(tempLocalFile);
  
        await fs.mkdir(tempLocalDir, { recursive: true });
  
        await bucket.file(filePath).download({destination: tempLocalFile});
  
        await sharp(tempLocalFile)
            .webp()
            .toFile(tempLocalFile + '.webp');
  
        const image_id = generateRandomId(10); // Generate a random ID
        const image_name = fileName.replace(/\.[^/.]+$/, ""); // Get original image name
  
        const webpFileName = image_id + ".webp";
  
        await bucket.upload(tempLocalFile + '.webp', {
            destination: filePath.replace(fileName, webpFileName),
            metadata: { contentType: 'image/webp' }
        });
  
        await bucket.file(filePath).delete();
  
        const fileURL = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(webpFileName)}`;
  
        const assetsRef = db.collection('Assets').doc(fileFolder);
  
        const imagesRef = assetsRef.collection('Images');
        await imagesRef.doc(image_name).set({  // Here's the change - use .doc(image_name).set instead of .add
            image_url: fileURL,
            image_name: image_name
        });
  
  } catch (error) {
    console.error('Error occurred:', error);
  }
});

exports.onUploadAdditionalImage = functions.storage.object().onFinalize(async (object) => {
    try {
        const bucket = storage.bucket(object.bucket);
        const filePath = object.name;

        if (!filePath.startsWith('Albums/AdditionalImages/')) {
            return;
        }

        let fileName = filePath.split('/').pop();

        if (!fileName.includes('_additional') || fileName.endsWith('.webp')) {
            return;
        }

        // remove '_additional' and file extension from the filename to get the product_name
        let productName = fileName.replace('_additional', '').split('.')[0]; 

        const paintingsRef = db.collection('Albums');
        const paintingRef = paintingsRef.doc(productName);

        // check if a document with this product_name exists
        const doc = await paintingRef.get();
        if (!doc.exists) {
            console.log(`No document found with the product_name: ${productName}`);
            return;
        }

        const tempLocalFile = `/tmp/${fileName}`;
        const tempLocalDir = path.dirname(tempLocalFile);

        await fs.mkdir(tempLocalDir, { recursive: true });
        await bucket.file(filePath).download({destination: tempLocalFile});

        await sharp(tempLocalFile)
            .webp()
            .toFile(tempLocalFile + '.webp');

        const product_id = generateRandomId(10); 
        const webpFileName = product_id + ".webp";

        await bucket.upload(tempLocalFile + '.webp', {
            destination: filePath.replace(fileName, webpFileName),
            metadata: { contentType: 'image/webp' }
        });

        await bucket.file(filePath).delete();

        const fileURL = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(webpFileName)}`;

        const additionalImagesRef = paintingRef.collection('AdditionalImages');

        await additionalImagesRef.add({
            image_url: fileURL,
            product_id: product_id,
            product_name: productName
        });

    } catch (error) {
        console.error('Error occurred:', error);
    }
});