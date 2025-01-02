const User = require('../models/user.model');
const Audit = require('../models/audit.model');
const validator = require('validator');

exports.deleteUser = async (req, res) => {
  try {
    const { email } = req.params;
    const userId = req.user.id;
    const username = req.user.name;

    if (!validator.isEmail(email)) {
      return res
        .status(400)
        .json({ error: 'Invalid email format' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ error: 'Admin User not found' });
    }

    const deletedUser = await User.findOneAndDelete({
      email: email,
    });
    if (!deletedUser) {
      return res
        .status(404)
        .json({ error: 'User not found' });
    }

    if (email === user.email) {
      return res
        .status(400)
        .json({ error: 'Cannot delete your own account' });
    }


    await Audit.create({
      action: 'DELETE',
      performedBy: userId,
      target: 'User',
      targetId: deletedUser._id,
      metadata: { email: deletedUser.email },
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    res
      .status(200)
      .json({ message: 'User deleted successfully' });
    console.log(
      `Admin ${username} deleted user ${deletedUser.email} at ${new Date()}`,
    );
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json({
      message: 'Users retrieved successfully',
      users,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
