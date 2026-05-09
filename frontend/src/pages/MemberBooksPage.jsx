import { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorAlert from '../components/ErrorAlert'
import EmptyState from '../components/EmptyState'
import {
  getAllBooks,
  getAvailableBooks,
  searchBooksByTitle
} from '../services/booksService'
import { createLoan } from '../services/loansService'

function MemberBooksPage() {
  // State for books
  const [allBooks, setAllBooks] = useState([])
  const [filteredBooks, setFilteredBooks] = useState([])

  // State for filters
  const [searchQuery, setSearchQuery] = useState('')
  const [showAvailableOnly, setShowAvailableOnly] = useState(false)

  // State for UI
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [loaningBookId, setLoaningBookId] = useState(null)
  const [successMessage, setSuccessMessage] = useState('')

  const { user } = useAuth()

  // Load books on mount
  useEffect(() => {
    loadBooks()
  }, [])

  // Filter books when search or filter changes
  useEffect(() => {
    applyFilters()
  }, [searchQuery, showAvailableOnly, allBooks])

  const loadBooks = async () => {
    try {
      setLoading(true)
      setError(null)
      const booksData = await getAllBooks()
      setAllBooks(booksData || [])
    } catch (err) {
      console.error('Failed to load books:', err)
      setError(err)
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = async () => {
    try {
      let filtered = allBooks

      // Apply search filter
      if (searchQuery.trim()) {
        filtered = filtered.filter(book =>
          book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (book.author && book.author.toLowerCase().includes(searchQuery.toLowerCase()))
        )
      }

      // Apply availability filter
      if (showAvailableOnly) {
        filtered = filtered.filter(book => book.isAvailable === true)
      }

      setFilteredBooks(filtered)
    } catch (err) {
      console.error('Filter error:', err)
    }
  }

  const handleLoanBook = async (bookId) => {
    try {
      setLoaningBookId(bookId)
      setError(null)

      if (!user?.id) {
        setError(new Error('You must be logged in to loan a book'))
        setLoaningBookId(null)
        return
      }

      // Create loan request
      const response = await createLoan({
        bookId,
        memberId: user.id
      })

      // Show success message
      setSuccessMessage('Book loaned successfully! Return it before the due date.')
      setTimeout(() => setSuccessMessage(''), 3000)

      // Reload books to update availability
      loadBooks()
    } catch (err) {
      console.error('Failed to loan book:', err)
      setError(err)
    } finally {
      setLoaningBookId(null)
    }
  }

  if (loading) return <LoadingSpinner message="Loading books..." />

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Browse & Loan Books</h2>
        <p className="text-gray-600 mt-2">
          Browse our collection and loan books for yourself.
        </p>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-800 flex items-center gap-3">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          {successMessage}
        </div>
      )}

      {/* Error Alert */}
      {error && <ErrorAlert error={error} onRetry={loadBooks} />}

      {/* Filter Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search Input */}
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
              Search by title or author
            </label>
            <input
              id="search"
              type="text"
              placeholder="Enter book title or author..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
            />
          </div>

          {/* Availability Filter */}
          <div className="flex items-end">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={showAvailableOnly}
                onChange={(e) => setShowAvailableOnly(e.target.checked)}
                className="w-4 h-4 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500"
              />
              <span className="ml-3 text-sm font-medium text-gray-700">
                Show available books only
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* Books Grid */}
      {filteredBooks.length === 0 ? (
        <EmptyState
          title={
            searchQuery || showAvailableOnly
              ? 'No books found'
              : 'No books available'
          }
          message={
            searchQuery || showAvailableOnly
              ? 'Try adjusting your search or filters.'
              : 'There are no books in the library at the moment.'
          }
          icon="book"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBooks.map((book) => (
            <div
              key={book.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200"
            >
              {/* Book Cover Placeholder */}
              <div className="bg-gradient-to-br from-indigo-400 to-blue-500 h-48 flex items-center justify-center">
                <svg
                  className="w-20 h-20 text-white opacity-75"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.669 0-3.218.51-4.5 1.385A7.968 7.968 0 009 4.804z" />
                </svg>
              </div>

              {/* Book Info */}
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                  {book.title}
                </h3>

                <p className="text-sm text-gray-600 mb-4">
                  by {book.author || 'Unknown Author'}
                </p>

                {/* Availability Status */}
                <div className="mb-4">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                      book.isAvailable
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {book.isAvailable ? 'Available' : 'Not Available'}
                  </span>
                </div>

                {/* Book Description */}
                {book.description && (
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {book.description}
                  </p>
                )}

                {/* Loan Button */}
                <button
                  onClick={() => handleLoanBook(book.id)}
                  disabled={!book.isAvailable || loaningBookId === book.id}
                  className={`w-full py-2 px-4 rounded-lg font-semibold transition duration-200 ${
                    book.isAvailable
                      ? 'bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer'
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  } ${loaningBookId === book.id ? 'opacity-75' : ''}`}
                >
                  {loaningBookId === book.id ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      Loaning...
                    </span>
                  ) : book.isAvailable ? (
                    'Loan Book'
                  ) : (
                    'Not Available'
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Results Count */}
      {filteredBooks.length > 0 && (
        <div className="text-center text-gray-600 py-4">
          Showing {filteredBooks.length} of {allBooks.length} books
        </div>
      )}

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">How to Loan Books</h3>
        <ul className="text-blue-800 space-y-2 text-sm">
          <li>✓ Find a book you want to loan</li>
          <li>✓ Click "Loan Book" button (only available books can be loaned)</li>
          <li>✓ The book will be added to your loans with a due date</li>
          <li>✓ Check <strong>My Loans</strong> to see all your loans and due dates</li>
          <li>✓ Return books before the due date to avoid penalties</li>
        </ul>
      </div>
    </div>
  )
}

export default MemberBooksPage
