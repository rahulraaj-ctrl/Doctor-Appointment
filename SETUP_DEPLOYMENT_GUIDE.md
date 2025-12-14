# Doctor Appointment System - Complete Setup & Deployment Guide

## Project Structure Overview

```
Doctor-Appointment/
├── Backend/
│   ├── Index.js                 # Main server file
│   ├── package.json             # Dependencies
│   ├── .env                      # Environment variables
│   ├── middleware/
│   │   └── auth.js              # JWT authentication middleware
│   ├── models/
│   │   ├── User.js              # User schema (Patient/Doctor/Admin)
│   │   └── Appointment.js       # Appointment schema
│   └── routes/
│       ├── auth.js              # Login/Register endpoints
│       ├── appointments.js      # Appointment management
│       └── admin.js             # Admin operations
│
├── Frontend/
│   ├── package.json             # Dependencies
│   ├── vite.config.js           # Vite configuration
│   ├── tailwind.config.js       # Tailwind CSS config
│   ├── .env.production          # Production API URL
│   ├── index.html               # Main HTML file
│   └── src/
│       ├── main.jsx             # Entry point
│       ├── App.jsx              # Main component
│       ├── config.js            # API configuration
│       ├── index.css            # Global styles
│       └── components/
│           ├── Login.jsx        # Login page
│           ├── Register.jsx     # Registration page
│           ├── PatientDashboard.jsx
│           ├── DoctorDashboard.jsx
│           └── AdminPanel.jsx
│
└── Documentation/
    ├── VIVA_EXPLANATION.md      # Complete system explanation
    ├── VIVA_QA.md              # Question & Answer guide
    ├── VIVA_FLOWCHARTS.md      # Diagrams and flowcharts
    └── API_CONFIGURATION_FIX.md # API configuration guide
```

---

## Local Development Setup

### Prerequisites
- Node.js v14+ and npm/yarn
- MongoDB Atlas account (or local MongoDB)
- VS Code or any code editor
- Git installed

### Backend Setup

#### 1. Navigate to Backend
```bash
cd Backend
npm install
```

#### 2. Create `.env` file
```env
# Database Connection
MONGODB_URI=mongodb+srv://username:password@cluster0.9eqpv70.mongodb.net/doctor-appointment

# JWT Secret (use any random string)
JWT_SECRET=your_secret_key_here_change_this_in_production

# Port
PORT=5000

# Node Environment
NODE_ENV=development
```

#### 3. Get MongoDB Connection String
1. Go to https://www.mongodb.com/cloud/atlas
2. Create/login to your account
3. Create a cluster (Free tier available)
4. Click "Connect" → "Drivers"
5. Copy connection string
6. Replace `<username>` and `<password>` with your credentials
7. Paste into `.env`

#### 4. Start Backend Server
```bash
npm run dev
```

**Expected output:**
```
Server running on http://localhost:5000
Connected to MongoDB
```

### Frontend Setup

#### 1. Navigate to Frontend
```bash
cd Frontend
npm install
```

#### 2. Create `.env.development` (optional, for local dev)
```env
VITE_API_URL=http://localhost:5000
```

#### 3. Start Frontend Server
```bash
npm run dev
```

**Expected output:**
```
Local:   http://localhost:5173/
```

#### 4. Access Application
- Open browser: http://localhost:5173
- Login with test credentials (after registration)

---

## Testing the System Locally

### Test Scenario 1: Patient Registration & Login
```
1. Click "Sign Up"
2. Fill form:
   - Name: John Patient
   - Email: patient@test.com
   - Password: Test123!
   - Role: Patient
3. Click "Register"
4. Redirected to login page
5. Enter credentials → Login
6. Should see PatientDashboard
```

### Test Scenario 2: Doctor Registration (Requires Approval)
```
1. Click "Sign Up"
2. Fill form:
   - Name: Dr. Smith
   - Email: doctor@test.com
   - Password: Test123!
   - Role: Doctor
   - Specialization: Cardiology
3. Click "Register"
4. Try to login with doctor account
5. Should see "Account Pending Approval" message
6. Cannot approve appointments yet ✓ Correct behavior
```

### Test Scenario 3: Admin Setup
```
Method 1: Direct Database Insert
1. Open MongoDB Atlas → Collections
2. Insert into Users collection:
{
  "name": "Admin User",
  "email": "admin@test.com",
  "password": "hashed_password_here",
  "role": "admin",
  "isApproved": true
}

Method 2: Using API (via Postman/Thunder Client)
1. POST /api/auth/register
2. Body: {
     "name": "Admin User",
     "email": "admin@test.com",
     "password": "Test123!",
     "role": "admin"
   }
3. Gets token and logged in
```

