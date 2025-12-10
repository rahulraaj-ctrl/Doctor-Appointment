import { useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from '../config';

const AnalyticsDashboard = ({ analytics }) => {
  const formatMonth = (monthData) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[monthData._id.month - 1]} ${monthData._id.year}`;
  };

  return (
    <div className="space-y-8">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Patients</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.totalPatients}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Doctors</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.totalDoctors}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Appointments</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.totalAppointments}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending Appointments</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.pendingAppointments}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Appointment Status Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Appointment Status</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Approved</span>
              <span className="font-semibold text-green-600">{analytics.approvedAppointments}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Completed</span>
              <span className="font-semibold text-blue-600">{analytics.completedAppointments}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Pending</span>
              <span className="font-semibold text-yellow-600">{analytics.pendingAppointments}</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Popular Specializations</h3>
          <div className="space-y-3">
            {analytics.popularSpecializations.map((spec, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-sm text-gray-600">{spec._id || 'General'}</span>
                <span className="font-semibold text-purple-600">{spec.count} doctors</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Monthly Appointments Chart */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Monthly Appointments (Last 6 Months)</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {analytics.monthlyAppointments.map((month, index) => (
            <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">{formatMonth(month)}</p>
              <p className="text-2xl font-bold text-blue-600">{month.count}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Top Rated Doctors */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Top Rated Doctors</h3>
        <div className="space-y-4">
          {analytics.doctorRatings.map((doctor, index) => (
            <div key={index} className="flex justify-between items-center p-4 border border-gray-200 rounded-lg">
              <div>
                <p className="font-semibold text-gray-800">{doctor.name}</p>
                <p className="text-sm text-gray-600">{doctor.totalReviews} reviews</p>
              </div>
              <div className="flex items-center">
                <div className="flex mr-2">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={`text-sm ${i < Math.round(doctor.avgRating) ? 'text-yellow-400' : 'text-gray-300'}`}>
                      ★
                    </span>
                  ))}
                </div>
                <span className="font-semibold text-gray-800">{doctor.avgRating.toFixed(1)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const AdminPanel = ({ token }) => {
  const [doctors, setDoctors] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [analytics, setAnalytics] = useState(null);
  const [activeTab, setActiveTab] = useState('doctors');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (token) {
      fetchDoctors();
      fetchAnalytics();
    }
  }, [token]);

  const fetchDoctors = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/admin/doctors`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDoctors(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/admin/analytics`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAnalytics(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const addDoctor = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/api/admin/doctors`, {
        name,
        email,
        password,
        specialization
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccessMessage('Doctor added successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
      fetchDoctors();
      setName('');
      setEmail('');
      setPassword('');
      setSpecialization('');
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Add doctor failed');
      setTimeout(() => setErrorMessage(''), 3000);
    }
  };

  const deleteDoctor = async (id) => {
    try {
      await axios.delete(`${API_URL}/api/admin/doctors/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccessMessage('Doctor deleted successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
      fetchDoctors();
    } catch (err) {
      console.error('Delete error:', err);
      console.error('Error response:', err.response);
      const errorMsg = err.response?.data?.message || err.message || 'Delete failed';
      setErrorMessage(errorMsg);
      setTimeout(() => setErrorMessage(''), 3000);
    }
  };

  const approveDoctor = async (id) => {
    try {
      await axios.put(`${API_URL}/api/admin/doctors/${id}/approve`, 
        { isApproved: true },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccessMessage('Doctor approved successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
      fetchDoctors();
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Approve failed');
      setTimeout(() => setErrorMessage(''), 3000);
    }
  };

  const rejectDoctor = async (id) => {
    try {
      await axios.put(`${API_URL}/api/admin/doctors/${id}/approve`, 
        { isApproved: false },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccessMessage('Doctor rejected');
      setTimeout(() => setSuccessMessage(''), 3000);
      fetchDoctors();
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Reject failed');
      setTimeout(() => setErrorMessage(''), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-6">
      <div className="container mx-auto max-w-6xl">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">Admin Panel</h1>

        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-400 rounded-lg">
            <div className="flex items-center">
              <svg className="w-6 h-6 text-green-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <p className="text-green-700 font-semibold">{successMessage}</p>
            </div>
          </div>
        )}

        {errorMessage && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-400 rounded-lg">
            <div className="flex items-center">
              <svg className="w-6 h-6 text-red-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <p className="text-red-700 font-semibold">{errorMessage}</p>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-white p-1 rounded-lg shadow-md">
            <button
              onClick={() => setActiveTab('doctors')}
              className={`px-6 py-2 rounded-md font-semibold transition duration-200 ${
                activeTab === 'doctors'
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Manage Doctors
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-6 py-2 rounded-md font-semibold transition duration-200 ${
                activeTab === 'analytics'
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Analytics
            </button>
          </div>
        </div>

        {activeTab === 'doctors' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Add Doctor Section */}
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                <svg className="w-6 h-6 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add New Doctor
              </h2>
              <form onSubmit={addDoctor} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    placeholder="Enter doctor's full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <input
                    type="email"
                    placeholder="Enter doctor's email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                  <input
                    type="password"
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Specialization</label>
                  <input
                    type="text"
                    placeholder="e.g., Cardiology, Dermatology"
                    value={specialization}
                    onChange={(e) => setSpecialization(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-4 rounded-lg hover:from-purple-700 hover:to-pink-700 transition duration-200 font-semibold shadow-lg"
                >
                  Add Doctor
                </button>
              </form>
            </div>

            {/* Doctors List */}
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                <svg className="w-6 h-6 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Manage Doctors
              </h2>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {doctors.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No doctors added yet.</p>
                ) : (
                  doctors.map(doctor => (
                    <div key={doctor._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition duration-200">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-800">{doctor.name}</h3>
                          <p className="text-sm text-gray-600">{doctor.email}</p>
                          <p className="text-sm text-gray-600"><strong>Specialization:</strong> {doctor.specialization}</p>
                          <div className="mt-2">
                            {doctor.isApproved ? (
                              <span className="inline-block px-3 py-1 text-xs font-semibold bg-green-100 text-green-800 rounded-full">
                                ✓ Approved
                              </span>
                            ) : (
                              <span className="inline-block px-3 py-1 text-xs font-semibold bg-yellow-100 text-yellow-800 rounded-full">
                                ⏳ Pending Approval
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {doctor.isApproved ? (
                          <>
                            <button
                              onClick={() => rejectDoctor(doctor._id)}
                              className="flex-1 bg-gradient-to-r from-orange-600 to-red-600 text-white px-3 py-2 rounded-lg hover:from-orange-700 hover:to-red-700 transition duration-200 font-semibold text-sm shadow-md"
                            >
                              Revoke
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => approveDoctor(doctor._id)}
                              className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-3 py-2 rounded-lg hover:from-green-700 hover:to-emerald-700 transition duration-200 font-semibold text-sm shadow-md"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => rejectDoctor(doctor._id)}
                              className="flex-1 bg-gradient-to-r from-orange-600 to-red-600 text-white px-3 py-2 rounded-lg hover:from-orange-700 hover:to-red-700 transition duration-200 font-semibold text-sm shadow-md"
                            >
                              Reject
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => deleteDoctor(doctor._id)}
                          className="flex-1 bg-gradient-to-r from-red-600 to-pink-600 text-white px-3 py-2 rounded-lg hover:from-red-700 hover:to-pink-700 transition duration-200 font-semibold text-sm shadow-md"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && analytics && (
          <AnalyticsDashboard analytics={analytics} />
        )}
      </div>
    </div>
  );
};

export default AdminPanel;