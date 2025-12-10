import { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import API_URL from '../config';

const convertTo12Hour = (time24) => {
  if (!time24) return '';
  const [hours, minutes] = time24.split(':');
  let hour = parseInt(hours);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  hour = hour % 12 || 12;
  return `${hour}:${minutes} ${ampm}`;
};

const AppointmentTimelineItem = ({ appointment, token, onReview, isLast }) => {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState('');

  const submitReview = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/api/appointments/${appointment._id}/review`, {
        rating,
        review
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowReviewForm(false);
      onReview();
    } catch (err) {
      alert('Failed to submit review');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'approved': return 'bg-green-500';
      case 'completed': return 'bg-blue-500';
      case 'rejected': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return '⏳';
      case 'approved': return '✅';
      case 'completed': return '🎉';
      case 'rejected': return '❌';
      default: return '📅';
    }
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <span key={i} className={`text-lg ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}>
        ★
      </span>
    ));
  };

  return (
    <div className="relative flex items-start mb-8">
      {/* Timeline dot */}
      <div className={`w-4 h-4 rounded-full ${getStatusColor(appointment.status)} border-4 border-white shadow-md z-10`}></div>

      {/* Content */}
      <div className="ml-8 flex-1">
        <div className="bg-gray-50 rounded-lg p-6 shadow-sm">
          {/* Header */}
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="flex items-center mb-2">
                <span className="text-2xl mr-2">{getStatusIcon(appointment.status)}</span>
                <h3 className="font-semibold text-lg text-gray-800">{appointment.doctor?.name || 'Doctor (Deleted)'}</h3>
                <span className={`ml-3 px-3 py-1 rounded-full text-xs font-semibold ${
                  appointment.status === 'approved' ? 'bg-green-100 text-green-800' :
                  appointment.status === 'rejected' ? 'bg-red-100 text-red-800' :
                  appointment.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-1"><strong>Specialization:</strong> {appointment.doctor?.specialization || 'N/A'}</p>
              <p className="text-sm text-gray-600 mb-1"><strong>Date:</strong> {new Date(appointment.date).toLocaleDateString()}</p>
              <p className="text-sm text-gray-600 mb-1"><strong>Time:</strong> {convertTo12Hour(appointment.time)}</p>
              <p className="text-sm text-gray-500"><strong>Booked on:</strong> {new Date(appointment.createdAt).toLocaleDateString()}</p>
            </div>
          </div>

          {/* Reason */}
          {appointment.reason && (
            <div className="mb-4">
              <p className="text-sm text-gray-600"><strong>Reason:</strong> {appointment.reason}</p>
            </div>
          )}

          {/* Rating Display */}
          {appointment.rating && (
            <div className="mb-4 p-3 bg-white rounded-lg border">
              <p className="text-sm font-medium text-gray-700 mb-2">Your Rating:</p>
              <div className="flex items-center mb-2">
                {renderStars(appointment.rating)}
                <span className="ml-2 text-sm text-gray-600">({appointment.rating}/5)</span>
              </div>
              {appointment.review && (
                <p className="text-sm text-gray-600 italic">"{appointment.review}"</p>
              )}
            </div>
          )}

          {/* Review Button */}
          {appointment.status === 'completed' && !appointment.rating && (
            <button
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg transition duration-200 font-semibold"
            >
              {showReviewForm ? 'Cancel Review' : 'Rate & Review'}
            </button>
          )}
        </div>

        {/* Review Form */}
        {showReviewForm && (
          <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
            <form onSubmit={submitReview}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className={`text-2xl ${star <= rating ? 'text-yellow-400' : 'text-gray-300'} hover:text-yellow-400 transition duration-200`}
                    >
                      ★
                    </button>
                  ))}
                  <span className="ml-2 text-sm text-gray-600 self-center">({rating}/5)</span>
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Review (Optional)</label>
                <textarea
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  placeholder="Share your experience with this doctor..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition duration-200"
                  rows="3"
                />
              </div>
              <div className="flex space-x-2">
                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition duration-200 font-semibold"
                >
                  Submit Review
                </button>
                <button
                  type="button"
                  onClick={() => setShowReviewForm(false)}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition duration-200 font-semibold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

const PatientDashboard = ({ token }) => {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [time, setTime] = useState('');
  const [reason, setReason] = useState('');

  useEffect(() => {
    if (token) {
      fetchAppointments();
      fetchDoctors();
    }
  }, [token]);

  const fetchAppointments = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/appointments`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAppointments(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchDoctors = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/appointments/doctors`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDoctors(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const bookAppointment = async (e) => {
    e.preventDefault();
    if (!selectedDate) {
      alert('Please select a date');
      return;
    }

    const dateString = selectedDate.toISOString().split('T')[0]; // Convert to YYYY-MM-DD format

    try {
      await axios.post(`${API_URL}/api/appointments/book`, {
        doctorId: selectedDoctor,
        date: dateString,
        time,
        reason
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchAppointments();
      setSelectedDoctor('');
      setSelectedDate(null);
      setTime('');
      setReason('');
    } catch (err) {
      alert('Booking failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="container mx-auto max-w-6xl">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">Patient Dashboard</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Book Appointment Section */}
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
              <svg className="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Book New Appointment
            </h2>
            <form onSubmit={bookAppointment} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Doctor</label>
                <select
                  value={selectedDoctor}
                  onChange={(e) => setSelectedDoctor(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                  required
                >
                  <option value="">Choose a doctor</option>
                  {doctors.map(doctor => (
                    <option key={doctor._id} value={doctor._id}>{doctor.name} - {doctor.specialization}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                  <DatePicker
                    selected={selectedDate}
                    onChange={(date) => setSelectedDate(date)}
                    minDate={new Date()}
                    dateFormat="yyyy-MM-dd"
                    placeholderText="Select appointment date"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                    calendarClassName="shadow-lg border border-gray-200 rounded-lg"
                    dayClassName={(date) =>
                      date.toDateString() === new Date().toDateString()
                        ? "bg-blue-100 text-blue-800 font-semibold"
                        : "hover:bg-blue-50"
                    }
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Reason for Visit</label>
                <textarea
                  placeholder="Describe your symptoms or reason for appointment"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 resize-none"
                  rows="3"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition duration-200 font-semibold shadow-lg"
              >
                Book Appointment
              </button>
            </form>
          </div>

          {/* Appointments History */}
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
              <svg className="w-6 h-6 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Appointment Timeline
            </h2>
            <div className="space-y-6">
              {appointments.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No appointments yet. Book your first appointment!</p>
              ) : (
                <div className="relative">
                  {/* Timeline line */}
                  <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-300"></div>

                  {appointments
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                    .map((appointment, index) => (
                      <AppointmentTimelineItem
                        key={appointment._id}
                        appointment={appointment}
                        token={token}
                        onReview={fetchAppointments}
                        isLast={index === appointments.length - 1}
                      />
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;