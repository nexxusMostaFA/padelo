const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservation.controller');
const authMiddleware = require('../middleware/authMiddleware');
const checkVerified = require('../middleware/verifiedMiddleware');

router.get(
  '/user/:user',
  authMiddleware,
  checkVerified,
  reservationController.getUserReservations,
);

router.get(
  '/court/:courtId',
  authMiddleware,
  checkVerified,
  reservationController.getCourtReservations,
);

router.post(
  '/',
  authMiddleware,
  checkVerified,
  reservationController.addReservation,
);

router.patch(
  '/:id/cancel',
  authMiddleware,
  checkVerified,
  reservationController.cancelReservation,
);

router.patch(
  '/:id/complete',
  authMiddleware,
  checkVerified,
  reservationController.completeReservation,
);

router.patch(
  '/:id/review',
  authMiddleware,
  checkVerified,
  reservationController.addOrUpdateReview,
);

router.delete(
  '/:id',
  authMiddleware,
  checkVerified,
  reservationController.deleteReservation,
);

router.get(
  '/search',
  reservationController.searchReservations,
);

module.exports = router;
