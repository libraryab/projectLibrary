import { useState } from 'react'
import ErrorAlert from './ErrorAlert'
import LoadingSpinner from './LoadingSpinner'

export default function BookForm({ 
  initialData = {}, 
  onSubmit, 
  isLoading = false,
  submitButtonText = 'Add Book',
  title = 'Add New Book'
}) {
  const [formData, setFormData] = useState({
    title: initialData.title || '',
    author: initialData.author || '',
    isbn: initialData.isbn || '',
    description: initialData.description || '',
    year: initialData.year || new Date().getFullYear(),
    isAvailable: initialData.isAvailable ?? true,
  })

  const [errors, setErrors] = useState({})
  const [submitError, setSubmitError] = useState('')

  // Validate form
  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.title.trim()) newErrors.title = 'Title is required'
    if (!formData.author.trim()) newErrors.author = 'Author is required'
    if (formData.year && (isNaN(formData.year) || formData.year < 1000 || formData.year > new Date().getFullYear())) {
      newErrors.year = `Year must be between 1000 and ${new Date().getFullYear()}`
    }
    if (formData.isbn && formData.isbn.trim().length > 0 && !/^[0-9-]{10,17}$/.test(formData.isbn.trim())) {
      newErrors.isbn = 'Invalid ISBN format'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitError('')

    if (!validateForm()) {
      return
    }

    try {
      await onSubmit(formData)
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'An error occurred'
      setSubmitError(message)
    }
  }

  if (isLoading) return <LoadingSpinner />

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">{title}</h1>

          {submitError && (
            <ErrorAlert 
              message={submitError} 
              onRetry={() => setSubmitError('')}
            />
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter book title"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${
                  errors.title ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
            </div>

            {/* Author */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Author *
              </label>
              <input
                type="text"
                name="author"
                value={formData.author}
                onChange={handleChange}
                placeholder="Enter author name"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${
                  errors.author ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.author && <p className="text-red-500 text-sm mt-1">{errors.author}</p>}
            </div>

            {/* ISBN */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ISBN
              </label>
              <input
                type="text"
                name="isbn"
                value={formData.isbn}
                onChange={handleChange}
                placeholder="Enter ISBN (optional)"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${
                  errors.isbn ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.isbn && <p className="text-red-500 text-sm mt-1">{errors.isbn}</p>}
            </div>

            {/* Publication Year */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Publication Year
              </label>
              <input
                type="number"
                name="year"
                value={formData.year}
                onChange={handleChange}
                placeholder="Enter publication year"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${
                  errors.year ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.year && <p className="text-red-500 text-sm mt-1">{errors.year}</p>}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter book description (optional)"
                rows="4"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* Availability */}
            <div className="flex items-center">
              <input
                type="checkbox"
                name="isAvailable"
                id="isAvailable"
                checked={formData.isAvailable}
                onChange={handleChange}
                className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
              <label htmlFor="isAvailable" className="ml-2 text-sm font-medium text-gray-700">
                Available for loan
              </label>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition"
              >
                {isLoading ? 'Saving...' : submitButtonText}
              </button>
              <button
                type="button"
                onClick={() => window.history.back()}
                className="flex-1 py-3 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
