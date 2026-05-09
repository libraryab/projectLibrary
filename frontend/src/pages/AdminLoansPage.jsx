import { useState, useEffect } from 'react'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorAlert from '../components/ErrorAlert'
import EmptyState from '../components/EmptyState'
import {
  getActiveLoans,
  returnLoan,
  getDueInfo
} from '../services/loansService'

function AdminLoansPage() {
  // State for loans
  const [loans, setLoans] = useState([])
  const [filteredLoans, setFilteredLoans] = useState([])

  // State for filters
  const [filterStatus, setFilterStatus] = useState('all') // 'all', 'active', 'overdue'
  const [searchQuery, setSearchQuery] = useState('')

  // State for UI
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [returningLoanId, setReturningLoanId] = useState(null)

  // Load loans on mount
  useEffect(() => {
    loadLoans()
  }, [])

  // Apply filters when data or filters change
  useEffect(() => {
    applyFilters()
  }, [loans, filterStatus, searchQuery])

  const loadLoans = async () => {
    try {
      setLoading(true)
      setError(null)
      const loansData = await getActiveLoans()
      setLoans(loansData || [])
    } catch (err) {
      console.error('Failed to load loans:', err)
      setError(err)
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    try {
      let filtered = loans

      // Apply status filter
      if (filterStatus === 'overdue') {
        filtered = filtered.filter(loan => {
          const { isOverdue } = getDueInfo(loan.dueDate)
          return isOverdue
        })
      } else if (filterStatus === 'active') {
        filtered = filtered.filter(loan => {
          const { isOverdue } = getDueInfo(loan.dueDate)
          return !isOverdue
        })
      }

      // Apply search filter
      if (searchQuery.trim()) {
        filtered = filtered.filter(loan =>
          (loan.memberName && loan.memberName.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (loan.bookTitle && loan.bookTitle.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (loan.memberId && loan.memberId.includes(searchQuery)) ||
          (loan.bookId && loan.bookId.includes(searchQuery))
        )
      }

      setFilteredLoans(filtered)
    } catch (err) {
      console.error('Filter error:', err)
    }
  }

  const handleReturnLoan = async (loanId) => {
    try {
      setReturningLoanId(loanId)
      setError(null)

      await returnLoan(loanId)

      // Reload loans
      await loadLoans()
    } catch (err) {
      console.error('Failed to return loan:', err)
      setError(err)
    } finally {
      setReturningLoanId(null)
    }
  }

  // Calculate statistics
  const totalLoans = loans.length
  const overdueLoans = loans.filter(loan => {
    const { isOverdue } = getDueInfo(loan.dueDate)
    return isOverdue
  }).length
  const activeLoans = totalLoans - overdueLoans

  if (loading) return <LoadingSpinner message="Loading loans..." />

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Manage Loans</h2>
        <p className="text-gray-600 mt-2">
          Review and approve member loans. Mark books as returned when members bring them back.
        </p>
      </div>

      {/* Error Alert */}
      {error && <ErrorAlert error={error} onRetry={loadLoans} />}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Loans Card */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600 text-sm font-medium mb-2">Total Active Loans</p>
          <p className="text-3xl font-bold text-indigo-600">{totalLoans}</p>
        </div>

        {/* Active Loans Card */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600 text-sm font-medium mb-2">On Track</p>
          <p className="text-3xl font-bold text-green-600">{activeLoans}</p>
        </div>

        {/* Overdue Loans Card */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600 text-sm font-medium mb-2">Overdue</p>
          <p className="text-3xl font-bold text-red-600">{overdueLoans}</p>
        </div>
      </div>

      {/* Filter Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Status Filter */}
          <div>
            <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Status
            </label>
            <select
              id="status-filter"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
            >
              <option value="all">All Loans</option>
              <option value="active">Active (On Track)</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>

          {/* Search Input */}
          <div className="md:col-span-2">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
              Search by member or book
            </label>
            <input
              id="search"
              type="text"
              placeholder="Search by member name, book title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
            />
          </div>
        </div>
      </div>

      {/* Loans Table */}
      {filteredLoans.length === 0 ? (
        <EmptyState
          title={
            searchQuery || filterStatus !== 'all'
              ? 'No loans found'
              : 'No active loans'
          }
          message={
            searchQuery || filterStatus !== 'all'
              ? 'Try adjusting your search or filters.'
              : 'There are no active loans at the moment.'
          }
          icon="document"
        />
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-gray-700 font-semibold">
                    Member Name
                  </th>
                  <th className="px-6 py-4 text-left text-gray-700 font-semibold">
                    Book Title
                  </th>
                  <th className="px-6 py-4 text-left text-gray-700 font-semibold">
                    Loan Date
                  </th>
                  <th className="px-6 py-4 text-left text-gray-700 font-semibold">
                    Due Date
                  </th>
                  <th className="px-6 py-4 text-left text-gray-700 font-semibold">
                    Status
                  </th>
                  <th className="px-6 py-4 text-center text-gray-700 font-semibold">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredLoans.map((loan) => {
                  const { isOverdue, daysRemaining } = getDueInfo(loan.dueDate)
                  const loanDate = new Date(loan.loanDate).toLocaleDateString()
                  const dueDate = new Date(loan.dueDate).toLocaleDateString()

                  return (
                    <tr key={loan.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 text-gray-900 font-medium">
                        {loan.memberName || loan.memberId}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {loan.bookTitle || loan.bookId}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {loanDate}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {dueDate}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                              isOverdue
                                ? 'bg-red-100 text-red-800'
                                : 'bg-green-100 text-green-800'
                            }`}
                          >
                            {isOverdue ? 'Overdue' : 'Active'}
                          </span>
                          {!isOverdue && daysRemaining <= 3 && (
                            <span className="text-xs text-yellow-700 font-medium">
                              {daysRemaining} days left
                            </span>
                          )}
                          {isOverdue && (
                            <span className="text-xs text-red-700 font-medium">
                              {Math.abs(daysRemaining)} days overdue
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => handleReturnLoan(loan.id)}
                          disabled={returningLoanId === loan.id}
                          className={`inline-flex items-center px-4 py-2 rounded-lg font-semibold transition duration-200 ${
                            returningLoanId === loan.id
                              ? 'bg-gray-200 text-gray-600 cursor-not-allowed'
                              : 'bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer'
                          }`}
                        >
                          {returningLoanId === loan.id ? (
                            <>
                              <span className="inline-block w-3 h-3 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mr-2"></span>
                              Returning...
                            </>
                          ) : (
                            <>
                              <svg
                                className="w-4 h-4 mr-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                              Mark Returned
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 text-sm text-gray-600">
            Showing {filteredLoans.length} of {loans.length} loans
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminLoansPage
