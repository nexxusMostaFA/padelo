const express = require('express');
const router = express.Router();
const courtController = require('../controllers/court.controller');

router.get('/', courtController.getCourts);

router.get('/search', courtController.searchCourts);

router.get('/:id', courtController.getCourtById);
router
  .route('/:id/reviews')
  .post(courtController.addReview)
  .get(courtController.getReviews);
module.exports = router;
