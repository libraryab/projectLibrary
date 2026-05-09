# API Contract & Example Responses

This document shows the exact API contract expected by the frontend for all 3 pages to work correctly.

## Books Service

### GET /api/v1/books

Returns a list of all books in the library.

**Request:**
```
GET /api/v1/books
Content-Type: application/json
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "data": [
    {
      "id": "b1",
      "title": "The Great Gatsby",
      "author": "F. Scott Fitzgerald",
      "description": "A classic novel of the Jazz Age",
      "isbn": "978-0-7432-7356-5",
      "year": 1925,
      "isAvailable": true,
      "createdAt": "2026-05-01T10:00:00Z",
      "updatedAt": "2026-05-09T14:30:00Z"
    },
    {
      "id": "b2",
      "title": "1984",
      "author": "George Orwell",
      "description": "A dystopian social science fiction novel",
      "isbn": "978-0-452-28423-4",
      "year": 1949,
      "isAvailable": false,
      "createdAt": "2026-05-01T10:15:00Z",
      "updatedAt": "2026-05-09T10:00:00Z"
    },
    {
      "id": "b3",
      "title": "To Kill a Mockingbird",
      "author": "Harper Lee",
      "description": "A gripping tale of racial injustice",
      "isbn": "978-0-06-112008-4",
      "year": 1960,
      "isAvailable": true,
      "createdAt": "2026-05-01T10:30:00Z",
      "updatedAt": "2026-05-06T09:00:00Z"
    }
  ]
}
```

**Error Response (500):**
```json
{
  "error": "Failed to fetch books",
  "message": "Database connection error",
  "status": 500
}
```

**Frontend Usage:**
```javascript
// In booksService.js
const books = await getAllBooks()
// books = array of 3 books above

// Filter available
const available = books.filter(b => b.isAvailable === true)
// Returns [b1, b3]

// Search by title
const filtered = books.filter(b => 
  b.title.toLowerCase().includes('great')
)
// Returns [b1]

// On MemberBooksPage:
// - Displays all books as cards
// - Can search and filter
// - Can reserve available books
```

---

## Loans Service

### GET /api/v1/loans

Returns all loans (both active and returned).

**Request:**
```
GET /api/v1/loans
Content-Type: application/json
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "data": [
    {
      "id": "l1",
      "bookId": "b1",
      "bookTitle": "The Great Gatsby",
      "memberId": "m1",
      "memberName": "John Doe",
      "loanDate": "2026-05-01T10:00:00Z",
      "dueDate": "2026-05-15T10:00:00Z",
      "returnDate": null,
      "createdAt": "2026-05-01T10:00:00Z",
      "updatedAt": "2026-05-09T14:30:00Z"
    },
    {
      "id": "l2",
      "bookId": "b3",
      "bookTitle": "To Kill a Mockingbird",
      "memberId": "m2",
      "memberName": "Jane Smith",
      "loanDate": "2026-05-03T11:00:00Z",
      "dueDate": "2026-05-17T11:00:00Z",
      "returnDate": null,
      "createdAt": "2026-05-03T11:00:00Z",
      "updatedAt": "2026-05-09T09:00:00Z"
    },
    {
      "id": "l3",
      "bookId": "b2",
      "bookTitle": "1984",
      "memberId": "m1",
      "memberName": "John Doe",
      "loanDate": "2026-04-20T14:00:00Z",
      "dueDate": "2026-05-04T14:00:00Z",
      "returnDate": null,
      "createdAt": "2026-04-20T14:00:00Z",
      "updatedAt": "2026-05-09T08:00:00Z"
    }
  ]
}
```

**Frontend Usage:**
```javascript
// On AdminDashboardPage:
const loans = await getActiveLoans()
// Returns only loans where returnDate === null
// [l1, l2, l3] above all have returnDate: null

// Get due info
const { isOverdue, daysRemaining } = getDueInfo(l1.dueDate)
// For l1: dueDate = 2026-05-15
// If today = 2026-05-09
// isOverdue = false, daysRemaining = 6

// For l3: dueDate = 2026-05-04
// isOverdue = true, daysRemaining = -5 (days overdue)

// Displays in Recent Loans table
// Shows member names, book titles, due dates
// Marks overdue loans with red badge
```

### PATCH /api/v1/loans/:id/return

Mark a loan as returned.

**Request:**
```
PATCH /api/v1/loans/l1/return
Content-Type: application/json
Authorization: Bearer <token>

{}
```

**Response (200 OK):**
```json
{
  "data": {
    "id": "l1",
    "bookId": "b1",
    "bookTitle": "The Great Gatsby",
    "memberId": "m1",
    "memberName": "John Doe",
    "loanDate": "2026-05-01T10:00:00Z",
    "dueDate": "2026-05-15T10:00:00Z",
    "returnDate": "2026-05-09T15:00:00Z",
    "createdAt": "2026-05-01T10:00:00Z",
    "updatedAt": "2026-05-09T15:00:00Z"
  }
}
```

