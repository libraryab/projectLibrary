import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, AuthContext } from './context/AuthContext'
import { useContext } from 'react'
import MainLayout from './layouts/MainLayout'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import AdminDashboardPage from './pages/AdminDashboardPage'
import AdminLoansPage from './pages/AdminLoansPage'
import AdminAddBooksPage from './pages/AdminAddBooksPage'
import MemberBooksPage from './pages/MemberBooksPage'
import MemberLoansPage from './pages/MemberLoansPage'
import LoansManagementPage from './pages/LoansManagementPage'
import ProtectedRoute from './components/ProtectedRoute'

// Component to handle role-based routing
function RoleBasedRedirect() {
  const { userRole } = useContext(AuthContext)
  
  if (userRole === 'admin') {
    return <Navigate to="/admin-dashboard" replace />
  } else {
    return <Navigate to="/books" replace />
  }
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
              <ProtectedRoute>
                <MainLayout>
                  <AdminDashboardPage />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin-loans"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <AdminLoansPage />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin-add-books"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <AdminAddBooksPage />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          {/* Member Routes */}
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
                <MainLayout>
                  <AdminDashboardPage />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/loans"
            element={
              <ProtectedRoute>
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
