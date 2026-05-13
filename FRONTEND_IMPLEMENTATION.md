# Library Management System - Frontend Implementation Guide

## Overview
This document explains the frontend implementation for **Deliverable 3: 3 Working Pages with Real API Data**.

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── LoadingSpinner.jsx      # Loading state component
│   │   ├── ErrorAlert.jsx          # Error state component
│   │   ├── EmptyState.jsx          # Empty data state component
│   │   ├── StatCard.jsx            # Reusable statistic card
│   │   └── ProtectedRoute.jsx      # Auth protection
│   ├── pages/
│   │   ├── AdminDashboardPage.jsx  # Page 1: Dashboard
│   │   ├── MemberBooksPage.jsx     # Page 2: Browse Books
│   │   ├── LoansManagementPage.jsx # Page 3: Loans Management
│   │   ├── LoginPage.jsx
│   │   ├── RegisterPage.jsx
│   │   └── DashboardPage.jsx       # Legacy - deprecated
│   ├── services/
│   │   ├── booksService.js         # Books API calls
│   │   ├── loansService.js         # Loans API calls
│   │   ├── reservationsService.js  # Reservations API calls
│   │   ├── membersService.js       # Members API calls
│   │   └── authService.js
│   ├── layouts/
│   │   └── MainLayout.jsx          # Navigation layout
│   ├── hooks/
│   │   └── useAuth.js              # Auth hook
│   ├── context/
│   │   └── AuthContext.jsx
│   └── App.jsx                     # Main routing
├── tailwind.config.js
├── vite.config.js
└── package.json
```

## The 3 Pages

### 1. Admin Dashboard Page (`/dashboard`)
**Purpose:** Overview and recent activity

**Features:**
- Statistics cards (Total Books, Available Books, Active Loans, Reservations)
- Recent loans table with overdue highlighting
- Recent reservations table
- Real-time data from API
- Loading, error, and empty states

**API Calls:**
```javascript
GET /api/v1/books
GET /api/v1/loans
GET /api/v1/reservations
```

**Key Code Patterns:**
```javascript
// Fetch data in useEffect
useEffect(() => {
  loadDashboardData()
}, [])

// Handle loading state
if (loading) return <LoadingSpinner />

// Show error with retry
{error && <ErrorAlert error={error} onRetry={loadDashboardData} />}

// Display data with empty state
{data.length === 0 ? <EmptyState /> : <DataTable />}
```

---

### 2. Member Books Page (`/books`)
**Purpose:** Browse and reserve books

**Features:**
- Display all books as cards
- Search by title or author
- Filter available books only
- Reserve button with loading state
- Success notification
- Responsive grid layout (1 col mobile → 3 cols desktop)

**API Calls:**
```javascript
GET /api/v1/books              // Get all books
POST /api/v1/reservations      // Create reservation
```

**Key Code Patterns:**
```javascript
// Search and filter in real-time
useEffect(() => {
  applyFilters()
}, [searchQuery, showAvailableOnly, allBooks])

// Handle async action with loading state
const handleReserveBook = async (bookId) => {
  setReservingBookId(bookId)
  try {
    await createReservation(...)
    setSuccessMessage('...')
    loadBooks() // Refresh
  } finally {
    setReservingBookId(null)
  }
}
```

---

### 3. Loans Management Page (`/loans`)
**Purpose:** Admin manages active loans

**Features:**
- List all active loans in a table
- Status badges (Active/Overdue)
- Days remaining/overdue countdown
- Filter by status (All, Active, Overdue)
- Search by member or book
- Mark loan as returned
- Statistics: Total, Active, Overdue

**API Calls:**
```javascript
GET /api/v1/loans               // Get all loans
PATCH /api/v1/loans/:id/return  // Mark as returned
```

**Key Code Patterns:**
```javascript
// Helper function for date calculations
const { isOverdue, daysRemaining } = getDueInfo(loan.dueDate)

// Dynamic filtering
const filtered = loans.filter(loan => {
  if (filterStatus === 'overdue') {
    return getDueInfo(loan.dueDate).isOverdue
  }
  // ...
})
```

---

## API Contract

The frontend expects the following API responses:

### GET /api/v1/books
**Response:**
```json
{
  "data": [
    {
      "id": "book-1",
      "title": "The Great Gatsby",
      "author": "F. Scott Fitzgerald",
      "isAvailable": true,
      "description": "A classic novel..."
    }
  ]
}
```

### GET /api/v1/loans
**Response:**
```json
{
  "data": [
    {
      "id": "loan-1",
      "bookId": "book-1",
      "bookTitle": "The Great Gatsby",
      "memberId": "member-1",
      "memberName": "John Doe",
      "loanDate": "2026-05-01T10:00:00Z",
      "dueDate": "2026-05-15T10:00:00Z",
      "returnDate": null
    }
  ]
}
```

### GET /api/v1/reservations
**Response:**
```json
{
  "data": [
    {
      "id": "res-1",
      "bookId": "book-1",
      "bookTitle": "The Great Gatsby",
      "memberId": "member-1",
      "memberName": "John Doe",
      "createdAt": "2026-05-09T10:00:00Z",
      "isCancelled": false
    }
  ]
}
```

### POST /api/v1/reservations
**Request:**
```json
{
  "bookId": "book-1",
  "memberId": "member-1"
}
```

**Response:**
```json
{
  "data": {
    "id": "res-1",
    "bookId": "book-1",
    "memberId": "member-1",
    "createdAt": "2026-05-09T10:00:00Z"
  }
}
```

### PATCH /api/v1/loans/:id/return
**Request:** Empty body `{}`

**Response:**
```json
{
  "data": {
    "id": "loan-1",
    "bookId": "book-1",
    "memberId": "member-1",
    "returnDate": "2026-05-09T10:00:00Z"
  }
}
```

---

## Service Files Explained

### booksService.js
```javascript
// Get all books
const books = await getAllBooks()