### Test Scenario 4: Doctor Approval Workflow
```
1. Login as Admin
2. Go to Admin Panel → Manage Doctors tab
3. See Dr. Smith with "⏳ Pending Approval" badge
4. Click "Approve"
5. Status changes to "✓ Approved"
6. Dr. Smith can now approve appointments ✓
```

### Test Scenario 5: Book Appointment
```
1. Login as Patient (John)
2. Go to PatientDashboard
3. Fill booking form:
   - Doctor: Dr. Smith (Cardiology)
   - Date: Tomorrow (12/11/2025)
   - Time: 2:30 PM (14:30 in form)
   - Reason: General checkup
4. Click "Book"
5. Success message shown ✓
6. Appointment appears in timeline with "⏳ Pending" status
```

### Test Scenario 6: Doctor Approves Appointment
```
1. Login as Dr. Smith
2. Go to DoctorDashboard
3. See John's appointment request
4. Click "Approve"
5. Status changes to "✅ Approved" ✓
6. Patient's timeline updates (after refresh)
```

### Test Scenario 7: Error Handling - Unapproved Doctor
```
1. Create new doctor account (Bob)
2. Don't approve yet
3. Try to approve an appointment manually via API:
   PUT /api/appointments/:id/status
   { status: "approved" }
4. Should get 403 Forbidden ✓
   "Your account is not yet approved by admin"
```

---

## Production Deployment (Render)

### Prepare for Deployment

#### 1. Backend Deployment (Render)

**Connect GitHub Repository:**
1. Push code to GitHub: `git push origin main`
2. Go to https://render.com
3. Create new Web Service
4. Connect GitHub repository
5. Select `Doctor-Appointment` repo

**Configure Backend Service:**
- Name: `doctor-appointment-oc3s`
- Root Directory: `Backend`
- Build Command: `npm install`
- Start Command: `npm start`

**Add Environment Variables:**
```
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your_production_secret
NODE_ENV=production
PORT=5000
```

**Deploy:**
- Click Deploy
- Wait for build to complete
- Get URL: `https://doctor-appointment-oc3s.onrender.com`

#### 2. Frontend Deployment (Render)

**Create New Static Site:**
1. New → Static Site
2. Connect to same GitHub repo
3. Select `Doctor-Appointment` repo

**Configure Frontend:**
- Name: `doctor-appointment-service`
- Root Directory: `Frontend`
- Build Command: `npm run build`
- Publish Directory: `Frontend/dist`

**Environment:**
- The `.env.production` file automatically loads with:
  ```
  VITE_API_URL=https://doctor-appointment-oc3s.onrender.com
  ```

**Deploy:**
- Click Deploy
- Wait for build complete
- Get URL: `https://doctor-appointment-service.onrender.com`

### Verify Production Deployment

1. Visit frontend: https://doctor-appointment-service.onrender.com
2. Try to login as admin
3. Should now work ✓ (no more localhost error)
4. All API calls go to: https://doctor-appointment-oc3s.onrender.com

### Production Database

**MongoDB Atlas Setup:**
1. Keep same MongoDB Atlas cluster
2. Connection string in backend `.env`:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster0.9eqpv70.mongodb.net/doctor-appointment
   ```
3. Render backend automatically connects

---

## Troubleshooting

### Issue 1: Backend won't start
```
Error: Cannot connect to MongoDB

Solution:
1. Check MONGODB_URI in .env is correct
2. Check credentials are right
3. Check IP whitelist in MongoDB Atlas:
   - Go to Network Access
   - Add 0.0.0.0/0 to allow all IPs
4. Ensure DB name exists in cluster
```

### Issue 2: Frontend shows "Network Error" on login
```
Solution:
1. Check backend is running (localhost:5000 shows response)
2. Check .env.production has correct backend URL
3. Rebuild frontend: npm run build
4. Check API_URL config.js is being used
5. Verify JWT token is being sent in requests
```

### Issue 3: Time showing 24-hour format instead of 12-hour
```
Solution:
1. Check convertTo12Hour() function is called
2. Ensure time data from API is string format "HH:MM"
3. Frontend should convert before display
4. If still wrong, check browser console for errors
```

### Issue 4: Doctor approval not working
```
Solution:
1. Check doctor.isApproved value in MongoDB
2. Verify PUT endpoint includes isApproved check
3. Ensure JWT token includes isApproved
4. Check browser console for error messages
5. Verify admin has admin role
```

### Issue 5: Cascade delete not working
```
Solution:
1. Check DELETE endpoint in admin.js
2. Ensure both User.deleteOne and Appointment.deleteMany are called
3. Verify appointments deleted from database
4. Check browser console for errors
5. Refresh page to see updated list
```

---

## Performance Optimization Tips

### Frontend
```javascript
// 1. Lazy load components
const PatientDashboard = React.lazy(() => 
  import('./components/PatientDashboard')
);

