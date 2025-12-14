# API Configuration Fix - Production & Development Support

## Problem
When deploying to production on Render, the frontend was still trying to connect to `localhost:5000`, causing network errors:
```
ERR_NETWORK: Failed to load resource: net::ERR_CONNECTION_REFUSED
```

## Solution
Implemented dynamic API URL configuration that automatically switches between:
- **Production**: `https://doctor-appointment-oc3s.onrender.com` (from `.env.production`)
- **Development**: `http://localhost:5000` (default fallback)

## Files Created

### 1. `Frontend/src/config.js`
Central configuration file that reads the API URL from environment variables:
```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
export default API_URL;
```

### 2. `Frontend/.env.production`
Production environment variables:
```
VITE_API_URL=https://doctor-appointment-oc3s.onrender.com
```

## Files Updated
All frontend components now import and use the `API_URL` config:

1. **Login.jsx** - Authentication endpoints
2. **Register.jsx** - User registration
3. **PatientDashboard.jsx** - Appointment booking and viewing
4. **DoctorDashboard.jsx** - Doctor appointments management
5. **AdminPanel.jsx** - Admin operations (doctors, analytics)

## Changes Made

### Before (Hardcoded localhost):
```javascript
const res = await axios.post('http://localhost:5000/api/auth/login', {
  email, password
});
```

### After (Dynamic configuration):
```javascript
import API_URL from '../config';

const res = await axios.post(`${API_URL}/api/auth/login`, {
  email, password
});
```

## How It Works

1. **Development (localhost)**:
   - No `.env` file needed
   - Falls back to `http://localhost:5000`
   - Run `npm run dev` to start dev server

2. **Production (Render)**:
   - Build command: `npm run build`
   - `.env.production` is automatically used during build
   - API URL becomes `https://doctor-appointment-oc3s.onrender.com`
   - All API calls use production URL

## Deployment Steps

1. Push changes to GitHub
2. Render automatically detects build changes
3. Rebuild happens with `.env.production` loaded
4. Frontend connects to production API
5. Admin login now works! ✅

## Testing

### Local Development:
```bash
cd Frontend
npm install
npm run dev
# Access at http://localhost:5173
# API calls go to http://localhost:5000
```

### Production:
- Visit `https://doctor-appointment-service.onrender.com`
- All API calls go to `https://doctor-appointment-oc3s.onrender.com`
- Admin login should now work

## API Endpoints Updated
All 15+ API endpoints across 5 components now use dynamic configuration:
- Authentication (Login, Register)
- Appointments (Book, View, Update Status, Review)
- Admin (Manage Doctors, Analytics)
- Doctor (View Appointments, Update Status)

## Benefits
✅ Single codebase works for both development and production  
✅ No need to manually change URLs before deployment  
✅ Environment-specific configuration  
✅ Easy to add more environment configurations (staging, etc.)  
✅ Secure - production URL in version-controlled `.env.production`  

## Future Enhancements
- Add `.env.development` for explicit dev configuration
- Add `.env.staging` for staging environment
- Use different API URLs for different regions
