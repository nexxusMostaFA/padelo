const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const router = express.Router();

router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false,
  }),
);

router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/login',
    session: false,
  }),
  async (req, res) => {
    try {
      const token = jwt.sign(
        {
          userId: req.user._id,
          email: req.user.email,
          role: req.user.role,
        },
        process.env.JWT_SECRET,
        { expiresIn: '7d' },
      );

      res.status(200).json({
        message: 'Google authentication successful',
        token,
        user: {
          email: req.user.email,
          name: req.user.name,
          role: req.user.role,
        },
      });
    } catch (error) {
      console.error('Error during Google callback:', error);
      res.status(500).json({
        message: 'Google authentication failed',
        error: error.message,
      });
    }
  },
);
module.exports = router;
