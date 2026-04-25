"# Library Management System - Backend API

A modern Node.js/Express backend for a university library management system with authentication, book management, member profiles, loans, and reservations.

## Features

✅ **Authentication System**
- JWT-based authentication with bcrypt password hashing
- User registration and login
- Protected routes with middleware
- 24-hour token expiration

✅ **REST API** (15+ endpoints)
- Authentication (register, login, profile)
- Library management
- Book catalog with authors
- Member profiles
- Loan tracking
- Book reservations

✅ **Data Storage**
- In-memory storage (development)
- Arrays for users, books, members, loans, reservations
- Data persists for session duration
- Perfect for prototyping and testing

✅ **Developer Experience**
- Auto-reload on file changes (`npm run dev`)
- Comprehensive API documentation
- Testing guide with examples
- Error handling and validation

## Quick Start

### Prerequisites
- Node.js 18+ and npm

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Server
```bash
npm run dev
```

Server runs on `http://localhost:3000`

## Available Scripts

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

## API Documentation

Complete API specification available in:
- **Full Documentation:** [docs/API.md](docs/API.md)
- **Testing Guide:** [TESTING_GUIDE.md](TESTING_GUIDE.md)

### Quick Example

Register a user:
```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "Password123",
    "role": "MEMBER"
  }'
```

Login:
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "Password123"
  }'
```

## Project Structure

```
src/
├── routes/          # API endpoints
├── middleware/      # Auth middleware
├── utils/           # Helper functions (JWT)
├── app.js           # Express setup
└── server.js        # Entry point

.env                # Environment variables
docs/
└── API.md          # Full API documentation
```

## Technologies Used

- **Express.js** - Web framework
- **JWT (jsonwebtoken)** - Token authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin requests
- **dotenv** - Environment variables

## Data Storage

**In-Memory Storage (Arrays):**
- `users[]` - User authentication data
- `books[]` - Book catalog
- `authors[]` - Book authors
- `members[]` - Member profiles
- `loans[]` - Loan tracking
- `reservations[]` - Book reservations
- `libraries[]` - Library information

## Authentication

### Protected Routes
These endpoints require a JWT token in the `Authorization` header:

```
Authorization: Bearer <your-jwt-token>
```

Protected endpoints:
- `POST /api/v1/books` - Create book
- `PUT /api/v1/books/:id` - Update book
- `DELETE /api/v1/books/:id` - Delete book
- `POST /api/v1/loans` - Create loan
- `PATCH /api/v1/loans/:id/return` - Return book
- `POST /api/v1/reservations` - Create reservation
- `DELETE /api/v1/reservations/:id` - Cancel reservation
- `POST /api/v1/books/:bookId/authors` - Add author

### Public Routes
These endpoints can be accessed without authentication:
- `GET /api/v1/libraries` - View libraries
- `GET /api/v1/books` - View books
- `GET /api/v1/members` - View members

## Testing

### Using Postman/Thunder Client
1. Import the endpoints from [TESTING_GUIDE.md](TESTING_GUIDE.md)
2. Create a collection with example requests
3. Use the provided request bodies and headers

### Using cURL
See examples in [TESTING_GUIDE.md](TESTING_GUIDE.md)

## Environment Variables

Create a `.env` file:
```env
JWT_SECRET="your-secret-key-here"
PORT=3000
NODE_ENV="development"
```

⚠️ **Security:** Never commit `.env` to Git. Change `JWT_SECRET` in production.

## Common Commands

```bash
# Format code
npm run prettier --write .

# Run tests (if added)
npm test

# View server logs
npm run dev
```

## Git Workflow

### Commit Your Work
```bash
git add .
git commit -m "Add authentication and API endpoints"
git push origin main
```

### Create Feature Branch
```bash
git checkout -b feature/new-feature
git add .
git commit -m "Add new feature"
git push origin feature/new-feature
```

## API Health Check

```bash
curl http://localhost:3000/api/health
```

Response:
```json
{
  "status": "OK",
  "timestamp": "2026-04-25T10:00:00Z"
}
```

## Troubleshooting

### Port 3000 already in use
Change port in `.env` or kill process on port 3000.

### Data not persisting
Data is stored in-memory, so it resets when the server restarts. This is normal for development.

### Token invalid
- Ensure token is copied correctly
- Check token hasn't expired (24 hours)
- Verify JWT_SECRET matches in `.env`

## Future Enhancements

- [ ] Rate limiting
- [ ] Email verification
- [ ] Advanced search filters
- [ ] Pagination improvements
- [ ] Unit tests
- [ ] Integration tests
- [ ] API logging
- [ ] Request validation schemas

## License

ISC

## Support

For issues or questions, check [TESTING_GUIDE.md](TESTING_GUIDE.md) for troubleshooting.

---

**Deliverables Completed:**
- ✅ Deliverable 2: API Specification (15 endpoints documented)
- ✅ Deliverable 3: Authentication System (JWT + bcrypt)
" 
