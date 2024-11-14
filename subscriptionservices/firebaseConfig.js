const admin = require('firebase-admin');

let key_details = process.env.FIRESTORE_DETAILS || "SG9yZGFuc28gRmlyZVN0b3Jl";

let key = JSON.parse(Buffer.from(key_details, 'base64').toString('utf-8'));

const serviceAccount = key;


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

module.exports = db;