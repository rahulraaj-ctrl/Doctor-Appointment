const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['patient', 'doctor', 'admin'], default: 'patient' },
  specialization: { type: String }, // for doctors
  isApproved: { type: Boolean, default: false }, // doctors need approval, patients are auto-approved
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);