**Frontend Usage:**
```javascript
// On LoansManagementPage:
const returnedLoan = await returnLoan('l1')
// returnDate is now set to current time

// After return:
const activeLoans = await getActiveLoans()
// l1 is NO LONGER included (because returnDate is not null)
// Now only [l2, l3] are active

// Table refreshes automatically
// Statistics update:
// - Total decreases by 1
// - Overdue might decrease if l1 was overdue
```

---

## Reservations Service

### GET /api/v1/reservations

Returns all reservations.

**Request:**
```
GET /api/v1/reservations
Content-Type: application/json
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "data": [
    {
      "id": "r1",
      "bookId": "b2",
      "bookTitle": "1984",
      "memberId": "m2",
      "memberName": "Jane Smith",
      "createdAt": "2026-05-09T10:00:00Z",
      "updatedAt": "2026-05-09T10:00:00Z",
      "isCancelled": false
    },
    {
      "id": "r2",
      "bookId": "b1",
      "bookTitle": "The Great Gatsby",
      "memberId": "m3",
      "memberName": "Bob Johnson",
      "createdAt": "2026-05-08T14:00:00Z",
      "updatedAt": "2026-05-08T14:00:00Z",
      "isCancelled": false
    }
  ]
}
```

**Frontend Usage:**
```javascript
// On AdminDashboardPage:
const reservations = await getAllReservations()
const recent = getRecentReservations(5)
// Gets last 5 by createdAt date
// Returns [r2, r1] (newest first)

// In AdminDashboardPage stats:
// Active Reservations count = 2 (where isCancelled !== true)

// Displays in Recent Reservations table
// Shows member names, book titles, reservation dates
```

### POST /api/v1/reservations

Create a new reservation.

**Request:**
```
POST /api/v1/reservations
Content-Type: application/json
Authorization: Bearer <token>

{
  "bookId": "b2",
  "memberId": "m1"
}
```

**Response (201 Created):**
```json
{
  "data": {
    "id": "r3",
    "bookId": "b2",
    "bookTitle": "1984",
    "memberId": "m1",
    "memberName": "John Doe",
    "createdAt": "2026-05-09T16:00:00Z",
    "updatedAt": "2026-05-09T16:00:00Z",
    "isCancelled": false
  }
}
```

**Frontend Usage:**
```javascript
// On MemberBooksPage:
const reservation = await createReservation({
  bookId: 'b2',
  memberId: userAuth.id
})

// Shows success message:
// "Book reserved successfully! Check your email for confirmation."

// Refreshes book list to show updated availability
// Book that was reserved might now show as unavailable
```

---

## Members Service

### GET /api/v1/members

Returns all members (used in dashboard).

**Request:**
```
GET /api/v1/members
Content-Type: application/json
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "data": [
    {
      "id": "m1",
      "name": "John Doe",
      "email": "john@example.com",
      "phoneNumber": "555-1234",
      "address": "123 Main St",
      "joinDate": "2026-01-15T10:00:00Z",
      "createdAt": "2026-01-15T10:00:00Z",
      "updatedAt": "2026-05-09T10:00:00Z"
    },
    {
      "id": "m2",
      "name": "Jane Smith",
      "email": "jane@example.com",
      "phoneNumber": "555-5678",
      "address": "456 Oak Ave",
      "joinDate": "2026-02-20T10:00:00Z",
      "createdAt": "2026-02-20T10:00:00Z",
      "updatedAt": "2026-05-09T10:00:00Z"
    }
  ]
}
```

---

## Expected Backend Field Names

**Important**: The frontend expects exact field names. If your API uses different names, update the service files:

### Book Object
```javascript
{
  id: string,                    // REQUIRED
  title: string,                 // REQUIRED (used in search)
  author: string,                // REQUIRED (used in search)
  isAvailable: boolean,          // REQUIRED (used in filtering)
  description: string,           // optional
  isbn: string,                  // optional
  year: number,                  // optional
  createdAt: ISO8601 datetime,   // optional
  updatedAt: ISO8601 datetime    // optional
}
```

### Loan Object
```javascript
{
  id: string,                    // REQUIRED
  bookId: string,                // REQUIRED
  bookTitle: string,             // REQUIRED (used in display)
  memberId: string,              // REQUIRED
  memberName: string,            // REQUIRED (used in display)
  loanDate: ISO8601 datetime,    // REQUIRED (used in display)
  dueDate: ISO8601 datetime,     // REQUIRED (used for overdue check)
  returnDate: ISO8601 datetime|null,  // REQUIRED (null = active)
  createdAt: ISO8601 datetime,   // optional
  updatedAt: ISO8601 datetime    // optional
}
```

### Reservation Object
```javascript
{
  id: string,                    // REQUIRED
  bookId: string,                // REQUIRED
  bookTitle: string,             // REQUIRED (used in display)
  memberId: string,              // REQUIRED
  memberName: string,            // REQUIRED (used in display)
  createdAt: ISO8601 datetime,   // REQUIRED (used for sorting recent)
  isCancelled: boolean,          // REQUIRED (null = active)
  updatedAt: ISO8601 datetime    // optional
}
```

