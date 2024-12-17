const { db } = require('../firebaseConfig');
const bcrypt = require('bcrypt');
const helper = require('../helper');

// Firestore collection name
const ROLES_COLLECTION = 'roles';

// Add Role
const createrole = async (roleData) => {
  const newRoleRef = db.collection(ROLES_COLLECTION).doc();
  const newRole = {
    id: newRoleRef.id,
    ...roleData,
    created_at: new Date().toISOString(),
  };

  await newRoleRef.set(newRole);
  return newRole;
};

// Edit Role
const updaterole = async (id, updatedData) => {
  const roleRef = db.collection(ROLES_COLLECTION).doc(id);
  const roleDoc = await roleRef.get();

  if (!roleDoc.exists) {
    throw new Error('Role not found');
  }

  await roleRef.update(updatedData);
  const updatedRole = await roleRef.get();
  return updatedRole.data();
};

// Delete Role
const deleterole = async (id) => {
  const roleRef = db.collection(ROLES_COLLECTION).doc(id);
  const roleDoc = await roleRef.get();

  if (!roleDoc.exists) {
    throw new Error('Role not found');
  }

  await roleRef.delete();
};

// List All Roles
const getallroles = async (data) => {
  console.log(data);
  const snapshot = await db.collection(ROLES_COLLECTION)
  .where("role_name", "==", data.user_type)
  .get();
  const roles = snapshot.docs.map((doc) => doc.data());
  return roles;
};

module.exports = { createrole, updaterole, deleterole, getallroles };