// 2. Use React.memo for expensive components
const AppointmentCard = React.memo(({ appointment }) => {
  return <div>...</div>;
});

// 3. Implement caching with localStorage
const cachedDoctors = localStorage.getItem('doctors');

// 4. Use useCallback for expensive functions
const memoizedFunction = useCallback(() => {
  // expensive operation
}, [dependencies]);
```

### Backend
```javascript
// 1. Add database indexes
db.collection('users').createIndex({ email: 1 });
db.collection('appointments').createIndex({ doctorId: 1 });

// 2. Implement API response caching
app.use(cache('5 minutes'));

// 3. Use pagination for large datasets
app.get('/api/appointments?page=1&limit=10');

// 4. Compress responses
app.use(compression());
```

---

## Security Checklist

- [ ] Change JWT_SECRET to production value
- [ ] Enable HTTPS on all endpoints (Render does automatically)
- [ ] Set MongoDB IP whitelist
- [ ] Use environment variables for all secrets
- [ ] Add rate limiting to prevent brute force
- [ ] Enable CORS only for frontend domain
- [ ] Implement input sanitization
- [ ] Add request logging for monitoring
- [ ] Regular database backups
- [ ] Monitor for suspicious activities

---

## Monitoring & Maintenance

### Database Monitoring
```
1. MongoDB Atlas Dashboard
   - Check cluster health
   - Monitor database size
   - Review performance metrics
   - Set up alerts

2. Backup Strategy
   - Enable daily backups
   - Test restore procedure monthly
```

### Application Monitoring
```
1. Render Dashboard
   - Check build logs
   - Monitor error rates
   - Check uptime status

2. Error Tracking (optional)
   - Integrate Sentry for error tracking
   - Get alerts for critical errors
```

### Regular Maintenance
```
1. Weekly
   - Review error logs
   - Check database size

2. Monthly
   - Test backup/restore
   - Review security
   - Update dependencies

3. Quarterly
   - Full security audit
   - Performance optimization review
```

---

## Common Viva Questions About Deployment

### Q: How do you ensure your app runs everywhere?
**A:** We use environment variables. In development, `.env` has `localhost:5000`. In production, `.env.production` has the Render backend URL. The app reads the correct URL based on the environment.

### Q: What happens if backend goes down?
**A:** Frontend shows network error. In production, we could:
1. Add error boundary component
2. Show "Service unavailable" message
3. Implement retry logic
4. Use fallback data from cache

### Q: How do you handle sensitive data in production?
**A:** 
- All secrets (passwords, JWT keys) in environment variables
- Never commit `.env` to git
- Use Render's secure env var management
- Passwords hashed with bcryptjs

### Q: How would you scale to more users?
**A:**
- Load balancer for multiple backend instances
- Database replication with MongoDB Replica Sets
- CDN for frontend static files
- Implement caching layer (Redis)
- Database query optimization

---

## Final Checklist Before Viva

- [ ] Local setup works (Backend + Frontend)
- [ ] Can register as patient/doctor/admin
- [ ] Doctor approval workflow works
- [ ] Can book appointment and see timeline
- [ ] Time format shows 12-hour with AM/PM
- [ ] Admin panel shows analytics
- [ ] Delete doctor cascades to appointments
- [ ] API configuration uses right URL for environment
- [ ] Production deployment working
- [ ] Can explain all components
- [ ] Have database credentials ready to show
- [ ] Can show code in VS Code
- [ ] Can demonstrate live app
- [ ] Have prepared answers to Q&A
- [ ] Understand all error handling

---

## Quick Reference Commands

```bash
# Backend
npm install              # Install dependencies
npm run dev             # Start development server
npm start               # Start production server

# Frontend
npm install
npm run dev             # Start dev server on localhost:5173
npm run build           # Create production build
npm run preview         # Preview production build

# Git
git add .
git commit -m "message"
git push origin main    # Deploy to Render (automatically)

# Database
# MongoDB operations via MongoDB Atlas UI
# No command line needed for this project
```

---

Good luck with your viva presentation! 🎓

Remember to:
1. Explain the problem your system solves
2. Walk through the architecture
3. Demonstrate the working application
4. Discuss challenges and solutions
5. Show willingness to improve the system
6. Answer confidently using this guide

You've built an impressive full-stack system! 🚀
