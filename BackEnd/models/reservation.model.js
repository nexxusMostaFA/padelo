const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    court: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Court',
      required: true,
    },
    day: {
      type: String,
      required: true,
      enum: [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday',
      ], // Enum to ensure valid days
    },
    slotNumber: {
      type: Number,
      required: true,
      min: 1,
      max: 16,
    },
    status: {
      type: String,
      enum: ['reserved', 'cancelled', 'completed'],
      default: 'reserved',
    },
    review: {
      rating: {
        type: Number,
        min: 1,
        max: 10,
      },
      comment: {
        type: String,
        trim: true,
      },
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model(
  'Reservation',
  reservationSchema,
);
