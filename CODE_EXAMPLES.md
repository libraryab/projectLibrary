# 💡 Code Examples & Patterns

This document shows code patterns used throughout the implementation for learning and reference.

---

## React Hooks Patterns

### Pattern 1: Fetch Data on Mount
```javascript
function MyPage() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        setError(null)
        const result = await apiCall()
        setData(result)
      } catch (err) {
        setError(err)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, []) // Empty dependency = run once on mount

  // Render...
}
```

**Used in**: All 3 pages for initial data load

---

### Pattern 2: Refetch Data
```javascript
function MyPage() {
  const [data, setData] = useState([])

  const loadData = async () => {
    try {
      const result = await apiCall()
      setData(result)
    } catch (err) {
      setError(err)
    }
  }

  // Load on mount
  useEffect(() => {
    loadData()
  }, [])

  // Refetch when error alert clicks Retry
  return (
    <>
      {error && <ErrorAlert onRetry={loadData} />}
    </>
  )
}
```

**Used in**: Dashboard, Books, Loans pages

---

### Pattern 3: Real-time Search/Filter
```javascript
function MyPage() {
  const [allBooks, setAllBooks] = useState([])
  const [filteredBooks, setFilteredBooks] = useState([])
  const [searchQuery, setSearchQuery] = useState('')

  // Fetch all data on mount
  useEffect(() => {
    loadAllBooks()
  }, [])

  // Filter whenever data or search changes
  useEffect(() => {
    const filtered = allBooks.filter(book =>
      book.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
    setFilteredBooks(filtered)
  }, [searchQuery, allBooks]) // Both dependencies

  return (
    <>
      <input
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      {filteredBooks.map(book => (
        // Display filtered books
      ))}
    </>
  )
}
```

**Used in**: MemberBooksPage (search), LoansManagementPage (filter)

---

### Pattern 4: Async Action with Loading
```javascript
function MyComponent() {
  const [reservingBookId, setReservingBookId] = useState(null)

  const handleReserveBook = async (bookId) => {
    try {
      setReservingBookId(bookId) // Show loading on this button
      await createReservation(bookId)
      // Success - refresh data
      await loadBooks()
    } catch (err) {
      setError(err)
    } finally {
      setReservingBookId(null) // Hide loading
    }
  }

  return (
    <button
      onClick={() => handleReserveBook('b1')}
      disabled={reservingBookId === 'b1'} // Disable while loading
    >
      {reservingBookId === 'b1' ? (
        <span>Loading...</span>
      ) : (
        'Reserve Book'
      )}
    </button>
  )
}
```

**Used in**: MemberBooksPage (reserve), LoansManagementPage (return)

---

## State Management Patterns

### Pattern 1: Multiple State Values
```javascript
const [stats, setStats] = useState({
  totalBooks: 0,
  availableBooks: 0,
  activeLoans: 0,
  activeReservations: 0
})

// Update all at once
setStats({
  totalBooks: 100,
  availableBooks: 75,
  activeLoans: 25,
  activeReservations: 12
})

// Or update one
setStats(prev => ({
  ...prev,
  totalBooks: 100
}))
```

**Used in**: AdminDashboardPage for statistics

---

### Pattern 2: Loading/Error/Data States
```javascript
function MyPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [data, setData] = useState([])

  if (loading) return <LoadingSpinner />
  if (error) return <ErrorAlert error={error} onRetry={loadData} />
  if (data.length === 0) return <EmptyState />

  return <DataDisplay data={data} />
}
```

**Used in**: All 3 pages

---

## Axios Patterns

### Pattern 1: Simple GET Request
```javascript
import axios from 'axios'

const getAllBooks = async () => {
  try {
    const response = await axios.get('/api/v1/books')
    return response.data.data || response.data
  } catch (error) {
    console.error('Error fetching books:', error)
    throw error
  }
}
```

**Used in**: All service files

---

### Pattern 2: POST Request (Create)
```javascript
const createReservation = async (reservationData) => {
  try {
    const response = await axios.post(
      '/api/v1/reservations',
      reservationData // { bookId, memberId }
    )
    return response.data.data || response.data
  } catch (error) {
    console.error('Error creating reservation:', error)
    throw error
  }
}
```

**Used in**: reservationsService.js

---

### Pattern 3: PATCH Request (Update)
```javascript
const returnLoan = async (loanId) => {
  try {
    const response = await axios.patch(
      `/api/v1/loans/${loanId}/return`,
      {} // Empty body
    )
    return response.data.data || response.data
  } catch (error) {
    console.error(`Error returning loan ${loanId}:`, error)
    throw error
  }
}
```

**Used in**: loansService.js

---

## Tailwind CSS Patterns

