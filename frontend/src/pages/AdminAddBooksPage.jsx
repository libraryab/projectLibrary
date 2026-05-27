import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createBook } from '../services/booksService'
import { createLibrary, getAllLibraries } from '../services/librariesService'

function AdminAddBooksPage() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    description: '',
    year: new Date().getFullYear(),
  })

  const [loading, setLoading] = useState(false)
  const [initializing, setInitializing] = useState(true)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [message, setMessage] = useState('')
  const [libraryId, setLibraryId] = useState('')

  useEffect(() => {
    const ensureLibrary = async () => {
      try {
        const data = await getAllLibraries()
        const libraries = Array.isArray(data) ? data : []

        if (libraries.length > 0) {
          setLibraryId(libraries[0].id)
          return
        }

        const createdLibrary = await createLibrary({
          name: 'Main Library',
          location: 'Default Location',
        })

        setLibraryId(createdLibrary.id)
      } catch (err) {
        console.error('Error preparing library context:', err)
        setError('Failed to prepare library context')
      } finally {
        setInitializing(false)
      }
    }

    ensureLibrary()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'year' ? parseInt(value, 10) : value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      if (!formData.title.trim() || !formData.author.trim()) {
        setError('Title and Author are required')
        setLoading(false)
        return
      }

      if (!libraryId) {
        setError('Library is not ready yet. Please try again.')
        setLoading(false)
        return
      }

      await createBook({
        title: formData.title.trim(),
        author: formData.author.trim(),
        isbn: formData.isbn.trim(),
        description: formData.description.trim(),
        year: formData.year,
        libraryId,
      })

      setSuccess(true)
      setMessage(`Book "${formData.title}" added successfully!`)

      setFormData({
        title: '',
        author: '',
        isbn: '',
        description: '',
        year: new Date().getFullYear(),
      })

      setTimeout(() => {
        setSuccess(false)
        setMessage('')
        navigate('/admin-books')
      }, 3000)
    } catch (err) {
      console.error('Error adding book:', err)
      setError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        'Failed to add book. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Add New Book</h2>
        <p className="text-gray-600 mt-2">
          Add a new book to the library collection.
        </p>
      </div>

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-800 flex items-center gap-3">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          {message}
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800 flex items-center gap-3">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          {error}
        </div>
      )}

      {initializing && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-blue-800">
          Preparing library context...
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-8 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Book Title <span className="text-red-600">*</span>
            </label>
            <input
              id="title"
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter book title"
              required
              disabled={loading}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition disabled:bg-gray-50"
            />
          </div>

          <div>
            <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-2">
              Author <span className="text-red-600">*</span>
            </label>
            <input
              id="author"
              type="text"
              name="author"
              value={formData.author}
              onChange={handleChange}
              placeholder="Enter author name"
              required
              disabled={loading}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition disabled:bg-gray-50"
            />
          </div>

          <div>
            <label htmlFor="isbn" className="block text-sm font-medium text-gray-700 mb-2">
              ISBN (Optional)
            </label>
            <input
              id="isbn"
              type="text"
              name="isbn"
              value={formData.isbn}
              onChange={handleChange}
              placeholder="Enter ISBN number"
              disabled={loading}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition disabled:bg-gray-50"
            />
          </div>

          <div>
            <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-2">
              Publication Year
            </label>
            <input
              id="year"
              type="number"
              name="year"
              value={formData.year}
              onChange={handleChange}
              min="1800"
              max={new Date().getFullYear()}
              disabled={loading}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition disabled:bg-gray-50"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description (Optional)
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter book description"
              rows="5"
              disabled={loading}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition resize-none disabled:bg-gray-50"
            ></textarea>
          </div>

          <input type="hidden" name="libraryId" value={libraryId} readOnly />

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading || initializing}
              className={`px-6 py-3 rounded-lg font-semibold transition duration-200 ${
                loading || initializing
                  ? 'bg-gray-200 text-gray-600 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer'
              }`}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="inline-block w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></span>
                  Adding...
                </span>
              ) : (
                'Add Book to Library'
              )}
            </button>

            <button
              type="reset"
              disabled={loading}
              onClick={() => {
                setFormData({
                  title: '',
                  author: '',
                  isbn: '',
                  description: '',
                  year: new Date().getFullYear(),
                })
              }}
              className={`px-6 py-3 rounded-lg font-semibold transition duration-200 ${
                loading
                  ? 'bg-gray-200 text-gray-600 cursor-not-allowed'
                  : 'bg-gray-300 hover:bg-gray-400 text-gray-800 cursor-pointer'
              }`}
            >
              Clear Form
            </button>
          </div>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Form Notes:</h3>
          <ul className="text-sm text-gray-600 space-y-2">
            <li>✓ <span className="text-red-600">*</span> = Required field</li>
            <li>✓ The library is selected automatically behind the scenes</li>
            <li>✓ If no library exists, one is created automatically</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default AdminAddBooksPage
