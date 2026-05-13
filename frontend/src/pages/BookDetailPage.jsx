import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import { getBookById, deleteBook } from '../services/booksService'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorAlert from '../components/ErrorAlert'

const getBookStatus = (book) => {
  if (!book.isAvailable) {
    return { label: '⊘ On Loan', className: 'bg-orange-100 text-orange-700' }
  }

  if ((book.activeReservationCount || 0) > 0) {
    return {
      label: `Reserved (${book.activeReservationCount})`,
      className: 'bg-yellow-100 text-yellow-800',
    }
  }

  return { label: '✓ Available', className: 'bg-green-100 text-green-700' }
}

export default function BookDetailPage() {
  const { bookId } = useParams()
  const navigate = useNavigate()
  const { user } = useContext(AuthContext)
  const [book, setBook] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)

  // Fetch book data
  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true)
        setError('')
        const data = await getBookById(bookId)
        setBook(data)
      } catch (err) {
        setError('Failed to load book. Please try again.')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchBook()
  }, [bookId])

  // Handle delete
  const handleDelete = async () => {
    try {
      setDeleting(true)
      setError('')
      await deleteBook(bookId)
      
      // Redirect to books page
      setTimeout(() => {
        navigate('/admin-books')
      }, 1000)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete book')
      setDeleting(false)
    }
  }

  if (loading) return <LoadingSpinner />

  if (error && !book) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <ErrorAlert 
            message={error}
            onRetry={() => window.location.reload()}
          />
        </div>
      </div>
    )
  }

  const isAdmin = user?.role === 'ADMIN' || user?.role === 'STAFF'

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 text-blue-600 hover:text-blue-800 font-medium"
        >
          ← Back
        </button>

        {error && (
          <ErrorAlert 
            message={error}
            onRetry={() => setError('')}
          />
        )}

        {/* Book Details Card */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Left side - Book Info */}
            <div className="md:col-span-2">
              <h1 className="text-4xl font-bold text-gray-800 mb-2">{book.title}</h1>
              <p className="text-xl text-gray-600 mb-4">by <span className="font-semibold">{book.author}</span></p>

              {/* Status Badge */}
              <div className="mb-6">
                {(() => {
                  const status = getBookStatus(book)
                  return (
                    <span className={`px-4 py-2 rounded-full text-sm font-semibold ${status.className}`}>
                      {status.label}
                    </span>
                  )
                })()}
              </div>

              {/* Details Grid */}
              <div className="space-y-4 mb-8">
                {book.isbn && (
                  <div>
                    <p className="text-sm text-gray-500 uppercase tracking-wide">ISBN</p>
                    <p className="text-lg text-gray-800 font-medium">{book.isbn}</p>
                  </div>
                )}

                {book.year && (
                  <div>
                    <p className="text-sm text-gray-500 uppercase tracking-wide">Publication Year</p>
                    <p className="text-lg text-gray-800 font-medium">{book.year}</p>
                  </div>
                )}

                {book.description && (
                  <div>
                    <p className="text-sm text-gray-500 uppercase tracking-wide">Description</p>
                    <p className="text-gray-700 leading-relaxed">{book.description}</p>
                  </div>
                )}
              </div>

              {/* Additional Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs text-gray-500">Book ID: <span className="font-mono">{book.id}</span></p>
                {book.createdAt && (
                  <p className="text-xs text-gray-500">Added: <span>{new Date(book.createdAt).toLocaleDateString()}</span></p>
                )}
                {(book.activeReservationCount || 0) > 0 && (
                  <p className="text-xs text-gray-500">Active Reservations: <span className="font-semibold">{book.activeReservationCount}</span></p>
                )}
              </div>
            </div>

            {/* Right side - Actions (Admin Only) */}
            {isAdmin && (
              <div className="md:col-span-1">
                <div className="bg-blue-50 rounded-lg p-6 sticky top-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Admin Actions</h3>
                  
                  <div className="space-y-3">
                    <button
                      onClick={() => navigate(`/admin-books/edit/${bookId}`)}
                      className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
                    >
                      Edit Book
                    </button>

                    <button
                      onClick={() => setDeleteConfirm(true)}
                      className="w-full px-4 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition"
                    >
                      Delete Book
                    </button>

                    <button
                      onClick={() => navigate('/admin-books')}
                      className="w-full px-4 py-3 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300 transition"
                    >
                      Back to List
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {deleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-sm mx-4">
              <h3 className="text-lg font-bold text-gray-800 mb-2">Delete Book?</h3>
              <p className="text-gray-600 mb-4">
                Are you sure you want to delete <strong>{book.title}</strong>? This action cannot be undone.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => setDeleteConfirm(false)}
                  disabled={deleting}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 disabled:opacity-50"
                >
                  {deleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
