import React, { createContext, useState, useEffect } from 'react'
import { tokenUtils } from '../utils/tokenUtils'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [userRole, setUserRole] = useState(null)

  useEffect(() => {
    // Check if user is already logged in
    const token = tokenUtils.getToken()
    if (token) {
      setIsAuthenticated(true)
    }
    setIsLoading(false)
  }, [])

  const login = (userData) => {
    setUser(userData)
    
    // Normalize role: handle various formats (ADMIN/STAFF, admin/staff, admin/member, etc.)
    let normalizedRole = 'member'
    const role = userData?.role || ''
    const roleUpper = String(role).toUpperCase()
    
    if (roleUpper === 'ADMIN' || roleUpper === 'ADMINISTRATOR' || role === 'admin') {
      normalizedRole = 'admin'
    } else if (roleUpper === 'STAFF' || role === 'staff') {
      normalizedRole = 'admin' // Treat staff as admin
    } else if (roleUpper === 'MEMBER' || role === 'member') {
      normalizedRole = 'member'
    }
    
    setUserRole(normalizedRole)
    setIsAuthenticated(true)
  }

  const logout = () => {
    setUser(null)
    setUserRole(null)
    setIsAuthenticated(false)
    tokenUtils.removeToken()
  }

  return (
    <AuthContext.Provider value={{ user, userRole, isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
