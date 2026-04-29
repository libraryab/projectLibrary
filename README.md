"# Library Management System - Backend API

A modern Node.js/Express backend for a university library management system with authentication, book management, member profiles, loans, and reservations.

## Features

✅ **Authentication System**

- JWT-based authentication with bcrypt password hashing
- User registration and login
- Protected routes with middleware
- 24-hour token expiration

✅ **REST API** (30+ endpoints)

- Authentication (register, login, profile)
- Complete CRUD: Books (GET, POST, PUT, DELETE)
- Complete CRUD: Members (GET, POST, PUT, DELETE)
- Complete CRUD: Libraries (GET, POST, PUT, DELETE)
- Complete CRUD: Loans (GET, POST, GET by ID, return)
- Complete CRUD: Reservations (GET, POST, PUT, DELETE)
- Book authors management
- Advanced filtering and search

✅ **Data Storage**

- PostgreSQL database with Prisma ORM
- Automated migrations
- Relational schema with proper constraints
- Data persistence across server restarts

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
├── routes/           # API endpoints
├── controllers/      # Request handlers
├── services/         # Business logic
├── middleware/       # Auth middleware
├── utils/            # Helper functions (JWT)
├── lib/              # Prisma client
├── app.js            # Express setup
└── server.js         # Entry point

prisma/
├── schema.prisma     # Database schema
└── migrations/       # Database migrations

.env                  # Environment variables
docs/
└── API.md            # Full API documentation
```

## Technologies Used

- **Express.js** - Web framework
- **Node.js** - Runtime environment
- **PostgreSQL** - Relational database (Neon)
- **Prisma** - ORM with automated migrations
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

**Books (Staff - ADMIN/LIBRARIAN):**
- `POST /api/v1/books` - Create book
- `PUT /api/v1/books/:id` - Update book
- `DELETE /api/v1/books/:id` - Delete book

**Members (Authenticated):**
- `POST /api/v1/members` - Create member
- `PUT /api/v1/members/:id` - Update member profile
- `DELETE /api/v1/members/:id` - Delete member (ADMIN only)

**Libraries (ADMIN only):**
- `POST /api/v1/libraries` - Create library
- `PUT /api/v1/libraries/:id` - Update library
- `DELETE /api/v1/libraries/:id` - Delete library

**Loans (Staff - ADMIN/LIBRARIAN):**
- `POST /api/v1/loans` - Create loan (issue book to member)
- `PATCH /api/v1/loans/:id/return` - Return loaned book
- `GET /api/v1/loans/overdue` - Get overdue loans

**Reservations (MEMBER):**
- `POST /api/v1/reservations` - Create reservation
- `PUT /api/v1/reservations/:id` - Update reservation
- `DELETE /api/v1/reservations/:id` - Cancel reservation

**Authors (Staff - ADMIN/LIBRARIAN):**
- `POST /api/v1/books/:bookId/authors` - Add author to book

### Public Routes

These endpoints can be accessed without authentication:

**Libraries:**
- `GET /api/v1/libraries` - Get all libraries
- `GET /api/v1/libraries/:id` - Get library by ID

**Books:**
- `GET /api/v1/books` - Get all books (with search)
- `GET /api/v1/books/:id` - Get book by ID

**Members:**
- `GET /api/v1/members` - Get all members (with search)
- `GET /api/v1/members/:id` - Get member by ID

**Loans:**
- `GET /api/v1/loans` - Get all loans (with filters)
- `GET /api/v1/loans/:id` - Get loan by ID
- `GET /api/v1/loans/member/:memberId` - Get member's loans

**Reservations:**
- `GET /api/v1/reservations` - Get all reservations
- `GET /api/v1/reservations/:id` - Get reservation by ID
- `GET /api/v1/reservations/member/:memberId` - Get member's reservations

**Authors:**
- `GET /api/v1/books/:bookId/authors` - Get authors for a book

## Testing

### Complete CRUD Examples

#### Members CRUD (Full Example)

**1. Register and login as staff:**
```bash
# Register Admin
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@library.com",
    "password": "AdminPassword123",
    "role": "STAFF",
    "staffType": "ADMIN"
  }'

# Login to get token
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@library.com",
    "password": "AdminPassword123"
  }'
```

**2. Create a member:**
```bash
curl -X POST http://localhost:3000/api/v1/members \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "MemberPass123",
    "phone": "+1234567890"
  }'
```

**3. Read member(s):**
```bash
# Get all members
curl http://localhost:3000/api/v1/members

# Get specific member
curl http://localhost:3000/api/v1/members/member-id-here
```

**4. Update member:**
```bash
curl -X PUT http://localhost:3000/api/v1/members/member-id-here \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Updated",
    "phone": "+9876543210"
  }'
```

**5. Delete member:**
```bash
curl -X DELETE http://localhost:3000/api/v1/members/member-id-here \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### Books CRUD (Already Implemented)

Similar CRUD flow available at `/api/v1/books` with staff authentication.

#### Libraries CRUD (Complete)

Full CRUD operations at `/api/v1/libraries` for ADMIN users.

### Using Postman/Thunder Client

1. Import the endpoints from [CRUD_FLOW_TEST.md](CRUD_FLOW_TEST.md)
2. Create a collection with example requests
3. Use the provided request bodies and headers

### Using cURL

See examples in [CRUD_FLOW_TEST.md](CRUD_FLOW_TEST.md)

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

### Database connection error

- Verify `DATABASE_URL` is correct in `.env`
- Check PostgreSQL server is running
- Ensure network connection to database host

### Migrations failed

Run migrations:
```bash
npm run prisma:migrate
```

Or view schema:
```bash
npm run prisma:studio
```

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

- ✅ Deliverable 1: Backend project with layered architecture (routes/controllers/services)
- ✅ Deliverable 2: API Specification (30+ endpoints documented)
- ✅ Deliverable 3: Authentication System (JWT + bcrypt)
- ✅ Deliverable 4: Prisma schema + migrations + PostgreSQL connection
- ✅ Deliverable 5: Working endpoints - Complete CRUD flows (4 major entities):
  - Books: Full CRUD (GET, POST, PUT, DELETE)
  - Members: Full CRUD (GET, POST, PUT, DELETE)
  - Libraries: Full CRUD (GET, POST, PUT, DELETE)
  - Loans: Full CRUD (GET, POST, GET by ID, return)
  - Reservations: Full CRUD (GET, POST, PUT, DELETE)