// Count available books
const count = await getAvailableBooksCount()

// Search books
const results = await searchBooksByTitle('The')

// Get only available
const available = await getAvailableBooks()
```

### loansService.js
```javascript
// Get active loans (not returned)
const loans = await getActiveLoans()

// Count active
const count = await getActiveLoansCount()

// Mark as returned
const updated = await returnLoan(loanId)

// Check if overdue
const isOverdue = isLoanOverdue(dueDate)

// Get due info
const { daysRemaining, isOverdue } = getDueInfo(dueDate)
```

### reservationsService.js
```javascript
// Get all reservations
const reservations = await getAllReservations()

// Create reservation
const res = await createReservation({ bookId, memberId })

// Count active reservations
const count = await getActiveReservationsCount()

// Get recent (last N)
const recent = await getRecentReservations(5)
```

---

## Component Patterns

### LoadingSpinner
```javascript
<LoadingSpinner message="Loading books..." />
```

### ErrorAlert
```javascript
<ErrorAlert 
  error={error} 
  onRetry={loadBooks} 
/>
```

### EmptyState
```javascript
<EmptyState
  title="No books found"
  message="Try adjusting your filters"
  icon="book"
/>
```

### StatCard
```javascript
<StatCard
  title="Total Books"
  value={count}
  color="indigo"
  icon={<svg>...</svg>}
/>
```

---

## State Management Pattern

All pages follow this pattern:

```javascript
function Page() {
  // Data state
  const [data, setData] = useState([])
  
  // Filter state
  const [filter, setFilter] = useState('')
  
  // UI state
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  // Load on mount
  useEffect(() => {
    loadData()
  }, [])
  
  // Apply filters
  useEffect(() => {
    applyFilters()
  }, [filter, data])
  
  const loadData = async () => {
    try {
      setLoading(true)
      const result = await apiCall()
      setData(result)
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }
  
  // Render: Loading → Error → Empty → Data
  if (loading) return <LoadingSpinner />
  if (error) return <ErrorAlert onRetry={loadData} />
  if (data.length === 0) return <EmptyState />
  
  return <DataDisplay data={data} />
}
```

---

## Styling Notes

- **Tailwind CSS**: Uses utility-first approach
- **Colors**: Indigo (primary), Green (success), Red (error), Yellow (warning)
- **Responsive**: Mobile-first → tablet → desktop
- **Hover effects**: Shadow and background color transitions
- **Loading states**: Spinning border animation
- **Icons**: Inline SVG icons for better performance

---

## Running the Application

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

Navigate to `http://localhost:5173`

---

## Key Implementation Details

### 1. Error Handling
- All API calls wrapped in try-catch
- Errors displayed with user-friendly messages
- Retry button available on error state

### 2. Loading States
- Initial page load: Full page spinner
- Button actions: Spinner inside button
- Data refreshes: Maintains current data while loading new

### 3. Data Freshness
- Auto-reload after successful actions
- Dashboard data fetches in parallel for speed
- Search/filter happens client-side

### 4. Accessibility
- Semantic HTML elements
- Focus states on buttons
- ARIA-friendly error messages
- Keyboard navigable

### 5. Performance
- Parallel API calls where possible
- Client-side filtering (no extra API calls)
- Efficient re-renders with dependency arrays

---

## Testing the API Integration

### Dashboard Page
```bash
1. Navigate to /dashboard
2. Verify statistics cards show numbers > 0
3. Verify recent loans/reservations tables show data
4. Check error handling by using DevTools to block API
```

### Books Page
```bash
1. Navigate to /books
2. Verify book cards display
3. Test search functionality
4. Test filter checkbox
5. Click reserve (should create reservation)
6. Verify success message appears
```

### Loans Page
```bash
1. Navigate to /loans
2. Verify loans table shows data
3. Test status filter dropdown
4. Test search functionality
5. Click "Mark Returned" (should update loan)
6. Verify loan disappears from list (since it's now returned)
```

---

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| API returns `null` instead of object | Service files handle both response.data and response.data.data |
| Books not showing as available/unavailable | Check `isAvailable` field name in API response |
| Loans always showing as overdue | Verify date format is ISO 8601 (YYYY-MM-DD) |
| Search isn't working | Check that book/member names match API response field names |
| Button stays in loading state | Ensure API returns data in correct format |

---

## Next Steps / Extensions

- Add pagination for large data sets
- Add export to CSV/PDF features
- Add member profiles
- Add book details modal
- Add analytics charts
- Add notifications/toasts for actions
- Implement caching with React Query
- Add dark mode support