### Pattern 1: Responsive Grid
```javascript
// 1 col on mobile, 2 on tablet, 3 on desktop
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {items.map(item => (
    <div key={item.id} className="bg-white rounded-lg shadow-md p-6">
      {/* Item content */}
    </div>
  ))}
</div>
```

**Used in**: MemberBooksPage (book cards), AdminDashboardPage (stat cards)

---

### Pattern 2: Conditional Styling
```javascript
<span
  className={`px-3 py-1 rounded-full text-xs font-semibold ${
    book.isAvailable
      ? 'bg-green-100 text-green-800'
      : 'bg-red-100 text-red-800'
  }`}
>
  {book.isAvailable ? 'Available' : 'Not Available'}
</span>
```

**Used in**: All pages for status badges

---

### Pattern 3: Button States
```javascript
<button
  onClick={handleClick}
  disabled={isLoading}
  className={`px-4 py-2 rounded-lg font-semibold transition ${
    isLoading
      ? 'bg-gray-200 text-gray-600 cursor-not-allowed'
      : 'bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer'
  }`}
>
  {isLoading ? 'Loading...' : 'Click me'}
</button>
```

**Used in**: All action buttons

---

### Pattern 4: Loading Spinner
```javascript
<div className="flex flex-col items-center justify-center py-12">
  <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
  <p className="mt-4 text-gray-600 font-medium">Loading...</p>
</div>
```

**Used in**: LoadingSpinner component

---

### Pattern 5: Hover Effects
```javascript
<div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
  {/* Content */}
</div>
```

**Used in**: StatCard, book cards, table rows

---

## Data Display Patterns

### Pattern 1: Table with Data
```javascript
<table className="w-full text-sm">
  <thead className="bg-gray-50">
    <tr>
      <th className="px-6 py-3 text-left text-gray-700 font-semibold">
        Name
      </th>
      <th className="px-6 py-3 text-left text-gray-700 font-semibold">
        Status
      </th>
    </tr>
  </thead>
  <tbody className="divide-y divide-gray-200">
    {items.map(item => (
      <tr key={item.id} className="hover:bg-gray-50">
        <td className="px-6 py-4 text-gray-900 font-medium">
          {item.name}
        </td>
        <td className="px-6 py-4 text-gray-600">
          {item.status}
        </td>
      </tr>
    ))}
  </tbody>
</table>
```

**Used in**: Dashboard (recent loans/reservations), LoansManagementPage (loans table)

---

### Pattern 2: Card with Content
```javascript
<div className="bg-white rounded-lg shadow-md overflow-hidden">
  {/* Header */}
  <div className="px-6 py-4 border-b border-gray-200">
    <h3 className="text-lg font-semibold text-gray-900">Title</h3>
  </div>

  {/* Content */}
  <div className="p-6">
    {isEmpty ? (
      <EmptyState />
    ) : (
      // Data display
    )}
  </div>
</div>
```

**Used in**: All pages for main content sections

---

### Pattern 3: Grid of Cards
```javascript
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {books.map(book => (
    <div key={book.id} className="bg-white rounded-lg shadow-md">
      <div className="h-48 bg-gradient-to-br from-indigo-400 to-blue-500">
        {/* Placeholder image */}
      </div>
      <div className="p-6">
        <h3 className="text-lg font-semibold mb-2">{book.title}</h3>
        <p className="text-sm text-gray-600 mb-4">by {book.author}</p>
        <button className="w-full bg-indigo-600 text-white py-2 rounded-lg">
          Action
        </button>
      </div>
    </div>
  ))}
</div>
```

**Used in**: MemberBooksPage (book cards)

---

## Error Handling Patterns

### Pattern 1: API Error with Retry
```javascript
const [error, setError] = useState(null)

const loadData = async () => {
  try {
    const result = await apiCall()
    setError(null)
    return result
  } catch (err) {
    setError(err)
    throw err
  }
}

return (
  <>
    {error && (
      <ErrorAlert
        error={error}
        onRetry={loadData}
      />
    )}
  </>
)
```

**Used in**: All pages

---

### Pattern 2: Error Message Display
```javascript
<div className="text-red-700 text-sm">
  {error?.response?.data?.message ||
    error?.message ||
    'An error occurred'}
</div>
```

**Used in**: ErrorAlert component

---

## Form Patterns

### Pattern 1: Search Input
```javascript
const [searchQuery, setSearchQuery] = useState('')

<input
  type="text"
  placeholder="Search..."
  value={searchQuery}
  onChange={(e) => setSearchQuery(e.target.value)}
  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
/>
```

**Used in**: MemberBooksPage, LoansManagementPage

---

### Pattern 2: Select Dropdown
```javascript
const [filterStatus, setFilterStatus] = useState('all')

<select
  value={filterStatus}
  onChange={(e) => setFilterStatus(e.target.value)}
  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
>
  <option value="all">All</option>
  <option value="active">Active</option>
  <option value="overdue">Overdue</option>
</select>
```

**Used in**: LoansManagementPage

---

### Pattern 3: Checkbox
```javascript
const [showAvailableOnly, setShowAvailableOnly] = useState(false)

<label className="flex items-center cursor-pointer">
  <input
    type="checkbox"
    checked={showAvailableOnly}
    onChange={(e) => setShowAvailableOnly(e.target.checked)}
    className="w-4 h-4 text-indigo-600 rounded"
  />
  <span className="ml-3 text-sm font-medium text-gray-700">
    Show available only
  </span>
</label>
```

**Used in**: MemberBooksPage

---

## Utility Function Patterns

### Pattern 1: Date Formatting
```javascript
const dueDate = new Date(loan.dueDate).toLocaleDateString()
// "5/15/2026"

const created = new Date(reservation.createdAt).toLocaleDateString()
// "5/9/2026"
```

**Used in**: All pages for displaying dates

---

### Pattern 2: Date Calculations
```javascript
const getDueInfo = (dueDate) => {
  const due = new Date(dueDate)
  const today = new Date()
  const diffTime = due - today
  const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  return {
    daysRemaining,
    isOverdue: daysRemaining < 0
  }
}

// Usage:
const { isOverdue, daysRemaining } = getDueInfo(loan.dueDate)
// isOverdue = true
// daysRemaining = -5 (5 days overdue)
```

**Used in**: LoansManagementPage

---

### Pattern 3: Array Filtering
```javascript
// Get only available books
const available = books.filter(book => book.isAvailable === true)

// Get only active loans
const active = loans.filter(loan => loan.returnDate === null)

// Search and filter
const filtered = books.filter(book =>
  book.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
  (!showAvailableOnly || book.isAvailable === true)
)
```

**Used in**: All service files and pages

---

### Pattern 4: Array Sorting
```javascript
// Sort by newest first
const recent = reservations
  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  .slice(0, 5) // Get last 5
```

**Used in**: reservationsService.js

---

## Icon Patterns

### Pattern 1: Inline SVG Icons
```javascript
<svg className="w-6 h-6 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
</svg>
```

**Used in**: ErrorAlert, EmptyState, components

---

### Pattern 2: Icon Selection
```javascript
{icon === 'inbox' && (
  <svg className="w-16 h-16 text-gray-400">
    {/* inbox icon SVG */}
  </svg>
)}
{icon === 'book' && (
  <svg className="w-16 h-16 text-gray-400">
    {/* book icon SVG */}
  </svg>
)}
```

**Used in**: EmptyState component

---

## Component Composition

### Pattern 1: Parent Pass Data to Child
```javascript
// Parent (AdminDashboardPage.jsx)
const [recentLoans, setRecentLoans] = useState([])

return (
  <RecentLoansTable loans={recentLoans} />
)

// Child (Custom component)
function RecentLoansTable({ loans }) {
  return (
    <table>
      {loans.map(loan => (
        <tr key={loan.id}>
          {/* Display loan */}
        </tr>
      ))}
    </table>
  )
}
```

**Used in**: Page components passing data to child elements

---

### Pattern 2: Callback from Child to Parent
```javascript
// Parent
const handleReturnLoan = async (loanId) => {
  await returnLoan(loanId)
  await loadLoans() // Refresh
}

return (
  <LoansTable loans={loans} onReturn={handleReturnLoan} />
)

// Child
function LoansTable({ loans, onReturn }) {
  return (
    <button onClick={() => onReturn(loan.id)}>
      Mark Returned
    </button>
  )
}
```

**Used in**: LoansManagementPage (mark returned button)

---

## Best Practices Demonstrated

✅ **Separation of Concerns**
- Service files handle API
- Components handle UI
- Hooks handle state

✅ **DRY (Don't Repeat Yourself)**
- Reusable components (LoadingSpinner, ErrorAlert, etc.)
- Service functions shared across pages
- Common patterns used consistently

✅ **Error Handling**
- Try-catch blocks in all API calls
- User-friendly error messages
- Retry mechanisms

✅ **Performance**
- Proper dependency arrays in useEffect
- Avoid unnecessary re-renders
- Efficient filtering and searching

✅ **Accessibility**
- Semantic HTML
- Focus states
- Proper contrast
- Keyboard navigable

✅ **Responsive Design**
- Mobile-first approach
- Tailwind breakpoints (sm, md, lg)
- Flexible layouts

---

These patterns are used throughout the codebase and can be adapted for your future components!

