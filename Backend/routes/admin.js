const express = require('express');
const bcrypt = require('bcryptjs');
const auth = require('../middleware/auth');
const User = require('../models/User');
const Appointment = require('../models/Appointment');

const router = express.Router();

// Get all doctors
router.get('/doctors', auth, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });

  try {
    const doctors = await User.find({ role: 'doctor' });
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add doctor
router.post('/doctors', auth, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });

  const { name, email, password, specialization } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const doctor = new User({ name, email, password: hashedPassword, role: 'doctor', specialization });
    await doctor.save();
    res.json(doctor);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get dashboard analytics
router.get('/analytics', auth, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });

  try {
    const totalPatients = await User.countDocuments({ role: 'patient' });
    const totalDoctors = await User.countDocuments({ role: 'doctor' });
    const totalAppointments = await Appointment.countDocuments();
    const pendingAppointments = await Appointment.countDocuments({ status: 'pending' });
    const approvedAppointments = await Appointment.countDocuments({ status: 'approved' });
    const completedAppointments = await Appointment.countDocuments({ status: 'completed' });

    // Monthly appointments for the last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyAppointments = await Appointment.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // Popular specializations
    const popularSpecializations = await User.aggregate([
      { $match: { role: 'doctor' } },
      { $group: { _id: '$specialization', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    // Average ratings by doctor
    const doctorRatings = await Appointment.aggregate([
      { $match: { rating: { $exists: true } } },
      {
        $group: {
          _id: '$doctor',
          avgRating: { $avg: '$rating' },
          totalReviews: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'doctor'
        }
      },
      { $unwind: '$doctor' },
      { $project: { name: '$doctor.name', avgRating: 1, totalReviews: 1 } },
      { $sort: { avgRating: -1 } },
      { $limit: 10 }
    ]);

    res.json({
      totalPatients,
      totalDoctors,
      totalAppointments,
      pendingAppointments,
      approvedAppointments,
      completedAppointments,
      monthlyAppointments,
      popularSpecializations,
      doctorRatings
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;