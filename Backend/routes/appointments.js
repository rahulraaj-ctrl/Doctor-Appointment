const express = require('express');
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const Appointment = require('../models/Appointment');
const User = require('../models/User');

const router = express.Router();

// Get all doctors (for patients to book appointments)
router.get('/doctors', auth, async (req, res) => {
  try {
    const doctors = await User.find({ role: 'doctor' }).select('name email specialization');
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Book appointment (patient)
router.post('/book', auth, [
  body('doctorId').notEmpty(),
  body('date').isISO8601(),
  body('time').notEmpty(),
  body('reason').optional()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  if (req.user.role !== 'patient') return res.status(403).json({ message: 'Only patients can book appointments' });

  const { doctorId, date, time, reason } = req.body;
  try {
    const doctor = await User.findById(doctorId);
    if (!doctor || doctor.role !== 'doctor') return res.status(400).json({ message: 'Invalid doctor' });

    const appointment = new Appointment({ patient: req.user.id, doctor: doctorId, date, time, reason });
    await appointment.save();

    res.json(appointment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get appointments for user
router.get('/', auth, async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'patient') query.patient = req.user.id;
    else if (req.user.role === 'doctor') query.doctor = req.user.id;
    else query = {}; // admin sees all

    const appointments = await Appointment.find(query).populate('patient', 'name email').populate('doctor', 'name email specialization');
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update appointment status (doctor)
router.put('/:id/status', auth, async (req, res) => {
  if (req.user.role !== 'doctor') return res.status(403).json({ message: 'Only doctors can update appointments' });

  const { status } = req.body;
  if (!['approved', 'rejected', 'completed'].includes(status)) return res.status(400).json({ message: 'Invalid status' });

  try {
    const appointment = await Appointment.findById(req.params.id).populate('patient', 'name email').populate('doctor', 'name');
    if (!appointment || appointment.doctor._id.toString() !== req.user.id) return res.status(404).json({ message: 'Appointment not found' });

    appointment.status = status;
    await appointment.save();

    res.json(appointment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Submit rating and review (patient)
router.post('/:id/review', auth, async (req, res) => {
  if (req.user.role !== 'patient') return res.status(403).json({ message: 'Only patients can review appointments' });

  const { rating, review } = req.body;
  if (!rating || rating < 1 || rating > 5) return res.status(400).json({ message: 'Rating must be between 1 and 5' });

  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment || appointment.patient.toString() !== req.user.id) return res.status(404).json({ message: 'Appointment not found' });

    if (appointment.status !== 'completed') return res.status(400).json({ message: 'Can only review completed appointments' });

    appointment.rating = rating;
    appointment.review = review;
    appointment.reviewedAt = new Date();
    await appointment.save();

    res.json(appointment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;