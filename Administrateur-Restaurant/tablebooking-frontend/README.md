# Restaurant Admin Dashboard - React Frontend

A production-ready React Vite frontend for managing restaurants with authentication using Laravel Sanctum.

## Features

- ✅ User Authentication (Login & Register)
- ✅ Sanctum Token-based Authorization
- ✅ Protected Routes with Role-Based Access Control
- ✅ Global Authentication State with Context API
- ✅ Restaurant CRUD Operations
- ✅ Admin Dashboard with Table Display
- ✅ Automatic API Error Handling (401 redirect)
- ✅ Responsive Design
- ✅ Clean & Production-Ready Code

## Project Structure

```
src/
├── components/              # Reusable components
│   ├── ProtectedRoute.jsx  # Route protection wrapper
│   ├── RestaurantModal.jsx # Add/Edit restaurant modal
│   └── RestaurantModal.css
├── context/                 # Global state management
│   └── AuthContext.jsx      # Authentication context
├── pages/                   # Page components
│   ├── Login.jsx           # Login page
│   ├── Register.jsx        # Registration page
│   ├── Dashboard.jsx       # Admin dashboard
│   ├── Auth.css            # Auth pages styles
│   └── Dashboard.css       # Dashboard styles
├── services/               # API integration
│   └── api.js             # Axios configuration & API calls
├── App.jsx                # Main app with routing
├── App.css                # Global styles
├── main.jsx               # Entry point
└── index.css              # Base styles
```

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn

## Installation

1. **Clone the repository**
   ```bash
   cd tablebooking-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create .env file** (or copy from .env.example)
   ```bash
   cp .env.example .env
   ```

4. **Configure API URL** in `.env`
   ```
   VITE_API_URL=http://127.0.0.1:8000/api
   ```

## Development

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Build for Production

Build the project:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## API Integration

### Axios Configuration

The Axios instance is configured in `src/services/api.js` with:

- **Base URL**: Configurable via `VITE_API_URL` environment variable
- **Request Interceptor**: Automatically attaches Bearer token from localStorage
- **Response Interceptor**: Handles 401 errors by clearing token and redirecting to login

### Available API Methods

#### Authentication
- `authAPI.register(data)` - Register new user
- `authAPI.login(data)` - Login user
- `authAPI.logout()` - Logout user
- `authAPI.getUser()` - Get current user

#### Restaurants (Protected)
- `restaurantsAPI.getAll()` - Get all restaurants
- `restaurantsAPI.getById(id)` - Get restaurant by ID
- `restaurantsAPI.create(data)` - Create restaurant (admin only)
- `restaurantsAPI.update(id, data)` - Update restaurant (admin only)
- `restaurantsAPI.delete(id)` - Delete restaurant (admin only)

## Authentication Flow

1. **User Registration/Login**
   - Submit credentials to API
   - Receive Sanctum token
   - Store token in localStorage
   - User object stored in localStorage

2. **Authenticated Requests**
   - Token automatically attached to all requests via axios interceptor
   - Header: `Authorization: Bearer {token}`

3. **Token Refresh**
   - Token persists across page refreshes (stored in localStorage)
   - User data reloaded on app mount if token exists

4. **Logout**
   - API logout call (optional but recommended)
   - Clear token and user from localStorage
   - Redirect to login

## Protected Routes

Routes requiring authentication are wrapped with `ProtectedRoute` component:

```jsx
<Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  }
/>
```

## Role-Based Access

Admin features (Create, Edit, Delete restaurants) are conditionally rendered based on user role:

```jsx
{isAdmin && (
  <button onClick={handleAddClick}>+ Add Restaurant</button>
)}
```

Available roles:
- `client` - View only
- `admin` - Full CRUD operations
- `super_admin` - Full CRUD + additional permissions

## State Management

### Authentication Context

The `AuthContext` provides:

- `user` - Current user object
- `token` - Sanctum token
- `loading` - Initial auth state loading
- `error` - Error messages
- `isAuthenticated` - Boolean flag
- `isAdmin` - Boolean flag for admin role
- `register()` - Register function
- `login()` - Login function
- `logout()` - Logout function
- `setError()` - Set error message

Usage:

```jsx
import { useAuth } from '../context/AuthContext';

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth();
  
  // Use auth state...
}
```

## Error Handling

- **401 Unauthorized**: Automatically redirects to login
- **Network Errors**: Displayed in alert messages
- **Validation Errors**: Shown in form or modal
- **API Errors**: Show server error message or generic message

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_URL` | `http://127.0.0.1:8000/api` | Backend API base URL |

## Security Considerations

1. **Token Storage**
   - Currently using localStorage (suitable for SPAs)
   - Consider httpOnly cookies for enhanced security in production
   - Implement token refresh mechanism for long-lived sessions

2. **CORS**
   - Ensure backend CORS is properly configured
   - Allow frontend domain in `config/cors.php`

3. **API Security**
   - All protected endpoints verify token server-side
   - Implement rate limiting
   - Use HTTPS in production

## Components Overview

### ProtectedRoute
Wraps components that require authentication. Shows loading state while checking auth status.

### RestaurantModal
Modal for creating/editing restaurants. Features:
- Form validation
- Loading states
- Error handling
- Close on success

### Login Page
User login with email/password. Links to registration.

### Register Page
User registration with password confirmation. Links to login.

### Dashboard
Main admin interface with:
- Restaurant table display
- Create/Edit/Delete operations (admin only)
- Loading & error states
- Success messages
- User info & logout button

## Best Practices Implemented

✅ Modern React Hooks (useState, useEffect, useContext, useCallback)
✅ React Router v6 with nested routes
✅ Axios interceptors for global error handling
✅ Context API for state management
✅ Environment variables for configuration
✅ Responsive CSS with mobile support
✅ Proper error handling and user feedback
✅ Loading states for better UX
✅ Separation of concerns (components, services, pages)
✅ Clean, readable code with comments

## Troubleshooting

### CORS Errors
- Check Laravel backend CORS configuration
- Ensure frontend URL is allowed in `config/cors.php`

### 401 Unauthorized
- Verify token is being sent in Authorization header
- Check token hasn't expired
- Ensure backend is validating token correctly

### API Not Responding
- Verify backend server is running
- Check `VITE_API_URL` configuration
- Check network tab in browser DevTools

### Blank Page After Login
- Check console for JavaScript errors
- Verify ProtectedRoute is working correctly
- Check localStorage for token

## Performance Tips

1. Code splitting - Implemented via React Router lazy loading
2. Image optimization - Use optimized image formats
3. Bundle analysis - Run `npm run build` and check bundle size
4. Caching - Axios requests are cached by browser
5. Lazy loading - Consider lazy loading restaurants table

## Deployment

### Vercel
```bash
npm install -g vercel
vercel
```

### Netlify
```bash
npm run build
# Deploy dist/ folder
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build
EXPOSE 4173
CMD ["npm", "run", "preview"]
```

## Contributing

1. Create a feature branch
2. Commit your changes
3. Push to the branch
4. Create a Pull Request

## License

MIT License - feel free to use this project

## Support

For issues and questions, please create an issue in the repository.
