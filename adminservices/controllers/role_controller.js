const roleService = require('../services/roleservice');

// Add Role
const addrole = async (req, res) => {
  const { role_name, description, permission } = req.body;

  if (!role_name || !description || !permission) {
    return res.status(400).json({
      error: 'All fields (role_name, description, permission) are required.',
    });
  }

  try {
    const role = await roleService.createrole({ role_name, description, permission });
    res.status(200).json({
      message: 'Role added successfully',

    });
  } catch (error) {
    console.error('Error adding role:', error);
    res.status(500).json({ error: 'Failed to add role.' });
  }
};

// Edit Role
const editrole = async (req, res) => {
  const id  = req.body.id;
  const updatedData = req.body;

  try {
    const role = await roleService.updaterole(id, updatedData);
    res.status(200).json({
      message: 'Role updated successfully',
      role,
    });
  } catch (error) {
    console.error('Error editing role:', error);
    res.status(500).json({ error: 'Failed to edit role.' });
  }
};

// Delete Role
const deleterole = async (req, res) => {
  const { id } = req.body;

  try {
    await roleService.deleterole(id);
    res.status(200).json({ message: 'Role deleted successfully' });
  } catch (error) {
    console.error('Error deleting role:', error);
    res.status(500).json({ error: 'Failed to delete role.' });
  }
};

// List Roles
const listroles = async (req, res) => {
  try {
    const roles = await roleService.getallroles();
    res.status(200).json({ roles });
  } catch (error) {
    console.error('Error listing roles:', error);
    res.status(500).json({ error: 'Failed to list roles.' });
  }
};

module.exports = { addrole, editrole, deleterole, listroles };