### Member Object
```javascript
{
  id: string,                    // REQUIRED (for creating reservations)
  name: string,                  // optional
  email: string,                 // optional
  phoneNumber: string,           // optional
  address: string,               // optional
  joinDate: ISO8601 datetime,    // optional
  createdAt: ISO8601 datetime,   // optional
  updatedAt: ISO8601 datetime    // optional
}
```

---

## Common Adjustments Needed

### If API uses different field names:

**Problem**: API returns `available` instead of `isAvailable`
**Solution**: Update booksService.js:
```javascript
// From:
return books.filter(book => book.isAvailable === true)

// To:
return books.filter(book => book.available === true)
```

**Problem**: API returns `book` instead of `bookTitle` in loans
**Solution**: Update LoansManagementPage.jsx:
```javascript
// From:
{loan.bookTitle || loan.bookId}

// To:
{loan.book?.title || loan.bookId}
```

**Problem**: API returns `null` or `undefined` for some fields
**Solution**: Use optional chaining or provide defaults:
```javascript
const memberName = loan.memberName || loan.member?.name || 'Unknown'
```

---

## HTTP Status Codes

| Status | Meaning | Example |
|--------|---------|---------|
| 200 | Success - Data returned | GET /books, PATCH /return |
| 201 | Created - Resource created | POST /reservations |
| 400 | Bad request - Invalid data | Missing required fields |
| 401 | Unauthorized - No/invalid token | Token expired |
| 403 | Forbidden - Not permitted | User can't create reservation |
| 404 | Not found - Resource doesn't exist | GET /loans/invalid-id |
| 500 | Server error | Database error |

---

## Testing Individual Endpoints

### Using curl

```bash
# Get all books
curl -H "Authorization: Bearer <token>" \
  http://localhost:3000/api/v1/books

# Get all loans
curl -H "Authorization: Bearer <token>" \
  http://localhost:3000/api/v1/loans

# Get all reservations
curl -H "Authorization: Bearer <token>" \
  http://localhost:3000/api/v1/reservations

# Create reservation
curl -X POST \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"bookId":"b1","memberId":"m1"}' \
  http://localhost:3000/api/v1/reservations

# Mark loan as returned
curl -X PATCH \
  -H "Authorization: Bearer <token>" \
  -d '{}' \
  http://localhost:3000/api/v1/loans/l1/return
```

### Using Postman

1. Create collection "Library API"
2. Add environment variable: `base_url = http://localhost:3000`
3. Add environment variable: `token = <your-auth-token>`
4. Create requests:
   - GET `{{base_url}}/api/v1/books`
   - GET `{{base_url}}/api/v1/loans`
   - GET `{{base_url}}/api/v1/reservations`
   - POST `{{base_url}}/api/v1/reservations`
   - PATCH `{{base_url}}/api/v1/loans/:id/return`
5. In auth tab: Set "Bearer Token" to `{{token}}`

---

## Debugging API Issues

### Issue: Empty data arrays
```javascript
// Check what API actually returns
console.log(response)

// API might return:
response = { data: [] }        // Expected
response = []                   // Need to handle
response = { books: [] }        // Field name mismatch

// Service files handle this:
return response.data.data || response.data || []
```

### Issue: Fields missing from objects
```javascript
// Check if API returns all required fields
// If loan missing "bookTitle":
const bookTitle = loan.bookTitle || loan.book?.title || 'Unknown'

// Update display to handle missing data
{loan.memberName || loan.memberId || 'Unknown Member'}
```

### Issue: Dates in wrong format
```javascript
// Frontend expects ISO8601 format:
dueDate: "2026-05-15T10:00:00Z"  // ✓ Works
dueDate: "05/15/2026"             // ✗ getDueInfo() will fail

// Fix: Convert in service file
const loan = {
  ...data,
  dueDate: new Date(data.dueDate).toISOString()
}
```

---

## Response Format Troubleshooting

### Symptom: "Cannot read property 'data' of undefined"
**Cause**: Accessing response.data.data but API doesn't have nested data

**Fix in service file**:
```javascript
// Current pattern handles both:
const books = response.data.data || response.data

// Or be more explicit:
if (Array.isArray(response.data)) {
  return response.data  // API returns array directly
} else if (Array.isArray(response.data.data)) {
  return response.data.data  // API returns { data: [...] }
}
```

### Symptom: Loans showing "Invalid Date"
**Cause**: dueDate in wrong format or missing

**Fix**: Ensure API returns:
```json
{
  "dueDate": "2026-05-15T10:00:00Z"
}
```

### Symptom: Can't filter by isAvailable
**Cause**: Field name mismatch

**Check API response**:
```javascript
// Does book have:
{ isAvailable: true }    // ✓ Correct
{ available: true }      // ✗ Wrong field name
{ status: 'available' }  // ✗ Different format
```

**Fix service file** if needed:
```javascript
const available = books.filter(book => 
  book.available === true  // Changed from isAvailable
)
```

