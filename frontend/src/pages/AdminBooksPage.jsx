import { useState, useEffect, useRef } from 'react'
import flatpickr from 'flatpickr'
import 'flatpickr/dist/flatpickr.min.css'
import { useNavigate } from 'react-router-dom'
import { getAllBooks, deleteBook } from '../services/booksService'
import { createLoan, returnLoan } from '../services/loansService'
import apiClient from '../services/authService'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorAlert from '../components/ErrorAlert'
import EmptyState from '../components/EmptyState'

const getBookStatus = (book) => {
  if (!book.isAvailable) {
    return { label: 'Loaned', className: 'bg-gray-100 text-gray-700' }
  }

  if ((book.activeReservationCount || 0) > 0) {
    return {
      label: `Reserved (${book.activeReservationCount})`,
      className: 'bg-yellow-100 text-yellow-700',
    }
  }

  return { label: 'Available', className: 'bg-green-100 text-green-700' }
}

const formatDateDDMMYYYY = (dateValue) => {
  const date = new Date(dateValue)
  if (Number.isNaN(date.getTime())) return ''

  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  return `${day}/${month}/${year}`
}

const parseDDMMYYYYToISO = (value) => {
  const trimmed = String(value || '').trim()
  const slashMatch = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(trimmed)
  const digitsMatch = /^(\d{2})(\d{2})(\d{4})$/.exec(trimmed)
  const match = slashMatch || digitsMatch
  if (!match) return null

  const [, day, month, year] = match
  const date = new Date(Number(year), Number(month) - 1, Number(day))
  if (
    date.getFullYear() !== Number(year) ||
    date.getMonth() !== Number(month) - 1 ||
    date.getDate() !== Number(day)
  ) {
    return null
  }

  return date.toISOString()
}

const toISODateString = (value) => {
  if (!value) return null
  // If value already in yyyy-mm-dd (date input), convert to ISO
  const isoDateMatch = /^\d{4}-\d{2}-\d{2}$/.test(value)
  if (isoDateMatch) return new Date(value).toISOString()

  // Try dd/mm/yyyy
  const parsed = parseDDMMYYYYToISO(value)
  if (parsed) return parsed

  return null
}

const toInputDateValue = (value) => {
  if (!value) return ''
  // If already yyyy-mm-dd, return as-is
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value

  // If ISO string, convert to yyyy-mm-dd
  try {
    const d = new Date(value)
    if (Number.isNaN(d.getTime())) return ''
    const yyyy = d.getFullYear()
    const mm = String(d.getMonth() + 1).padStart(2, '0')
    const dd = String(d.getDate()).padStart(2, '0')
    return `${yyyy}-${mm}-${dd}`
  } catch (e) {
    return ''
  }
}

const addDaysDDMMYYYY = (days) => {
  const d = new Date(Date.now() + days * 24 * 60 * 60 * 1000)
  return formatDateDDMMYYYY(d.toISOString())
}

const ddmmToYYYYMMDD = (ddmm) => {
  if (!ddmm) return ''
  const m = /^\s*(\d{2})\/(\d{2})\/(\d{4})\s*$/.exec(ddmm)
  if (!m) return ''
  const [, day, month, year] = m
  return `${year}-${month}-${day}`
}

const yyyyMMddToDDMMYYYY = (val) => {
  if (!val) return ''
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(val)
  if (!m) return ''
  const [, year, month, day] = m
  return `${day}/${month}/${year}`
}

