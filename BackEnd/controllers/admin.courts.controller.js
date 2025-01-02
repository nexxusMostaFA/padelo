const Court = require('../models/court.model');

exports.addCourt = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      location,
      place,
      email,
      contactNumber,
      image,
    } = req.body;

    const newCourt = new Court({
      name,
      description,
      price,
      contactNumber,
      location,
      place,
      email,
      image,
    });

    await newCourt.save();

    res.status(201).json({
      message: 'Court added successfully!',
      court: newCourt,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error adding court',
      error,
    });
  }
};

exports.updateCourt = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedCourt = await Court.findByIdAndUpdate(
      id,
      updates,
      {
        new: true,
      },
    );

    if (!updatedCourt) {
      return res
        .status(404)
        .json({ message: 'Court not found' });
    }

    res.status(200).json({
      message: 'Court updated successfully!',
      court: updatedCourt,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error updating court', error });
  }
};

exports.getAllCourts = async (req, res) => {
  try {
    const courts = await Court.find({});
    res.status(200).json({
      message: 'Courts retrieved successfully',
      courts,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteCourt = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedCourt = await Court.findByIdAndDelete(id);
    if (!deletedCourt) {
      return res
        .status(404)
        .json({ message: 'Court not found' });
    }

    res
      .status(200)
      .json({ message: 'Court deleted successfully!' });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error deleting court', error });
  }
};
