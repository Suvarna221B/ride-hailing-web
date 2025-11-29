# 🚗 Ride Hailing Platform - Frontend

A modern, responsive React frontend for the Ride Hailing Platform, featuring real-time ride tracking, driver allocation, and payment processing.

## 📋 Table of Contents

- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [API Integration](#api-integration)
- [Testing](#testing)
- [Deployment](#deployment)


## 🛠 Tech Stack

| Component | Technology | Version |
|-----------|-----------|---------|
| **Framework** | React | 19.x |
| **Build Tool** | Vite | 7.x |
| **Language** | JavaScript (JSX) | ES6+ |
| **Styling** | Tailwind CSS | 4.x |
| **State Management** | React Query | 5.x |
| **HTTP Client** | Axios | 1.x |
| **Routing** | React Router | 7.x |
| **Icons** | Lucide React | Latest |
| **Testing** | Vitest + React Testing Library | Latest |

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Backend API running at `http://localhost:8081`

### 1. Clone the Repository

```bash
git clone https://github.com/Suvarna221B/ride-hailing-frontend.git
cd ride-hailing-frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure API Endpoint

The API base URL is configured in `src/api/client.js`:

```javascript
const API_URL = 'http://localhost:8081/api';
```

Update this if your backend is running on a different URL.

### 4. Start Development Server

```bash
npm run dev
```

The application will be available at **http://localhost:5173**

### 5. Create Test Users

Before logging in, create users via the backend API:

```bash
# Create a rider
curl -X POST http://localhost:8081/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "rider1",
    "password": "password123",
    "role": "RIDER"
  }'

# Create a driver
curl -X POST http://localhost:8081/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "driver1",
    "password": "password123",
    "role": "DRIVER"
  }'
```

### 6. Login and Test

1. Open http://localhost:5173
2. Select role (RIDER or DRIVER)
3. Enter credentials:
   - Username: `rider1` or `driver1`
   - Password: `password123`
4. Test the ride flow!

## 📁 Project Structure

```
src/
├── api/                    # API integration
│   ├── client.js          # Axios instance with interceptors
│   ├── authService.js     # Authentication API calls
│   ├── rideService.js     # Ride-related API calls
│   └── driverService.js   # Driver-related API calls
│
├── components/            # React components
│   ├── DriverDashboard.jsx
│   ├── RiderDashboard.jsx
│   ├── DriverDashboard.test.jsx
│   └── RiderDashboard.test.jsx
│
├── context/              # React Context
│   └── AuthContext.jsx   # Authentication state management
│
├── pages/                # Page components
│   └── Login.jsx         # Login page
│
├── test/                 # Test configuration
│   └── setup.js          # Vitest setup
│
├── App.jsx               # Main app component with routing
├── main.jsx              # Application entry point
└── index.css             # Global styles (Tailwind)
```

## 🔌 API Integration

### Authentication Flow

```javascript
// Login
const { login } = useAuth();
await login(username, password, role);

// Logout
const { logout } = useAuth();
logout();

// Check authentication
const { isAuthenticated, user } = useAuth();
```

### Ride Management

```javascript
// Request a ride (Rider)
const mutation = useMutation({
  mutationFn: () => rideService.requestRide(pickup, destination)
});

// Poll for ride status (Rider)
const { data: ride } = useQuery({
  queryKey: ['ride', rideId],
  queryFn: () => rideService.getRide(rideId),
  refetchInterval: 3000 // Poll every 3 seconds
});

// Update ride status (Driver)
await rideService.updateRideStatus(rideId, driverId, 'ACCEPT');
```

### Real-time Polling

The app uses React Query's `refetchInterval` to poll for updates:

```javascript
const { data: ride } = useQuery({
  queryKey: ['ride', activeRideId],
  queryFn: () => rideService.getRide(activeRideId),
  enabled: !!activeRideId,
  refetchInterval: (data) => {
    // Stop polling when ride is completed
    if (data?.status === 'COMPLETED') return false;
    return 3000; // Poll every 3 seconds
  },
});
```

## 🧪 Testing

### Run All Tests

```bash
npm test
```

### Run Tests in Watch Mode

```bash
npm test -- --watch
```

### Run Tests with Coverage

```bash
npm test -- --coverage
```

### Test Files

- `DriverDashboard.test.jsx`: Driver dashboard component tests
- `RiderDashboard.test.jsx`: Rider dashboard component tests

### Testing Stack

- **Vitest**: Fast unit test framework
- **React Testing Library**: Component testing utilities
- **@testing-library/jest-dom**: Custom matchers

## 🎨 Styling

### Tailwind CSS

The app uses Tailwind CSS v4 with the PostCSS plugin:

```javascript
// tailwind.config.js
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

### Design System

- **Colors**: Black primary, blue accents, status-based colors
- **Typography**: System fonts with responsive sizing
- **Components**: Rounded corners, shadows, smooth transitions
- **Layout**: Flexbox and Grid for responsive design

## 📦 Build and Deployment

### Build for Production

```bash
npm run build
```

Output will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

### Deploy to Vercel/Netlify

1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Add environment variable: `VITE_API_URL=your-backend-url`

### Environment Variables

Create `.env` file for environment-specific configuration:

```env
VITE_API_URL=http://localhost:8081/api
```

Update `src/api/client.js` to use:

```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081/api';
```

## 🔒 Security

- **JWT Storage**: Tokens stored in localStorage
- **Automatic Token Injection**: Axios interceptor adds token to requests
- **401 Handling**: Automatic logout on authentication failure
- **Protected Routes**: Role-based route protection
- **CORS**: Backend must allow frontend origin

## 🐛 Troubleshooting

### Common Issues

**1. "Network Error" when calling API**
- Ensure backend is running on port 8081
- Check CORS configuration in backend
- Verify API_URL in `src/api/client.js`

**2. "401 Unauthorized"**
- Token may be expired - try logging in again
- Check if user exists in backend database

**3. Tailwind styles not working**
- Ensure `@tailwindcss/postcss` is installed
- Check `postcss.config.js` configuration
- Restart dev server

**4. Polling not working**
- Check browser console for errors
- Verify `GET /api/rides/{id}` endpoint exists in backend
- Check React Query DevTools

## 📝 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm test` | Run tests |
| `npm run lint` | Run ESLint |

## 🔗 Related Links

- **Backend Repository**: [ride-hailing-service](https://github.com/Suvarna221B/ride-hailing-service)
- **API Documentation**: See backend README