const formatDigitsAsDDMMYYYY = (value) => {
  const digits = String(value || '').replace(/\D/g, '').slice(0, 8)

  if (digits.length <= 2) return digits
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`
}

const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || '').trim())

const isFutureDate = (isoDateValue) => {
  if (!isoDateValue) return false

  const date = new Date(isoDateValue)
  if (Number.isNaN(date.getTime())) return false

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  date.setHours(0, 0, 0, 0)

  return date > today
}

export default function AdminBooksPage() {
  const [books, setBooks] = useState([])
  const [filteredBooks, setFilteredBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState('')
  const [loanModalBookId, setLoanModalBookId] = useState(null)
  const [loanMemberEmail, setLoanMemberEmail] = useState('')
  const [loanDueDate, setLoanDueDate] = useState('')
  const [loanProcessing, setLoanProcessing] = useState(false)
  const [loanError, setLoanError] = useState('')
  const navigate = useNavigate()
  const dateInputRef = useRef(null)
  const fpRef = useRef(null)

  const loadBooks = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await getAllBooks()
      setBooks(data || [])
    } catch (err) {
      setError('Failed to load books. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleDueInputChange = (value) => {
    // Keep only digits and format them as dd/mm/yyyy while typing.
    setLoanDueDate(formatDigitsAsDDMMYYYY(value))
  }

  // Initialize flatpickr once on mount to avoid recreating it while typing
  useEffect(() => {
    if (!dateInputRef.current) return
    if (fpRef.current) {
      try { fpRef.current.destroy() } catch (e) {}
      fpRef.current = null
    }

    fpRef.current = flatpickr(dateInputRef.current, {
      dateFormat: 'd/m/Y',
      allowInput: true,
      altInput: false,
      defaultDate: loanDueDate ? ddmmToYYYYMMDD(loanDueDate) : null,
      onChange: (selectedDates, dateStr) => {
        setLoanDueDate(dateStr)
      }
    })

    return () => {
      if (fpRef.current) {
        try { fpRef.current.destroy() } catch (e) {}
        fpRef.current = null
      }
    }
    // run only once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Sync typed/externally-updated loanDueDate into flatpickr when input is not focused
  useEffect(() => {
    if (!fpRef.current) return
    const el = dateInputRef.current
    if (!el) return
    const isFocused = document.activeElement === el
    try {
      if (!isFocused) {
        if (!loanDueDate) {
          fpRef.current.clear()
        } else {
          const ymd = ddmmToYYYYMMDD(loanDueDate)
          if (ymd) fpRef.current.setDate(ymd, true)
        }
      }
    } catch (e) {
      // ignore sync errors
    }
  }, [loanDueDate])

  // Fetch books
  useEffect(() => {
    loadBooks()
  }, [])

  // Handle search
  useEffect(() => {
    const filtered = books.filter((book) => {
      const authorText = book.author || book.authors?.map((author) => author.name).join(', ') || ''

      return (
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        authorText.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (book.isbn && book.isbn.includes(searchTerm))
      )
    })
    setFilteredBooks(filtered)
  }, [searchTerm, books])

  // Handle delete
  const handleDelete = async (bookId) => {
    try {
      setDeleting(true)
      setDeleteError('')
      await deleteBook(bookId)
      
      // Update local state
      setBooks(books.filter(b => b.id !== bookId))
      setDeleteConfirm(null)
    } catch (err) {
      setDeleteError(err.response?.data?.message || 'Failed to delete book')
    } finally {
      setDeleting(false)
    }
  }

  // Handle loan creation
  const handleLoanSubmit = async () => {
    if (!loanModalBookId) return
    setLoanProcessing(true)
    setLoanError('')

    try {
      const normalizedEmail = loanMemberEmail.trim()
      if (!isValidEmail(normalizedEmail)) {
        setLoanError('Please provide a valid member email.')
        return
      }

      const normalizedDueDate = loanDueDate?.trim()
      if (!normalizedDueDate) {
        setLoanError('Please provide a due date in dd/mm/yyyy.')
        return
      }

      // Find member by email
      const resp = await apiClient.get(`/members?search=${encodeURIComponent(normalizedEmail)}`)
      const membersData = resp.data?.value || resp.data?.value || resp.data || []
      const member = Array.isArray(membersData) ? membersData[0] : undefined
      if (!member) {
        setLoanError('Member not found. Please verify the email.')
        return
      }

      // loanDueDate is stored as dd/mm/yyyy in the visible input. Convert to ISO.
      const due = parseDDMMYYYYToISO(normalizedDueDate)

      if (!due) {
        setLoanError('Please provide a valid date (use the picker or dd/mm/yyyy).')
        return
      }

      if (!isFutureDate(due)) {
        setLoanError('Please provide a due date later than today.')
        return
      }

      await createLoan({ bookCopyId: loanModalBookId, memberId: member.id, bookId: loanModalBookId, dueDate: due })

      await loadBooks()
      // Notify other parts of the app to refresh (dashboard, loans list)
      window.dispatchEvent(new CustomEvent('libraryDataChanged'))
      setLoanModalBookId(null)
      setLoanMemberEmail('')
      setLoanDueDate('')
    } catch (err) {
      console.error(err)
      setLoanError(err.response?.data?.message || 'Failed to create loan')
    } finally {
      setLoanProcessing(false)
    }
  }

  // Handle returning an active loan for a book
  const handleReturnLoan = async (book) => {
    setLoanProcessing(true)
    setLoanError('')
    try {
      const activeLoanId = book.loans && book.loans.length > 0 ? book.loans[0].id : null
      if (!activeLoanId) {
        setLoanError('No active loan found for this book')
        return
      }

      await returnLoan(activeLoanId)

      await loadBooks()
      // Notify other parts of the app to refresh (dashboard, loans list)
      window.dispatchEvent(new CustomEvent('libraryDataChanged'))
    } catch (err) {
      console.error(err)
      setLoanError(err.response?.data?.message || 'Failed to return loan')
    } finally {
      setLoanProcessing(false)
    }
  }

  if (loading) return <LoadingSpinner />

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Book Management</h1>
          <button
            onClick={() => navigate('/admin-add-books')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
          >
            + Add Book
          </button>
        </div>

        {/* Error Messages */}
        {error && (
          <ErrorAlert 
            message={error}
            onRetry={() => window.location.reload()}
          />
        )}

        {deleteError && (
          <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-lg flex justify-between items-center">
            <span>{deleteError}</span>
            <button onClick={() => setDeleteError('')} className="text-red-600 hover:text-red-800">✕</button>
          </div>
        )}

        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by title, author, or ISBN..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        {/* Books Table or Empty State */}
        {filteredBooks.length === 0 ? (
          <EmptyState
            title={searchTerm ? "No books found" : "No books yet"}
            description={searchTerm 
              ? "Try adjusting your search terms"
              : "Start by adding your first book to the library"
            }
            action={!searchTerm && {
              label: "Add First Book",
              onClick: () => navigate('/admin-add-books')
            }}
          />
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Title</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Author</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">ISBN</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Year</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredBooks.map(book => (
                  <tr key={book.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-800 font-medium">{book.title}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {book.author || book.authors?.map((author) => author.name).join(', ') || '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{book.isbn || '-'}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{book.year || '-'}</td>
                    <td className="px-6 py-4">
                      {(() => {
                        const status = getBookStatus(book)
                        return (
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${status.className}`}>
                            {status.label}
                          </span>
                        )
                      })()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => {
                            if (book.isAvailable) {
                              setLoanModalBookId(book.id)
                            } else {
                              handleReturnLoan(book)
                            }
                          }}
                          className={`px-3 py-1 rounded text-sm font-medium transition ${book.isAvailable ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}
                        >
                          {book.isAvailable ? 'Loan' : 'Return'}
                        </button>

                        <button
                          onClick={() => navigate(`/admin-books/edit/${book.id}`)}
                          className="px-3 py-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 text-sm font-medium transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => navigate(`/books/${book.id}`)}
                          className="px-3 py-1 bg-gray-100 text-gray-600 rounded hover:bg-gray-200 text-sm font-medium transition"
                        >
                          View
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(book.id)}
                          className="px-3 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200 text-sm font-medium transition"
                          disabled={deleting}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Stats */}
        {books.length > 0 && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg p-6 shadow">
              <p className="text-gray-500 text-sm">Total Books</p>
              <p className="text-3xl font-bold text-gray-800">{books.length}</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow">
              <p className="text-gray-500 text-sm">Available</p>
              <p className="text-3xl font-bold text-green-600">{books.filter(b => b.isAvailable).length}</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow">
              <p className="text-gray-500 text-sm">On Loan</p>
              <p className="text-3xl font-bold text-orange-600">{books.filter(b => !b.isAvailable).length}</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow">
              <p className="text-gray-500 text-sm">Results Shown</p>
              <p className="text-3xl font-bold text-blue-600">{filteredBooks.length}</p>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-sm mx-4">
              <h3 className="text-lg font-bold text-gray-800 mb-2">Delete Book?</h3>
              <p className="text-gray-600 mb-6">
                This action cannot be undone. The book will be permanently removed from the library.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  disabled={deleting}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  disabled={deleting}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 disabled:opacity-50"
                >
                  {deleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        )}
        {/* Loan Modal */}
        {loanModalBookId && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-bold text-gray-800 mb-2">Create Loan</h3>
              <p className="text-gray-600 mb-4">Enter a valid member email and a due date to create a loan for this book.</p>

              <div className="mb-3">
                <label className="block text-sm text-gray-700 mb-1">Member Email</label>
                <input
                  type="email"
                  value={loanMemberEmail}
                  onChange={(e) => setLoanMemberEmail(e.target.value)}
                  placeholder="member@example.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                />
              </div>

                      <div className="mb-4 relative">
                        <label className="block text-sm text-gray-700 mb-1">Due Date</label>
                        <div className="flex gap-2 items-center">
                          <input
                            ref={dateInputRef}
                            type="text"
                            value={loanDueDate}
                            onChange={(e) => handleDueInputChange(e.target.value)}
                            placeholder="dd/mm/yyyy"
                            inputMode="numeric"
                            className="flex-1 px-3 py-2 border border-gray-300 rounded"
                          />
                          <button
                            type="button"
                            onClick={() => setLoanDueDate(addDaysDDMMYYYY(7))}
                            className="px-3 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                          >
                            +7d
                          </button>
                          <button
                            type="button"
                            onClick={() => setLoanDueDate(addDaysDDMMYYYY(14))}
                            className="px-3 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                          >
                            +14d
                          </button>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                // Open flatpickr picker if available, otherwise focus input
                                if (fpRef.current && typeof fpRef.current.open === 'function') {
                                  fpRef.current.open()
                                } else if (dateInputRef.current) {
                                  dateInputRef.current.focus()
                                }
                              }}
                              className="px-3 py-2 bg-white border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
                            >
                              📅
                            </button>
                            {/* removed native type=date input; flatpickr is attached to the visible text input via ref */}
                          </div>
                        </div>
                        <p className="mt-1 text-xs text-gray-500">Enter date as dd/mm/yyyy or use quick buttons</p>
                      </div>

              {loanError && <div className="mb-3 text-red-600">{loanError}</div>}

              <div className="flex gap-3">
                <button
                  onClick={() => setLoanModalBookId(null)}
                  disabled={loanProcessing}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLoanSubmit}
                  disabled={loanProcessing}
                  className="flex-1 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:opacity-50"
                >
                  {loanProcessing ? 'Processing...' : 'Create Loan'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
