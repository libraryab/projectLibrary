import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authService } from '../services/authService'
import { useAuth } from '../hooks/useAuth'

function RegisterPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // Validate name: non-empty, max 100 chars, no HTML tags
    const name = formData.name.trim()
    if (!name) {
      setError('Name is required')
      return
    }
    if (name.length > 100) {
      setError('Name must not exceed 100 characters')
      return
    }
    if (/<[^>]*>/.test(name)) {
      setError('Name cannot contain HTML tags')
      return
    }

    // Validate email: non-empty, valid format, max 255 chars
    const email = formData.email.trim()
    if (!email) {
      setError('Email is required')
      return
    }
    if (email.length > 255) {
      setError('Email must not exceed 255 characters')
      return
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address')
      return
    }

    // Validate password: min 8 chars, max 128 chars
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }
    if (formData.password.length > 128) {
      setError('Password must not exceed 128 characters')
      return
    }

    // Validate confirm password matches
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)

    try {
      const response = await authService.register({
        name,
        email,
        password: formData.password,
      })
      
      // Extract user data and role from response (handle different response structures)
      const userData = response.user || response
      const userWithRole = {
        ...userData,
        role: userData.role || userData.userRole || 'member'
      }
      
      console.log('Registration response:', response)
      console.log('User data:', userWithRole)
      
      login(userWithRole)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.')
      console.error('Registration error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Register</h2>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
              placeholder="John Doe"
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
              placeholder="you@example.com"
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
              placeholder="At least 8 characters"
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
              placeholder="Confirm your password"
              disabled={loading}
            />
          </div>

          <div className="rounded-lg border border-indigo-100 bg-indigo-50 p-4 text-sm text-indigo-900">
            New accounts are created as Library Member. A staff user can later promote or demote the account.
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
          >
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Already have an account?{' '}
            <a href="/login" className="text-indigo-600 hover:text-indigo-700 font-semibold">
              Login here
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage
