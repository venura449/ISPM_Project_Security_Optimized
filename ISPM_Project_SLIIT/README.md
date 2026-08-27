# ISPM Project - HR System

# ISPM Project - HR System

A modern HR management system with authentication, built with Express.js backend and React frontend.

## Project Overview

This project implements a complete authentication system with:

- **Backend**: Node.js + Express + MySQL (Docker)
- **Frontend**: React + Vite + Tailwind CSS
- **Authentication**: JWT-based with bcrypt password hashing
- **Database**: MySQL 8.0 with user profiles

## Quick Start

### Prerequisites

- Docker & Docker Compose
- Node.js 18+ (for local development)
- MySQL 8.0 (if running without Docker)

### Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Initialize database (in Docker)
docker compose build
docker compose up

# Or for local development
npm run init-db
npm run dev
```

Backend runs on: **http://localhost:5000**

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Development server
npm run dev

# Build for production
npm run build
```

Frontend runs on: **http://localhost:5173**

## Architecture

### Backend Structure

```
backend/
├── src/
│   ├── controllers/auth/
│   │   └── AuthController.js      # HTTP request handlers
│   ├── models/auth/
│   │   └── User.js                # Database operations
│   ├── services/auth/
│   │   └── AuthService.js         # Business logic
│   ├── middlewares/
│   │   └── authMiddleware.js      # JWT verification
│   ├── routes/
│   │   ├── authRoutes.js          # Auth endpoints
│   │   └── AUTH_API.md            # API documentation
│   ├── app.js                     # Express app setup
│   └── server.js                  # Server entry point
├── config/
│   └── database.js                # MySQL connection pool
├── scripts/
│   └── init-db.sql                # Database schema
└── .env                           # Environment configuration
```

### Frontend Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── Login.jsx              # Login form
│   │   └── Register.jsx           # Registration form
│   ├── context/
│   │   └── AuthContext.jsx        # Global auth state
│   ├── hooks/
│   │   └── useAuth.js             # Auth context hook
│   ├── pages/
│   │   ├── AuthPage.jsx           # Combined auth page
│   │   └── Dashboard.jsx          # User dashboard
│   ├── App.jsx                    # Main app component
│   └── main.jsx                   # Entry point
├── index.html                     # HTML template
├── .env                           # Environment configuration
└── vite.config.js                 # Vite configuration
```

## Authentication Flow

### Registration

1. User fills name, email, password, confirm password
2. Frontend validates inputs
3. POST to `/api/auth/register`
4. Backend hashes password with bcryptjs (10 salt rounds)
5. User created in database
6. JWT token returned
7. Token stored in localStorage
8. User redirected to dashboard

### Login

1. User enters email and password
2. Frontend validates inputs
3. POST to `/api/auth/login`
4. Backend verifies password hash
5. JWT token returned
6. Token stored in localStorage
7. User redirected to dashboard

### Protected Routes

1. Dashboard checks if token exists
2. On app load, token is verified via `/api/auth/verify`
3. If valid, user data restored from token
4. If invalid/expired, user redirected to login

## API Endpoints

### Public Endpoints

```
POST   /api/auth/register              # Create account
POST   /api/auth/login                 # Sign in
POST   /api/auth/verify                # Verify token
```

### Protected Endpoints (require JWT token)

```
GET    /api/auth/profile               # Get user profile
PUT    /api/auth/profile               # Update profile
PUT    /api/auth/change-password       # Change password
POST   /api/auth/logout                # Logout
```

See [backend/src/routes/AUTH_API.md](backend/src/routes/AUTH_API.md) for detailed API documentation.

## Database Schema

### Users Table

```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  address VARCHAR(255),
  profile_picture VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## Environment Variables

### Backend (.env)

```
# Database
DB_HOST=db                    # 'db' for Docker, 'localhost' for local
DB_USER=root
DB_PASSWORD=ISPM_secure_password_2024
DB_NAME=ISPM_db
DB_PORT=3306

# Server
PORT=5000
NODE_ENV=development

# JWT
JWT_SECRET=your_jwt_secret_key_change_in_production
JWT_EXPIRY=7d
```

### Frontend (.env)

```
VITE_API_URL=http://localhost:5000/api
```

## Security Features

### Password Security

- Hashed with bcryptjs (10 salt rounds)
- Never stored in plain text
- Minimum 6 characters required
- Change password validation

### Token Security

- JWT with HS256 algorithm
- 7-day expiration (configurable)
- Token verification middleware
- Secure localStorage storage

### Database Security

- Connection pooling
- Prepared statements (prevents SQL injection)
- Unique email constraint
- Indexed email column

### Data Validation

- Email format validation
- Required field checks
- Password confirmation matching
- Input sanitization

## Development

### Running with Docker

```bash
cd backend
docker compose build
docker compose up
```

Services:

- Backend API: http://localhost:5000
- MySQL Database: localhost:3306

### Running Locally

**Backend:**

```bash
cd backend
npm install
npm run init-db
npm run dev
```

**Frontend:**

```bash
cd frontend
npm install
npm run dev
```

## Testing the API

### Register

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Get Profile (Protected)

```bash
curl -X GET http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Technologies Used

### Backend

- **Express.js** - Web framework
- **MySQL2** - Database driver
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT tokens
- **dotenv** - Environment configuration
- **CORS** - Cross-origin requests
- **Nodemon** - Development auto-reload

### Frontend

- **React 19** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Font Awesome** - Icons
- **React Context API** - State management

### DevOps

- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration

## Project Roadmap

- [x] Backend authentication system
- [x] Frontend login/register forms
- [x] JWT token management
- [x] Password hashing with bcryptjs
- [x] User profile management
- [ ] Email verification
- [ ] Password reset functionality
- [ ] Two-factor authentication
- [ ] Role-based access control
- [ ] User management dashboard
- [ ] Audit logging

## Documentation

- [Backend Setup](backend/AUTHENTICATION_SETUP.md)
- [Backend API](backend/src/routes/AUTH_API.md)
- [Frontend Setup](frontend/FRONTEND_SETUP.md)

## License

ISC

## Contributing

1. Create a feature branch
2. Commit your changes
3. Push to the branch
4. Create a Pull Request
