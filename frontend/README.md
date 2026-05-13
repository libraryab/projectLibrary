# Library Management System - Frontend

React + Vite + Tailwind CSS + React Router

## Project Structure

```
frontend/
├── src/
│   ├── components/        # Reusable components
│   │   └── ProtectedRoute.jsx    # Route protection wrapper
│   ├── pages/             # Page components
│   │   ├── LoginPage.jsx         # Login form
│   │   ├── RegisterPage.jsx      # Register form with role selection
│   │   └── DashboardPage.jsx     # Dashboard (placeholder)
│   ├── layouts/           # Layout components
│   │   └── MainLayout.jsx        # Main app layout with logout button
│   ├── hooks/             # Custom hooks
│   │   └── useAuth.js            # Auth context hook
│   ├── context/           # React context
│   │   └── AuthContext.jsx       # Auth state management
│   ├── services/          # API services
│   │   └── authService.js        # Auth API calls + interceptors
│   ├── utils/             # Utility functions
│   │   └── tokenUtils.js         # Token storage/retrieval
│   ├── styles/            # Global styles
│   │   └── index.css             # Tailwind directives
│   ├── App.jsx            # Main app component with routing
│   └── main.jsx           # Entry point
├── public/                # Static assets
├── index.html             # HTML entry point
├── vite.config.js         # Vite configuration with API proxy
├── tailwind.config.js     # Tailwind configuration
└── postcss.config.js      # PostCSS configuration
```

## Features Implemented

### ✅ Authentication System
- **Login Form**: Email/password authentication
- **Register Form**: New user registration with role selection
  - Member role for library patrons
  - Staff role with type selection (Admin/Librarian)
- **Protected Routes**: Automatic redirect to login for unauthenticated users
- **Token Management**: JWT tokens stored in localStorage
- **Auto Logout**: Automatic logout on 401 unauthorized responses
- **Auth Context**: Global auth state with `useAuth()` hook

### ✅ API Integration
- **Axios Client**: Configured with base URL pointing to backend `/api/v1`
- **Request Interceptors**: Automatically attach JWT token to requests
- **Response Interceptors**: Handle 401 errors and auto-logout
- **Vite Proxy**: API requests proxied to `http://localhost:3000`

### ✅ UI/UX Features
- **Responsive Design**: Mobile-friendly layouts with Tailwind CSS
- **Form Validation**: 
  - Email validation
  - Password confirmation
  - Minimum password length (6 chars)
  - Required role selection for staff
- **Error Handling**: User-friendly error messages from API
- **Loading States**: Button disabling during API calls
- **Navigation**: React Router v6 for client-side routing

## Setup Instructions

1. Install dependencies:
```bash
npm install
```

2. Create .env file from .env.example:
```bash
cp .env.example .env
```

3. Start both backend and frontend servers:

**Backend (in projectLibrary root):**
```bash
npm run dev
```

**Frontend (in frontend directory):**
```bash
npm run dev
```

4. Open frontend at: `http://localhost:5173` (or next available port)

5. Build for production:
```bash
npm run build
```

## Authentication Flow

1. **Register**: User creates account with name, email, password, and role
2. **Login**: User enters email and password
3. **Token Stored**: JWT token saved to localStorage
4. **Redirect**: User redirected to `/dashboard`
5. **Protected**: Dashboard only accessible with valid token
6. **Logout**: Token removed from localStorage and redirected to login

## API Endpoints Used

- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - User login
- `GET /api/v1/auth/me` - Get current user (with auth middleware)

## Development

The dev server runs on `http://localhost:5173` (or next available port) and proxies API calls to `http://localhost:3000`.

### Environment Variables
```env
VITE_API_BASE_URL=http://localhost:3000/api/v1
```

## Tech Stack

- **React 18** - UI library with hooks
- **Vite 5** - Fast build tool and dev server
- **Tailwind CSS 3** - Utility-first CSS framework
- **React Router 6** - Client-side routing
- **Axios** - HTTP client with interceptors
- **PostCSS** - CSS processing with Tailwind
