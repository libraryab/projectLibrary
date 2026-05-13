import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

function ProtectedRoute({ children, allowedRoles, allowedStaffTypes }) {
  const { isAuthenticated, isLoading, userRole, user } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    return <Navigate to="/" replace />
  }

  if (allowedStaffTypes && allowedStaffTypes.length > 0) {
    const staffType = String(user?.staffType || '').toUpperCase()
    if (!allowedStaffTypes.includes(staffType)) {
      return <Navigate to="/" replace />
    }
  }

  return children
}

export default ProtectedRoute
