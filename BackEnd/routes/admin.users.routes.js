// This file contains admin routes for managing users
// DELETE /:email - Delete user by email (requires auth & admin)
// GET / - Get all users (requires auth & admin)

const express = require('express');
const router = express.Router();
const {
  deleteUser,
  getAllUsers,
} = require('../controllers/admin.users.controller');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminAuthMiddleware');

router.delete(
  '/:email',
  authMiddleware,
  adminMiddleware,
  deleteUser,
);

router.get(
  '/',
  authMiddleware,
  adminMiddleware,
  getAllUsers,
);

module.exports = router;
