const User = require('../models/user.model');

const checkVerified = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res
        .status(404)
        .json({ error: 'User not found' });
    }

    if (!user.isVerified) {
      return res
        .status(403)
        .json({ error: 'User is not verified' });
    }

    next();
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = checkVerified;
