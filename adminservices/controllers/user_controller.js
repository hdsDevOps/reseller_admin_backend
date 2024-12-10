const userService = require('../services/userservice');

// Controller for adding a new user
const adduser = async (req, res) => {
  const { first_name, last_name, email, phone, role } = req.body;

  // Validate the input
  if (!first_name || !last_name || !email || !phone || !role) {
    return res.status(400).json({
      error: 'All fields (first_name, last_name, email, phone, role) are required.',
    });
  }

  try {
    // Call the service to add a user
    const user = await userService.createuser({ first_name, last_name, email, phone, role });
    res.status(200).json({
      message: 'New user added successfully',
      status:200
    });
  } catch (error) {
    console.error('Error adding user:', error);
    res.status(500).json({ error: 'Failed to add user.' });
  }
};


// Edit User
const edituser = async (req, res) => {
  const id = req.body.record_id;
  const updatedData = req.body;

  try {
   
    const user = await userService.updateuser(id, updatedData);
    res.status(200).json({
      message: 'User updated successfully',
      user,
    });
  } catch (error) {
    console.error('Error editing user:', error);
    res.status(500).json({ error: 'Failed to edit user.' });
  }
};

// Delete User
const deleteuser = async (req, res) => {
  const record_id  = req.body.id;

  try {
    await userService.deleteuser(record_id);
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Failed to delete user.' });
  }
};

// List Users
const listusers = async (req, res) => {
  try {
    const {role,searchdata}  = req.body;
    const users = await userService.getallusers(role,searchdata);
    res.status(200).json({status:200, users });
  } catch (error) {
    console.error('Error listing users:', error);
    res.status(500).json({ error: 'Failed to list users.' });
  }
};

module.exports = { adduser, edituser, deleteuser, listusers };