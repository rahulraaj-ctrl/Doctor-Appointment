const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Appointment = require('./models/Appointment');

dotenv.config();

async function cleanup() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');

    // Delete all non-admin users (patients and doctors)
    const deletedUsers = await User.deleteMany({ role: { $ne: 'admin' } });
    console.log(`Deleted ${deletedUsers.deletedCount} patients and doctors`);

    // Delete all appointments
    const deletedAppointments = await Appointment.deleteMany({});
    console.log(`Deleted ${deletedAppointments.deletedCount} appointments`);

    console.log('Database cleaned successfully! (Admin users kept)');
    process.exit(0);
  } catch (err) {
    console.error('Cleanup error:', err.message);
    process.exit(1);
  }
}

cleanup();
