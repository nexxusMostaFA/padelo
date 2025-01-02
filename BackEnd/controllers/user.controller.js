const User = require('../models/user.model');
const validator = require('validator');
const mongoose = require('mongoose');

exports.addImage = async (req, res) => {
  try {
    const userId = req.params.id.trim();

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res
        .status(400)
        .json({ error: 'Invalid user ID format' });
    }

    if (!req.file) {
      return res
        .status(400)
        .json({ error: 'No photo uploaded' });
    }

    const imageUrl = req.file.path;

    const updatedUser = await exports.updateUserPhoto(
      userId,
      imageUrl,
    );

    res.status(200).json({
      message: 'Photo uploaded successfully',
      user: updatedUser,
    });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'Photo upload failed' });
  }
};

exports.updateUserPhoto = async (userId, imageUrl) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { image: imageUrl },
      { new: true },
    );

    if (!updatedUser) {
      throw new Error('User not found');
    }

    return updatedUser;
  } catch (error) {
    console.error(
      'Error updating user photo:',
      error.message,
    );
    throw error;
  }
};
exports.addPhoneNumber = async (req, res) => {
  try {
    const { userId, PhoneNumber } = req.body;

    if (!validator.isMobilePhone(PhoneNumber, 'any')) {
      return res.status(400).send('Invalid phone number');
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send('User not found');
    }
    user.PhoneNumber = PhoneNumber;
    await user.save();
    res.status(200).json({
      message: 'PhoneNumber added successfully',
      user,
    });
  } catch (error) {
    res.status(500).send('Server error: ' + error.message);
  }
};

exports.updateName = async (req, res) => {
  try {
    const { userId, name } = req.body;

    if (!name) {
      return res.status(400).send('Name is required');
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send('User not found');
    }

    user.name = name;
    await user.save();

    res.status(200).json({
      message: 'Name updated successfully',
      user,
    });
  } catch (error) {
    res.status(500).send('Server error: ' + error.message);
  }
};

exports.updateEmail = async (req, res) => {
  try {
    const { userId, email } = req.body;

    if (!email || !validator.isEmail(email)) {
      return res.status(400).send('Invalid email format');
    }

    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res
        .status(400)
        .send('This email is already in use');
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send('User not found');
    }

    user.email = email;
    await user.save();

    res.status(200).json({
      message: 'Email updated successfully',
      user,
    });
  } catch (error) {
    res.status(500).send('Server error: ' + error.message);
  }
};
