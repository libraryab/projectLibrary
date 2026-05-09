import { useState, useEffect } from 'react'
import StatCard from '../components/StatCard'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorAlert from '../components/ErrorAlert'
import EmptyState from '../components/EmptyState'
import {
  getAllBooks,
  getAvailableBooksCount
} from '../services/booksService'
import {
  getActiveLoansCount,
  getActiveLoans,
  getDueInfo
} from '../services/loansService'
import {
  getActiveReservationsCount,
  getRecentReservations
} from '../services/reservationsService'

function AdminDashboardPage() {
  // State for statistics
  const [stats, setStats] = useState({
    totalBooks: 0,
    availableBooks: 0,
    activeLoans: 0,
    activeReservations: 0
  })

  // State for recent data
  const [recentLoans, setRecentLoans] = useState([])
  const [recentReservations, setRecentReservations] = useState([])

  // State for loading and errors
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Load dashboard data
  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Fetch all data in parallel
      const [
        booksData,
        availableCount,
        loansCount,
        reservationsCount,
        loansData,
        reservationsData
      ] = await Promise.all([
        getAllBooks(),
        getAvailableBooksCount(),
        getActiveLoansCount(),
        getActiveReservationsCount(),
        getActiveLoans(),
        getRecentReservations(5)
      ])

      // Update statistics
      setStats({
        totalBooks: booksData.length,
        availableBooks: availableCount,
        activeLoans: loansCount,
        activeReservations: reservationsCount
      })

      // Set recent data
      setRecentLoans(loansData.slice(0, 5))
      setRecentReservations(reservationsData)
    } catch (err) {
      console.error('Failed to load dashboard data:', err)
      setError(err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <LoadingSpinner message="Loading dashboard..." />

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Admin Dashboard</h2>
        <p className="text-gray-600 mt-2">Welcome back! Here's your library overview.</p>
      </div>

      {/* Error Alert */}
      {error && <ErrorAlert error={error} onRetry={loadDashboardData} />}

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Books"
          value={stats.totalBooks}
          color="indigo"
          icon={
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.669 0-3.218.51-4.5 1.385A7.968 7.968 0 009 4.804z" />
            </svg>
          }
        />
        <StatCard
          title="Available Books"
          value={stats.availableBooks}
          color="green"
          icon={
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          }
        />
        <StatCard
          title="Active Loans"
          value={stats.activeLoans}
          color="blue"
          icon={
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
              <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
            </svg>
          }
        />
        <StatCard
          title="Reservations"
          value={stats.activeReservations}
          color="yellow"
          icon={
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
            </svg>
          }
        />
      </div>

      {/* Recent Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Loans Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Recent Loans</h3>
          </div>

          {recentLoans.length === 0 ? (
            <div className="p-6">
              <EmptyState
                title="No active loans"
                message="There are no active loans at the moment."
                icon="document"
              />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-gray-700 font-semibold">Member</th>
                    <th className="px-6 py-3 text-left text-gray-700 font-semibold">Book</th>
                    <th className="px-6 py-3 text-left text-gray-700 font-semibold">Due Date</th>
                    <th className="px-6 py-3 text-left text-gray-700 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {recentLoans.map((loan) => {
                    const { isOverdue } = getDueInfo(loan.dueDate)
                    return (
                      <tr key={loan.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-gray-900 font-medium">
                          {loan.memberName || loan.memberId}
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          {loan.bookTitle || loan.bookId}
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          {new Date(loan.dueDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                              isOverdue
                                ? 'bg-red-100 text-red-800'
                                : 'bg-green-100 text-green-800'
                            }`}
                          >
                            {isOverdue ? 'Overdue' : 'Active'}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Recent Reservations Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Recent Reservations</h3>
          </div>

          {recentReservations.length === 0 ? (
            <div className="p-6">
              <EmptyState
                title="No reservations"
                message="There are no active reservations at the moment."
                icon="document"
              />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-gray-700 font-semibold">Member</th>
                    <th className="px-6 py-3 text-left text-gray-700 font-semibold">Book</th>
                    <th className="px-6 py-3 text-left text-gray-700 font-semibold">Reserved Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {recentReservations.map((reservation) => (
                    <tr key={reservation.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-gray-900 font-medium">
                        {reservation.memberName || reservation.memberId}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {reservation.bookTitle || reservation.bookId}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {new Date(reservation.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminDashboardPage
