import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, AuthContext } from './context/AuthContext'
import { useContext } from 'react'
import MainLayout from './layouts/MainLayout'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import AdminDashboardPage from './pages/AdminDashboardPage'
import AdminLoansPage from './pages/AdminLoansPage'
import AdminAddBooksPage from './pages/AdminAddBooksPage'
import AdminUsersPage from './pages/AdminUsersPage'
import MemberBooksPage from './pages/MemberBooksPage'
import MemberReservationsPage from './pages/MemberReservationsPage'
import MemberLoansPage from './pages/MemberLoansPage'
import LoansManagementPage from './pages/LoansManagementPage'
import ProtectedRoute from './components/ProtectedRoute'
import AdminBooksPage from './pages/AdminBooksPage'
import AdminEditBooksPage from './pages/AdminEditBooksPage'
import BookDetailPage from './pages/BookDetailPage'

// Component to handle role-based redirect - routes based on user role
function RoleBasedRedirect() {
  const { userRole, isLoading, isAuthenticated } = useContext(AuthContext)
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    )
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  
  // Route based on role
  if (userRole === 'admin') {
    return <Navigate to="/admin-dashboard" replace />
  }
  
  return <Navigate to="/books" replace />
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Auth Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Admin Routes */}
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <MainLayout>
                  <AdminDashboardPage />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin-loans"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <MainLayout>
                  <AdminLoansPage />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin-add-books"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <MainLayout>
                  <AdminAddBooksPage />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin-users"
            element={
              <ProtectedRoute allowedRoles={['admin']} allowedStaffTypes={['ADMIN']}>
                <MainLayout>
                  <AdminUsersPage />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin-books"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <MainLayout>
                  <AdminBooksPage />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin-books/edit/:bookId"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <MainLayout>
                  <AdminEditBooksPage />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/books"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <MemberBooksPage />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/books/:bookId"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <BookDetailPage />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-reservations"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <MemberReservationsPage />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/my-loans"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <MemberLoansPage />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          {/* Legacy routes (kept for backward compatibility) */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <RoleBasedRedirect />
              </ProtectedRoute>
            }
          />
          <Route
            path="/loans"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <MainLayout>
                  <LoansManagementPage />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          {/* Root redirect - goes to role-based page */}
          <Route path="/" element={<RoleBasedRedirect />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
