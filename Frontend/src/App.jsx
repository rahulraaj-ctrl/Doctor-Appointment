import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import PatientDashboard from './components/PatientDashboard';
import DoctorDashboard from './components/DoctorDashboard';
import AdminPanel from './components/AdminPanel';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    // Simulate loading time for better UX
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (token) {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      if (storedUser) {
        setUser(storedUser);
      }
    } else {
      setUser(null);
    }
  }, [token]);

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setSidebarOpen(false);
  };

  const renderDashboard = () => {
    if (!user) return <Navigate to="/login" />;
    switch (user.role) {
      case 'patient':
        return <PatientDashboard token={token} />;
      case 'doctor':
        return <DoctorDashboard token={token} />;
      case 'admin':
        return <AdminPanel token={token} />;
      default:
        return <Navigate to="/login" />;
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'patient': return 'bg-blue-100 text-blue-800';
      case 'doctor': return 'bg-green-100 text-green-800';
      case 'admin': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'patient': return '👤';
      case 'doctor': return '👨‍⚕️';
      case 'admin': return '⚙️';
      default: return '👤';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading Doctor Appointment System...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="App min-h-screen bg-gray-50">
        {token && user && (
          <>
            {/* Desktop Navigation */}
            <nav className="bg-white shadow-lg border-b border-gray-200 hidden md:block">
              <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-sm">🏥</span>
                      </div>
                      <span className="text-xl font-bold text-gray-800">MediCare</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-3">
                      <div className={`px-3 py-1 rounded-full text-xs font-semibold ${getRoleColor(user.role)}`}>
                        <span className="mr-1">{getRoleIcon(user.role)}</span>
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </div>
                      <span className="text-gray-700 font-medium">{user.name}</span>
                    </div>
                    <button
                      onClick={logout}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition duration-200 font-medium flex items-center space-x-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              </div>
            </nav>

            {/* Mobile Navigation */}
            <nav className="bg-white shadow-lg border-b border-gray-200 md:hidden">
              <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-sm">🏥</span>
                    </div>
                    <span className="text-xl font-bold text-gray-800">MediCare</span>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className={`px-2 py-1 rounded-full text-xs font-semibold ${getRoleColor(user.role)}`}>
                      <span>{getRoleIcon(user.role)}</span>
                    </div>
                    <button
                      onClick={() => setSidebarOpen(!sidebarOpen)}
                      className="text-gray-600 hover:text-gray-800 p-2"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Mobile Sidebar */}
              {sidebarOpen && (
                <div className="fixed inset-0 z-50 md:hidden">
                  <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setSidebarOpen(false)}></div>
                  <div className="fixed right-0 top-0 h-full w-64 bg-white shadow-xl">
                    <div className="p-4 border-b border-gray-200">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-800">Menu</h3>
                        <button
                          onClick={() => setSidebarOpen(false)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="mb-4">
                        <div className="flex items-center space-x-3 mb-2">
                          <div className={`px-3 py-1 rounded-full text-xs font-semibold ${getRoleColor(user.role)}`}>
                            <span className="mr-1">{getRoleIcon(user.role)}</span>
                            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                          </div>
                        </div>
                        <p className="text-gray-700 font-medium">{user.name}</p>
                      </div>
                      <button
                        onClick={logout}
                        className="w-full bg-red-500 hover:bg-red-600 text-white px-4 py-3 rounded-lg transition duration-200 font-medium flex items-center justify-center space-x-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </nav>
          </>
        )}

        <Routes>
          <Route path="/login" element={token ? <Navigate to="/" /> : <Login setToken={setToken} />} />
          <Route path="/register" element={token ? <Navigate to="/" /> : <Register setToken={setToken} />} />
          <Route path="/" element={token ? renderDashboard() : <LandingPage />} />
        </Routes>

        {/* Footer */}
        {!token && <Footer />}
      </div>
    </Router>
  );
}

// Landing Page Component
const LandingPage = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
              Your Health, Our Priority
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Book appointments with top doctors, manage your health records, and get the care you deserve.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/register"
                className="inline-block bg-white text-blue-600 px-8 py-4 rounded-lg hover:bg-gray-100 transition duration-300 font-semibold text-lg shadow-lg transform hover:scale-105"
              >
                Get Started Free
              </a>
              <a
                href="/login"
                className="inline-block bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg hover:bg-white hover:text-blue-600 transition duration-300 font-semibold text-lg"
              >
                Sign In
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Why Choose MediCare?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experience healthcare booking like never before with our modern platform
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-xl hover:shadow-xl transition duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">📅</span>
              </div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-3">Easy Booking</h3>
              <p className="text-gray-600">
                Schedule appointments with top doctors in just a few clicks. No more waiting on hold.
              </p>
            </div>

            <div className="text-center p-6 rounded-xl hover:shadow-xl transition duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">👨‍⚕️</span>
              </div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-3">Expert Doctors</h3>
              <p className="text-gray-600">
                Connect with verified healthcare professionals across all specialties.
              </p>
            </div>

            <div className="text-center p-6 rounded-xl hover:shadow-xl transition duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">📱</span>
              </div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-3">24/7 Access</h3>
              <p className="text-gray-600">
                Manage your appointments anytime, anywhere with our mobile-friendly platform.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">500+</div>
              <div className="text-gray-600">Doctors</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-600 mb-2">10K+</div>
              <div className="text-gray-600">Patients</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-600 mb-2">50K+</div>
              <div className="text-gray-600">Appointments</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-red-600 mb-2">4.9★</div>
              <div className="text-gray-600">Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8 text-blue-100">
            Join thousands of patients who trust MediCare for their healthcare needs.
          </p>
          <a
            href="/register"
            className="inline-block bg-white text-blue-600 px-8 py-4 rounded-lg hover:bg-gray-100 transition duration-300 font-semibold text-lg shadow-lg transform hover:scale-105"
          >
            Create Your Account
          </a>
        </div>
      </section>
    </div>
  );
};

