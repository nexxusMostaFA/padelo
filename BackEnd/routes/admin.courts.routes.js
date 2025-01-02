const express = require('express');
const router = express.Router();
const {
  addCourt,
  updateCourt,
  deleteCourt,
} = require('../controllers/admin.courts.controller');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminAuthMiddleware');

router.post('/', authMiddleware, adminMiddleware, addCourt);

router
  .route('/:id')
  .patch(authMiddleware, adminMiddleware, updateCourt)
  .delete(authMiddleware, adminMiddleware, deleteCourt);

module.exports = router;
