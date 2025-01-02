const User = require('../models/user.model');

const adminMiddleware = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ error: 'User not found' });
    }

    if (user.role !== 'admin') {
      return res
        .status(403)
        .json({
          error: 'Not authorized - Admin access only',
        });
    }

    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = adminMiddleware;
