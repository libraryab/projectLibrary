import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getBookById, updateBook } from '../services/booksService'
import BookForm from '../components/BookForm'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorAlert from '../components/ErrorAlert'

export default function AdminEditBooksPage() {
  const { bookId } = useParams()
  const navigate = useNavigate()
  const [book, setBook] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState('')

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

  // Handle form submission
  const handleSubmit = async (formData) => {
    try {
      setSubmitting(true)
      setError('')
      setSuccess('')

      await updateBook(bookId, formData)
      setSuccess('Book updated successfully!')

      // Redirect after 1.5 seconds
      setTimeout(() => {
        navigate('/admin-books')
      }, 1500)
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to update book'
      setError(message)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <LoadingSpinner />

  if (error && !book) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4">
          <ErrorAlert 
            message={error}
            onRetry={() => window.location.reload()}
          />
        </div>
      </div>
    )
  }

  return (
    <>
      {success && (
        <div className="fixed top-4 right-4 p-4 bg-green-100 text-green-700 rounded-lg shadow-lg">
          {success}
        </div>
      )}
      <BookForm
        initialData={book}
        onSubmit={handleSubmit}
        isLoading={submitting}
        submitButtonText="Update Book"
        title="Edit Book"
      />
    </>
  )
}