// Footer Component
const Footer = () => {
  const [activeModal, setActiveModal] = useState(null);

  const openModal = (content) => {
    setActiveModal(content);
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  const getModalContent = () => {
    switch (activeModal) {
      case 'Book Appointments':
        return {
          title: 'Book Appointments',
          content: (
            <div className="space-y-4">
              <p className="text-gray-600">
                Schedule appointments with qualified healthcare professionals easily through our platform.
              </p>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">How to Book:</h4>
                <ul className="list-disc list-inside text-blue-700 space-y-1">
                  <li>Register or login to your account</li>
                  <li>Search for doctors by specialty or location</li>
                  <li>Select your preferred date and time</li>
                  <li>Confirm your appointment</li>
                </ul>
              </div>
            </div>
          )
        };
      case 'Find Doctors':
        return {
          title: 'Find Doctors',
          content: (
            <div className="space-y-4">
              <p className="text-gray-600">
                Discover and connect with experienced doctors across various specialties in your area.
              </p>
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">Search Options:</h4>
                <ul className="list-disc list-inside text-green-700 space-y-1">
                  <li>Filter by specialty (Cardiology, Dermatology, etc.)</li>
                  <li>Search by location or hospital</li>
                  <li>View doctor profiles and ratings</li>
                  <li>Check availability and book instantly</li>
                </ul>
              </div>
            </div>
          )
        };
      case 'Health Records':
        return {
          title: 'Health Records',
          content: (
            <div className="space-y-4">
              <p className="text-gray-600">
                Securely store and manage your medical history, test results, and health information.
              </p>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-semibold text-purple-800 mb-2">Features:</h4>
                <ul className="list-disc list-inside text-purple-700 space-y-1">
                  <li>Digital storage of medical records</li>
                  <li>Share records with doctors securely</li>
                  <li>Track your health history over time</li>
                  <li>Emergency access for critical situations</li>
                </ul>
              </div>
            </div>
          )
        };
      case 'Emergency Care':
        return {
          title: 'Emergency Care',
          content: (
            <div className="space-y-4">
              <p className="text-gray-600">
                Get immediate medical attention when you need it most. Our emergency services are available 24/7.
              </p>
              <div className="bg-red-50 p-4 rounded-lg">
                <h4 className="font-semibold text-red-800 mb-2">Emergency Services:</h4>
                <ul className="list-disc list-inside text-red-700 space-y-1">
                  <li>24/7 emergency hotline</li>
                  <li>Ambulance booking</li>
                  <li>Emergency room locator</li>
                  <li>Critical care coordination</li>
                </ul>
              </div>
            </div>
          )
        };
      case 'Help Center':
        return {
          title: 'Help Center',
          content: (
            <div className="space-y-4">
              <p className="text-gray-600">
                Find answers to common questions and get help with using our platform.
              </p>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">Available Resources:</h4>
                <ul className="list-disc list-inside text-blue-700 space-y-1">
                  <li>FAQ section</li>
                  <li>Video tutorials</li>
                  <li>User guides</li>
                  <li>Live chat support</li>
                </ul>
              </div>
            </div>
          )
        };
      case 'Contact Us':
        return {
          title: 'Contact Us',
          content: (
            <div className="space-y-4">
              <p className="text-gray-600">
                Get in touch with our support team for any questions or assistance you may need.
              </p>
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">Contact Information:</h4>
                <div className="text-green-700 space-y-2">
                  <p><strong>Phone:</strong> +1 (555) 123-4567</p>
                  <p><strong>Email:</strong> support@medicare.com</p>
                  <p><strong>Address:</strong> 123 Healthcare Ave, Medical City, MC 12345</p>
                  <p><strong>Hours:</strong> Monday - Friday, 9 AM - 6 PM EST</p>
                </div>
              </div>
            </div>
          )
        };
      case 'Privacy Policy':
        return {
          title: 'Privacy Policy',
          content: (
            <div className="space-y-4">
              <p className="text-gray-600">
                Learn how we protect your personal and medical information with our comprehensive privacy policy.
              </p>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-semibold text-purple-800 mb-2">Key Points:</h4>
                <ul className="list-disc list-inside text-purple-700 space-y-1">
                  <li>HIPAA compliant data protection</li>
                  <li>Secure encryption of all medical data</li>
                  <li>Limited data sharing with healthcare providers only</li>
                  <li>Your rights to access and control your data</li>
                </ul>
              </div>
            </div>
          )
        };
      case 'Terms of Service':
        return {
          title: 'Terms of Service',
          content: (
            <div className="space-y-4">
              <p className="text-gray-600">
                Review our terms of service to understand the rules and guidelines for using our platform.
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">Terms Include:</h4>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>User responsibilities and conduct</li>
                  <li>Platform usage guidelines</li>
                  <li>Appointment booking policies</li>
                  <li>Liability and disclaimer information</li>
                </ul>
              </div>
            </div>
          )
        };
      default:
        return null;
    }
  };

  const modalData = getModalContent();

  return (
    <>
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                  <span className="text-blue-600 font-bold text-sm">🏥</span>
                </div>
                <span className="text-xl font-bold">MediCare</span>
              </div>
              <p className="text-gray-400">
                Your trusted healthcare appointment booking platform.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Services</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <button
                    onClick={() => openModal('Book Appointments')}
                    className="hover:text-white transition duration-200 cursor-pointer"
                  >
                    Book Appointments
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => openModal('Find Doctors')}
                    className="hover:text-white transition duration-200 cursor-pointer"
                  >
                    Find Doctors
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => openModal('Health Records')}
                    className="hover:text-white transition duration-200 cursor-pointer"
                  >
                    Health Records
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => openModal('Emergency Care')}
                    className="hover:text-white transition duration-200 cursor-pointer"
                  >
                    Emergency Care
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <button
                    onClick={() => openModal('Help Center')}
                    className="hover:text-white transition duration-200 cursor-pointer"
                  >
                    Help Center
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => openModal('Contact Us')}
                    className="hover:text-white transition duration-200 cursor-pointer"
                  >
                    Contact Us
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => openModal('Privacy Policy')}
                    className="hover:text-white transition duration-200 cursor-pointer"
                  >
                    Privacy Policy
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => openModal('Terms of Service')}
                    className="hover:text-white transition duration-200 cursor-pointer"
                  >
                    Terms of Service
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 MediCare. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Modal */}
      {activeModal && modalData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800">{modalData.title}</h2>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>
              {modalData.content}
              <div className="mt-6 flex justify-end">
                <button
                  onClick={closeModal}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition duration-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default App;
