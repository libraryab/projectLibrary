# Library Management System - API Specification

**Base URL:** `http://localhost:3000/api/v1`  
**API Version:** v1  
**Authentication:** JWT Bearer Token (required for protected endpoints)

---

## Table of Contents
1. [Authentication Endpoints](#authentication)
2. [Libraries Endpoints](#libraries)
3. [Books Endpoints](#books)
4. [Authors Endpoints](#authors)
5. [Members Endpoints](#members)
6. [Staff Endpoints](#staff)
7. [Loans Endpoints](#loans)
8. [Reservations Endpoints](#reservations)

---

## Authentication

### 1. Register User
Create a new user account (Member or Staff).

**Endpoint:** `POST /api/v1/auth/register`

**Required:** No (First user can register without token)

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePassword123",
  "role": "MEMBER"
}
```

**Request Fields:**
- `name` (string, required): User's full name
- `email` (string, required): Unique email address
- `password` (string, required): Password (minimum 6 characters)
- `role` (string, required): Either `MEMBER` or `STAFF`

**Success Response (201 Created):**
```json
{
  "id": "user-123",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "MEMBER",
  "createdAt": "2026-04-25T10:00:00Z"
}
```

**Error Response (400 Bad Request):**
```json
{
  "error": "Email already registered"
}
```

**Error Response (400 Bad Request):**
```json
{
  "error": "Missing required fields: name, email, password, role"
}
```

---

### 2. Login User
Authenticate user and receive JWT token.

**Endpoint:** `POST /api/v1/auth/login`

**Required:** No

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePassword123"
}
```

**Success Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user-123",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "MEMBER"
  }
}
```

**Error Response (401 Unauthorized):**
```json
{
  "error": "Invalid email or password"
}
```

---

### 3. Get Current User Profile
Retrieve authenticated user's profile information.

**Endpoint:** `GET /api/v1/auth/me`

**Required:** Yes (JWT Token)

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200 OK):**
```json
{
  "id": "user-123",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "MEMBER",
  "createdAt": "2026-04-25T10:00:00Z"
}
```

**Error Response (401 Unauthorized):**
```json
{
  "error": "Token missing or invalid"
}
```

---

## Libraries

### 4. Get All Libraries
Retrieve a list of all libraries.

**Endpoint:** `GET /api/v1/libraries`

**Required:** No

**Query Parameters:**
- `search` (string, optional): Search by library name

**Success Response (200 OK):**
```json
[
  {
    "id": "lib-001",
    "name": "Central Library",
    "location": "Downtown",
    "createdAt": "2026-04-20T10:00:00Z"
  },
  {
    "id": "lib-002",
    "name": "North Branch",
    "location": "North City",
    "createdAt": "2026-04-21T10:00:00Z"
  }
]
```

---

### 5. Get Library by ID
Retrieve details of a specific library.

**Endpoint:** `GET /api/v1/libraries/:id`

**Required:** No

**URL Parameters:**
- `id` (string, required): Library ID

**Success Response (200 OK):**
```json
{
  "id": "lib-001",
  "name": "Central Library",
  "location": "Downtown",
  "createdAt": "2026-04-20T10:00:00Z"
}
```

**Error Response (404 Not Found):**
```json
{
  "error": "Library not found"
}
```

---

## Books

### 6. Get All Books
Retrieve a list of all books with optional filtering.

**Endpoint:** `GET /api/v1/books`

**Required:** No

**Query Parameters:**
- `libraryId` (string, optional): Filter by library ID
- `publisherId` (string, optional): Filter by publisher ID
- `search` (string, optional): Search by book title
- `skip` (number, optional): Number of records to skip (default: 0)
- `take` (number, optional): Number of records to return (default: 10)

**Success Response (200 OK):**
```json
{
  "books": [
    {
      "id": "book-001",
      "title": "The Great Gatsby",
      "publisherId": "pub-001",
      "libraryId": "lib-001",
      "authors": [
        {
          "id": "auth-001",
          "name": "F. Scott Fitzgerald"
        }
      ],
      "createdAt": "2026-04-20T10:00:00Z"
    }
  ],
  "total": 1,
  "skip": 0,
  "take": 10
}
```

---

### 7. Get Book by ID
Retrieve details of a specific book.

**Endpoint:** `GET /api/v1/books/:id`

**Required:** No

**URL Parameters:**
- `id` (string, required): Book ID

**Success Response (200 OK):**
```json
{
  "id": "book-001",
  "title": "The Great Gatsby",
  "publisherId": "pub-001",
  "libraryId": "lib-001",
  "authors": [
    {
      "id": "auth-001",
      "name": "F. Scott Fitzgerald"
    }
  ],
  "createdAt": "2026-04-20T10:00:00Z"
}
```

**Error Response (404 Not Found):**
```json
{
  "error": "Book not found"
}
```

---

### 8. Create Book
Add a new book to the system.

**Endpoint:** `POST /api/v1/books`

**Required:** Yes (JWT Token, STAFF role recommended)

**Request Body:**
```json
{
  "title": "1984",
  "publisherId": "pub-002",
  "libraryId": "lib-001"
}
```

**Success Response (201 Created):**
```json
{
  "id": "book-002",
  "title": "1984",
  "publisherId": "pub-002",
  "libraryId": "lib-001",
  "authors": [],
  "createdAt": "2026-04-25T10:00:00Z"
}
```

**Error Response (401 Unauthorized):**
```json
{
  "error": "Authentication required"
}
```

---

### 9. Update Book
Modify book details.

**Endpoint:** `PUT /api/v1/books/:id`

**Required:** Yes (JWT Token, STAFF role recommended)

**URL Parameters:**
- `id` (string, required): Book ID

**Request Body:**
```json
{
  "title": "1984 - Updated Edition",
  "publisherId": "pub-002"
}
```

**Success Response (200 OK):**
```json
{
  "id": "book-002",
  "title": "1984 - Updated Edition",
  "publisherId": "pub-002",
  "libraryId": "lib-001",
  "authors": [],
  "updatedAt": "2026-04-25T11:00:00Z"
}
```

---

### 10. Delete Book
Remove a book from the system.

**Endpoint:** `DELETE /api/v1/books/:id`

**Required:** Yes (JWT Token, STAFF role recommended)

**URL Parameters:**
- `id` (string, required): Book ID

**Success Response (200 OK):**
```json
{
  "message": "Book deleted successfully"
}
```

---

## Authors

### 11. Get Authors by Book ID
Retrieve all authors associated with a book.

**Endpoint:** `GET /api/v1/books/:bookId/authors`

**Required:** No

**URL Parameters:**
- `bookId` (string, required): Book ID

**Success Response (200 OK):**
```json
{
  "authors": [
    {
      "id": "auth-001",
      "name": "F. Scott Fitzgerald"
    }
  ]
}
```

---

### 12. Add Author to Book
Associate an author with a book.

**Endpoint:** `POST /api/v1/books/:bookId/authors`

**Required:** Yes (JWT Token, STAFF role recommended)

**URL Parameters:**
- `bookId` (string, required): Book ID

**Request Body:**
```json
{
  "name": "George Orwell"
}
```

**Success Response (201 Created):**
```json
{
  "id": "auth-002",
  "name": "George Orwell"
}
```

---

## Members

### 13. Get All Members
Retrieve a list of all library members.

**Endpoint:** `GET /api/v1/members`

**Required:** No (Consider authentication for privacy)

**Query Parameters:**
- `search` (string, optional): Search by member name or email

**Success Response (200 OK):**
```json
[
  {
    "id": "member-001",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "555-1234",
    "createdAt": "2026-04-20T10:00:00Z"
  }
]
```

---

### 14. Get Member by ID
Retrieve details of a specific member.

**Endpoint:** `GET /api/v1/members/:id`

**Required:** No (Consider authentication for privacy)

**URL Parameters:**
- `id` (string, required): Member ID

**Success Response (200 OK):**
```json
{
  "id": "member-001",
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "555-1234",
  "createdAt": "2026-04-20T10:00:00Z",
  "loans": [
    {
      "id": "loan-001",
      "bookId": "book-001",
      "loanDate": "2026-04-20T10:00:00Z",
      "dueDate": "2026-05-04T10:00:00Z"
    }
  ]
}
```

---

## Loans

### 15. Create Loan
Record a book loan for a member.

**Endpoint:** `POST /api/v1/loans`

**Required:** Yes (JWT Token)

**Request Body:**
```json
{
  "bookCopyId": "copy-001",
  "memberId": "member-001",
  "staffId": "staff-001",
  "dueDate": "2026-05-09"
}
```

**Success Response (201 Created):**
```json
{
  "id": "loan-001",
  "bookCopyId": "copy-001",
  "memberId": "member-001",
  "staffId": "staff-001",
  "loanDate": "2026-04-25T10:00:00Z",
  "dueDate": "2026-05-09T00:00:00Z",
  "returnedDate": null
}
```

**Error Response (400 Bad Request):**
```json
{
  "error": "Book copy not available"
}
```

---

### 16. Get All Loans
Retrieve all loans with optional filtering.

**Endpoint:** `GET /api/v1/loans`

**Required:** No (Recommend STAFF role)

**Query Parameters:**
- `memberId` (string, optional): Filter by member ID
- `status` (string, optional): Filter by status ("active" or "returned")

**Success Response (200 OK):**
```json
[
  {
    "id": "loan-001",
    "bookCopyId": "copy-001",
    "book": {
      "id": "book-001",
      "title": "The Great Gatsby"
    },
    "member": {
      "id": "member-001",
      "name": "John Doe"
    },
    "loanDate": "2026-04-25T10:00:00Z",
    "dueDate": "2026-05-09T00:00:00Z",
    "returnedDate": null
  }
]
```

---

### 17. Get Member's Loans
Retrieve all loans for a specific member.

**Endpoint:** `GET /api/v1/members/:memberId/loans`

**Required:** No (Recommend authentication for privacy)

**URL Parameters:**
- `memberId` (string, required): Member ID

**Success Response (200 OK):**
```json
{
  "member": {
    "id": "member-001",
    "name": "John Doe"
  },
  "loans": [
    {
      "id": "loan-001",
      "book": {
        "id": "book-001",
        "title": "The Great Gatsby"
      },
      "loanDate": "2026-04-25T10:00:00Z",
      "dueDate": "2026-05-09T00:00:00Z",
      "returnedDate": null,
      "isOverdue": false
    }
  ]
}
```

---

### 18. Return Loan
Mark a book as returned.

**Endpoint:** `PATCH /api/v1/loans/:id/return`

**Required:** Yes (JWT Token)

**URL Parameters:**
- `id` (string, required): Loan ID

**Request Body:** (Optional)
```json
{
  "returnedDate": "2026-05-08"
}
```

**Success Response (200 OK):**
```json
{
  "id": "loan-001",
  "bookCopyId": "copy-001",
  "memberId": "member-001",
  "loanDate": "2026-04-25T10:00:00Z",
  "dueDate": "2026-05-09T00:00:00Z",
  "returnedDate": "2026-05-08T10:00:00Z",
  "status": "returned"
}
```

---

## Reservations

### 19. Create Reservation
Reserve a book for a member.

**Endpoint:** `POST /api/v1/reservations`

**Required:** Yes (JWT Token)

**Request Body:**
```json
{
  "bookId": "book-001",
  "memberId": "member-001"
}
```

**Success Response (201 Created):**
```json
{
  "id": "res-001",
  "bookId": "book-001",
  "memberId": "member-001",
  "reservationDate": "2026-04-25T10:00:00Z",
  "status": "active"
}
```

**Error Response (400 Bad Request):**
```json
{
  "error": "Book already reserved by this member"
}
```

---

### 20. Get All Reservations
Retrieve all reservations.

**Endpoint:** `GET /api/v1/reservations`

**Required:** No (Recommend STAFF role)

**Query Parameters:**
- `status` (string, optional): Filter by status ("active" or "fulfilled")

**Success Response (200 OK):**
```json
[
  {
    "id": "res-001",
    "book": {
      "id": "book-001",
      "title": "The Great Gatsby"
    },
    "member": {
      "id": "member-001",
      "name": "John Doe"
    },
    "reservationDate": "2026-04-25T10:00:00Z",
    "status": "active"
  }
]
```

---

### 21. Get Member's Reservations
Retrieve all reservations for a specific member.

**Endpoint:** `GET /api/v1/members/:memberId/reservations`

**Required:** No (Recommend authentication for privacy)

**URL Parameters:**
- `memberId` (string, required): Member ID

**Success Response (200 OK):**
```json
{
  "member": {
    "id": "member-001",
    "name": "John Doe"
  },
  "reservations": [
    {
      "id": "res-001",
      "book": {
        "id": "book-001",
        "title": "The Great Gatsby"
      },
      "reservationDate": "2026-04-25T10:00:00Z",
      "status": "active"
    }
  ]
}
```

---

### 22. Cancel Reservation
Delete a reservation.

**Endpoint:** `DELETE /api/v1/reservations/:id`

**Required:** Yes (JWT Token)

**URL Parameters:**
- `id` (string, required): Reservation ID

**Success Response (200 OK):**
```json
{
  "message": "Reservation cancelled successfully"
}
```

---

## Authentication Header Format

For all protected endpoints, include the JWT token in the Authorization header:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InVzZXItMTIzIiwiaWF0IjoxNzE0MDU0NDAwLCJleHAiOjE3MTQxNDA4MDB9.signature
```

---

## Error Handling

All error responses follow this format:

```json
{
  "error": "Error description",
  "statusCode": 400,
  "timestamp": "2026-04-25T10:00:00Z"
}
```

**Common HTTP Status Codes:**
- `200 OK`: Successful request
- `201 Created`: Resource created successfully
- `400 Bad Request`: Invalid request parameters
- `401 Unauthorized`: Missing or invalid authentication
- `403 Forbidden`: User lacks permission
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server error

---

## Rate Limiting

Current implementation has no rate limiting. Consider implementing rate limiting in production environments.

---

## Pagination

Endpoints that return lists support pagination with query parameters:
- `skip` (default: 0): Records to skip
- `take` (default: 10): Records per page

Example: `GET /api/v1/books?skip=0&take=20`

---

## Filtering & Searching

Most list endpoints support filtering:
- Use `search` parameter to search by name/title
- Use specific ID parameters (e.g., `libraryId`, `memberId`) to filter by relationship

---

**Last Updated:** April 25, 2026  
**API Version:** 1.0
