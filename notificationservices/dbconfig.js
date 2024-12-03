const admin = require('firebase-admin');
const { getStorage } = require('firebase-admin/storage');
//const serviceAccount = require('./dev-hds-gworkspace-firebase-adminsdk-6ke7i-aab97fb726.json'); // replace with the path to your service account key JSON file

let key_details = process.env.FIRESTORE_DETAILS;

let key = JSON.parse(Buffer.from(key_details, 'base64').toString('utf-8'));

const serviceAccount = key;


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket:'gs://dev-hds-gworkspace.firebasestorage.app',
});

const db = admin.firestore();
const bucket = getStorage().bucket();
module.exports = {db,bucket};