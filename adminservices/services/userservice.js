const { db } = require('../firebaseConfig');
const bcrypt = require('bcrypt');
const helper = require('../helper');
// Collection name in Firestore
const USERS_COLLECTION = 'system_users';

// Function to generate a random password
const generatePassword = (length = 10) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*!';
    let password = '';
    for (let i = 0; i < length; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

// Service function to add a new user
const createuser = async (userData) => {
  userData.created_at = new Date();
  const rawPassword = generatePassword(); // Generate dynamic password
  const hashedPassword = await bcrypt.hash(rawPassword, 10); // Hash the password
  const newUserRef = db.collection(USERS_COLLECTION).doc();
  const subject = "New account created";
  const text = "New Login details : uname : "+userData.email+" and password : "+rawPassword;
  let to_ary = {to:userData.email,subject:subject,text:text};
  await helper.sendMail(to_ary, subject, text);
  const newUser = { id: newUserRef.id,
    password: hashedPassword,
    ...userData };

  await newUserRef.set(newUser); // Save user data to Firestore
  return newUser;
};



// Edit User
const updateuser = async (id, updatedData) => {
    const userRef = db.collection(USERS_COLLECTION).doc(id);
    const userDoc = await userRef.get();
  
    if (!userDoc.exists) {
      throw new Error('User not found');
    }
  
    await userRef.update(updatedData);
    const updatedUser = await userRef.get();
    return updatedUser.data();
  };
  
  // Delete User
  const deleteuser = async (id) => {
    const userRef = db.collection(USERS_COLLECTION).doc(id);
    const userDoc = await userRef.get();
  
    if (!userDoc.exists) {
      throw new Error('User not found');
    }
  
    await userRef.delete();
  };
  
  // List Users
  const getallusers = async (role,searchValue) => {
    const snapshot = await db.collection(USERS_COLLECTION)
    .where('role', '==', role)
    .get();
    console.log(searchValue)
    try {
      // Validate input
      if (!searchValue || searchValue.trim() === '') {
        console.log('Search value is empty. Please provide a valid input.');
        return [];
      }
  
      const searchText = searchValue.toLowerCase();
  
    const rolequery = await db.collection(USERS_COLLECTION)
    .where('role', '==', role)
    .get();

      // Query each field separately
      const firstNameQuery = db.collection(USERS_COLLECTION)
        .orderBy('first_name')
        .startAt(searchText)
        .endAt(searchText + '\uf8ff')
        .get();
  
      const lastNameQuery = db.collection(USERS_COLLECTION)
        .orderBy('last_name')
        .startAt(searchText)
        .endAt(searchText + '\uf8ff')
        .get();
  
      const emailQuery = db.collection(USERS_COLLECTION)
        .orderBy('email')
        .startAt(searchText)
        .endAt(searchText + '\uf8ff')
        .get();
  
      // Wait for all queries to resolve
      const [firstNameSnapshot, lastNameSnapshot, emailSnapshot,roleSnapshot] = await Promise.all([
        firstNameQuery,
        lastNameQuery,
        emailQuery,
        rolequery
      ]);
  
      // Combine results
      const results = new Map();
  
      const addToResults = (snapshot) => {
        snapshot.forEach((doc) => {
          results.set(doc.id, { id: doc.id, ...doc.data() });
        });
      };
  
      addToResults(firstNameSnapshot);
      addToResults(lastNameSnapshot);
      addToResults(emailSnapshot);
      addToResults(roleSnapshot);
  
      // Convert results to an array
      const combinedResults = Array.from(results.values());
  
      return combinedResults;
    } catch (error) {
      console.error('Error performing wildcard search:', error);
      throw error;
    }
   
  };
  
  module.exports = { createuser, updateuser, deleteuser, getallusers };
