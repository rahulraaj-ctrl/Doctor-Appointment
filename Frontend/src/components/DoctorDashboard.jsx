import { useState, useEffect } from 'react';
import axios from 'axios';

const DoctorDashboard = ({ token }) => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    if (token) {
      fetchAppointments();
    }
  }, [token]);

  const fetchAppointments = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/appointments', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAppointments(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`http://localhost:5000/api/appointments/${id}/status`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchAppointments();
    } catch (err) {
      alert('Update failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-6">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">Doctor Dashboard</h1>

        <div className="bg-white p-8 rounded-xl shadow-lg">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
            <svg className="w-6 h-6 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Appointment Requests
          </h2>

          <div className="space-y-4">
            {appointments.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No appointments scheduled.</p>
            ) : (
              appointments.map(app => (
                <div key={app._id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition duration-200">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-gray-800 mb-2">{app.patient.name}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                        <p><strong>Email:</strong> {app.patient.email}</p>
                        <p><strong>Date:</strong> {new Date(app.date).toLocaleDateString()}</p>
                        <p><strong>Time:</strong> {app.time}</p>
                      </div>
                      {app.reason && (
                        <p className="text-sm text-gray-600 mt-2"><strong>Reason:</strong> {app.reason}</p>
                      )}
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      app.status === 'approved' ? 'bg-green-100 text-green-800' :
                      app.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                    </span>
                  </div>

                  {app.status === 'pending' && (
                    <div className="flex space-x-3 mt-4">
                      <button
                        onClick={() => updateStatus(app._id, 'approved')}
                        className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-2 rounded-lg hover:from-green-700 hover:to-emerald-700 transition duration-200 font-semibold shadow-md"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => updateStatus(app._id, 'rejected')}
                        className="bg-gradient-to-r from-red-600 to-pink-600 text-white px-6 py-2 rounded-lg hover:from-red-700 hover:to-pink-700 transition duration-200 font-semibold shadow-md"
                      >
                        Reject
                      </button>
                    </div>
                  )}

                  {app.status === 'approved' && new Date(app.date) < new Date() && (
                    <div className="mt-4">
                      <button
                        onClick={() => updateStatus(app._id, 'completed')}
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition duration-200 font-semibold shadow-md"
                      >
                        Mark as Completed
                      </button>
                    </div>
                  )}

                  {/* Rating Display */}
                  {app.rating && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm font-medium text-gray-700 mb-2">Patient Rating:</p>
                      <div className="flex items-center mb-2">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className={`text-lg ${i < app.rating ? 'text-yellow-400' : 'text-gray-300'}`}>
                            ★
                          </span>
                        ))}
                        <span className="ml-2 text-sm text-gray-600">({app.rating}/5)</span>
                      </div>
                      {app.review && (
                        <p className="text-sm text-gray-600 italic">"{app.review}"</p>
                      )}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;