const Court = require('../models/court.model');

exports.searchCourts = async (req, res) => {
  try {
    const { q } = req.query;

    const courts = await Court.find({
      name: { $regex: q, $options: 'i' },
    });

    res.status(200).json({ courts });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error searching courts', error });
  }
};

exports.getCourtById = async (req, res) => {
  try {
    const { id } = req.params;

    const court = await Court.findById(id);

    if (!court) {
      return res
        .status(404)
        .json({ message: 'Court not found' });
    }

    res.status(200).json({ court });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error fetching court', error });
  }
};

exports.getCourts = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const courts = await Court.find()
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const formattedCourts = courts.map((court) => ({
      ...court.toObject(),
      schedule: court.schedule.map((day) => ({
        ...day,
        slots: day.slots.map((slot) => ({
          number: slot.number,
          reserved: slot.reserved,
        })),
      })),
      reviewCount: court.reviews.length,
    }));

    const totalCourts = await Court.countDocuments();

    res.status(200).json({
      courts: formattedCourts,
      totalPages: Math.ceil(totalCourts / limit),
      currentPage: page,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error fetching courts', error });
  }
};

exports.addReview = async (req, res) => {
  try {
    const { courtId, userId, rating, comment } = req.body;

    const court = await Court.findById(courtId);
    if (!court) {
      return res
        .status(404)
        .json({ message: 'Court not found' });
    }

    const newReview = {
      user: userId,
      rating,
      comment,
    };
    court.reviews.push(newReview);

    const totalRatings = court.reviews.reduce(
      (acc, review) => acc + review.rating,
      0,
    );
    court.averageRating =
      totalRatings / court.reviews.length;

    await court.save();

    res.status(201).json({
      message: 'Review added successfully!',
      review: newReview,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error adding review',
      error: error.message,
    });
  }
};

exports.getReviews = async (req, res) => {
  try {
    const { courtId } = req.params;

    const court = await Court.findById(courtId).populate(
      'reviews.user',
      'name email',
    );
    if (!court) {
      return res
        .status(404)
        .json({ message: 'Court not found' });
    }

    res.status(200).json({
      message: 'Reviews fetched successfully!',
      reviews: court.reviews,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching reviews',
      error: error.message,
    });
  }
};
