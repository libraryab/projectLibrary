import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'

function MainLayout({ children }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { logout } = useAuth()
  const { userRole, user } = useContext(AuthContext)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  // Navigation links based on role
  const isAdminStaff = userRole === 'admin' && String(user?.staffType || '').toUpperCase() === 'ADMIN'

  const navLinks = userRole === 'admin'
    ? [
        { path: '/admin-dashboard', label: 'Dashboard', icon: '📊' },
        { path: '/admin-books', label: 'Manage Books', icon: '📚' },
        { path: '/admin-loans', label: 'Manage Loans', icon: '📋' },
        { path: '/admin-add-books', label: 'Add Books', icon: '➕' },
        ...(isAdminStaff ? [{ path: '/admin-users', label: 'Manage Users', icon: '👥' }] : [])
      ]
    : [
        { path: '/books', label: 'Browse Books', icon: '📚' },
        { path: '/my-reservations', label: 'My Reservations', icon: '📖' },
        { path: '/my-loans', label: 'My Loans', icon: '📝' }
      ]

  const isActive = (path) => location.pathname === path

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4">
          {/* Header Top */}
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Library Management</h1>
              <p className="text-xs text-gray-500 mt-1">
                {user?.name ? `${user.name} · ` : ''}
                {userRole === 'admin'
                  ? isAdminStaff
                    ? '🔑 Administrator'
                    : '👷 Librarian'
                  : '👤 Member'} Portal
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition duration-200"
            >
              Logout
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex gap-2 border-t border-gray-200 pt-4">
            {navLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => navigate(link.path)}
                className={`px-4 py-2 rounded-lg font-medium transition duration-200 flex items-center gap-2 ${
                  isActive(link.path)
                    ? 'bg-indigo-100 text-indigo-700 border-b-2 border-indigo-600'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span>{link.icon}</span>
                {link.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  )
}

export default MainLayout
