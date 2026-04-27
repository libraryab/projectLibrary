# Complete CRUD Flow Testing - Members Endpoint

This guide walks through a complete Create-Read-Update-Delete flow with authentication.

## Prerequisites
- Server running: `npm run dev`
- Test using curl, Postman, or Thunder Client

---

## Step 1: Register a Staff User (Admin)
This is needed to delete members (requires ADMIN role).

**Endpoint:** `POST http://localhost:3000/api/v1/auth/register`

```json
{
  "name": "Admin User",
  "email": "admin@library.com",
  "password": "AdminPassword123",
  "role": "STAFF",
  "staffType": "ADMIN"
}
```

**Response:**
```json
{
  "id": "user-123",
  "name": "Admin User",
  "email": "admin@library.com",
  "role": "STAFF",
  "staffType": "ADMIN",
  "createdAt": "2026-04-27T10:00:00.000Z"
}
```

---

## Step 2: Login as Admin
**Endpoint:** `POST http://localhost:3000/api/v1/auth/login`

```json
{
  "email": "admin@library.com",
  "password": "AdminPassword123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user-123",
    "name": "Admin User",
    "email": "admin@library.com",
    "role": "STAFF",
    "staffType": "ADMIN"
  }
}
```

**Save the token for next steps:** `TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

---

## Step 3: CREATE - Create a New Member
**Endpoint:** `POST http://localhost:3000/api/v1/members`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "MemberPassword123",
  "phone": "+1234567890"
}
```

**Response (201 Created):**
```json
{
  "id": "member-456",
  "name": "John Doe",
  "email": "john.doe@example.com",
  "phone": "+1234567890",
  "createdAt": "2026-04-27T10:05:00.000Z"
}
```

**Save the member ID:** `MEMBER_ID=member-456`

---

## Step 4: READ - Get All Members
**Endpoint:** `GET http://localhost:3000/api/v1/members`

**Response (200 OK):**
```json
[
  {
    "id": "member-456",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "phone": "+1234567890",
    "createdAt": "2026-04-27T10:05:00.000Z"
  }
]
```

---

## Step 5: READ - Get Single Member by ID
**Endpoint:** `GET http://localhost:3000/api/v1/members/member-456`

**Response (200 OK):**
```json
{
  "id": "member-456",
  "name": "John Doe",
  "email": "john.doe@example.com",
  "phone": "+1234567890",
  "createdAt": "2026-04-27T10:05:00.000Z"
}
```

---

## Step 6: UPDATE - Update Member Details
**Endpoint:** `PUT http://localhost:3000/api/v1/members/member-456`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "John Michael Doe",
  "phone": "+9876543210"
}
```

**Response (200 OK):**
```json
{
  "id": "member-456",
  "name": "John Michael Doe",
  "email": "john.doe@example.com",
  "phone": "+9876543210",
  "createdAt": "2026-04-27T10:05:00.000Z"
}
```

---

## Step 7: DELETE - Delete Member
**Endpoint:** `DELETE http://localhost:3000/api/v1/members/member-456`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
```

**Response (200 OK):**
```json
{
  "message": "Member deleted successfully"
}
```

**Try to GET the member again:**
```
GET http://localhost:3000/api/v1/members/member-456
```

**Response (404 Not Found):**
```json
{
  "error": "Member not found"
}
```

---

## Curl Commands (Copy & Paste)

### 1. Register Admin
```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@library.com",
    "password": "AdminPassword123",
    "role": "STAFF",
    "staffType": "ADMIN"
  }'
```

### 2. Login Admin
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@library.com",
    "password": "AdminPassword123"
  }'
```

### 3. Create Member (Replace TOKEN)
```bash
curl -X POST http://localhost:3000/api/v1/members \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john.doe@example.com",
    "password": "MemberPassword123",
    "phone": "+1234567890"
  }'
```

### 4. Get All Members
```bash
curl http://localhost:3000/api/v1/members
```

### 5. Get Single Member (Replace MEMBER_ID)
```bash
curl http://localhost:3000/api/v1/members/MEMBER_ID
```

### 6. Update Member (Replace TOKEN and MEMBER_ID)
```bash
curl -X PUT http://localhost:3000/api/v1/members/MEMBER_ID \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Michael Doe",
    "phone": "+9876543210"
  }'
```

### 7. Delete Member (Replace TOKEN and MEMBER_ID)
```bash
curl -X DELETE http://localhost:3000/api/v1/members/MEMBER_ID \
  -H "Authorization: Bearer TOKEN"
```

---

## Key Points

✅ **Authentication Required**: Create, Update, Delete operations require a valid JWT token
✅ **Admin Only**: Delete operations require ADMIN staff type  
✅ **Email Validation**: Duplicate emails are rejected
✅ **Password Hashing**: Passwords are automatically hashed with bcrypt
✅ **Cascading Delete**: Deleting a user also deletes the member record

---

## Bonus: Test the Books CRUD (Already Implemented)

You also have **Books CRUD** fully working:

### Create a Book
```bash
curl -X POST http://localhost:3000/api/v1/books \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "The Great Gatsby",
    "libraryId": "library-123"
  }'
```

### Get All Books
```bash
curl http://localhost:3000/api/v1/books
```

### Update a Book
```bash
curl -X PUT http://localhost:3000/api/v1/books/BOOK_ID \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "The Great Gatsby - Updated"
  }'
```

### Delete a Book
```bash
curl -X DELETE http://localhost:3000/api/v1/books/BOOK_ID \
  -H "Authorization: Bearer TOKEN"
```
