import { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorAlert from '../components/ErrorAlert'
import EmptyState from '../components/EmptyState'
import axios from 'axios'
import { getDueInfo } from '../services/loansService'

function MemberLoansPage() {
  const { user } = useAuth()
  
  // State for loans
  const [memberLoans, setMemberLoans] = useState([])
  const [filteredLoans, setFilteredLoans] = useState([])

  // State for filters
  const [filterStatus, setFilterStatus] = useState('all') // 'all', 'active', 'returned'

  // State for UI
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Load member's loans on mount
  useEffect(() => {
    loadMemberLoans()
  }, [])

  // Apply filters when data or filters change
  useEffect(() => {
    applyFilters()
  }, [memberLoans, filterStatus])

  const loadMemberLoans = async () => {
    try {
      setLoading(true)
      setError(null)

      // Get all loans and filter for current member
      const response = await axios.get('/api/v1/loans')
      const allLoans = response.data.data || response.data

      // Filter loans for current member
      const myLoans = allLoans.filter(loan => 
        loan.memberId === user?.id || loan.memberEmail === user?.email
      )

      setMemberLoans(myLoans || [])
    } catch (err) {
      console.error('Failed to load loans:', err)
      setError(err)
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    try {
      let filtered = memberLoans

      // Apply status filter
      if (filterStatus === 'active') {
        filtered = filtered.filter(loan => loan.returnDate === null)
      } else if (filterStatus === 'returned') {
        filtered = filtered.filter(loan => loan.returnDate !== null)
      }

      setFilteredLoans(filtered)
    } catch (err) {
      console.error('Filter error:', err)
    }
  }

  // Calculate statistics
  const activeLoanCount = memberLoans.filter(loan => loan.returnDate === null).length
  const overdueLoans = memberLoans.filter(loan => {
    if (loan.returnDate !== null) return false
    const { isOverdue } = getDueInfo(loan.dueDate)
    return isOverdue
  }).length
  const returnedLoanCount = memberLoans.filter(loan => loan.returnDate !== null).length

  if (loading) return <LoadingSpinner message="Loading your loans..." />

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900">My Loans</h2>
        <p className="text-gray-600 mt-2">
          View your current and past book loans.
        </p>
      </div>

      {/* Error Alert */}
      {error && <ErrorAlert error={error} onRetry={loadMemberLoans} />}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Active Loans */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600 text-sm font-medium mb-2">Active Loans</p>
          <p className="text-3xl font-bold text-indigo-600">{activeLoanCount}</p>
          {overdueLoans > 0 && (
            <p className="text-sm text-red-600 mt-2">{overdueLoans} overdue</p>
          )}
        </div>

        {/* Returned Loans */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600 text-sm font-medium mb-2">Returned Loans</p>
          <p className="text-3xl font-bold text-green-600">{returnedLoanCount}</p>
        </div>

        {/* Total Loans */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600 text-sm font-medium mb-2">Total Loans</p>
          <p className="text-3xl font-bold text-gray-700">{memberLoans.length}</p>
        </div>
      </div>

      {/* Filter Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-2">
          Filter by Status
        </label>
        <select
          id="status-filter"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
        >
          <option value="all">All Loans</option>
          <option value="active">Active</option>
          <option value="returned">Returned</option>
        </select>
      </div>

      {/* Loans List */}
      {filteredLoans.length === 0 ? (
        <EmptyState
          title={
            filterStatus !== 'all'
              ? 'No loans found'
              : 'No loans yet'
          }
          message={
            filterStatus !== 'all'
              ? 'Try selecting a different filter.'
              : 'You haven\'t borrowed any books yet. Go to the Books page to make a loan.'
          }
          icon="book"
        />
      ) : (
        <div className="space-y-4">
          {filteredLoans.map((loan) => {
            const { isOverdue, daysRemaining } = getDueInfo(loan.dueDate)
            const loanDate = new Date(loan.loanDate).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })
            const dueDate = new Date(loan.dueDate).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })
            const returnDate = loan.returnDate 
              ? new Date(loan.returnDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })
              : null

            return (
              <div key={loan.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Column */}
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Book Title</h3>
                      <p className="text-lg font-semibold text-gray-900 mt-1">
                        {loan.bookTitle || loan.bookId}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Loan Date</h3>
                      <p className="text-gray-700 mt-1">{loanDate}</p>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Due Date</h3>
                      <p className="text-gray-700 mt-1">{dueDate}</p>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-4">
                    {/* Status Badge */}
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Status</h3>
                      <div className="flex items-center gap-3 mt-2">
                        {loan.returnDate === null ? (
                          <>
                            <span
                              className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                                isOverdue
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-green-100 text-green-800'
                              }`}
                            >
                              {isOverdue ? 'Overdue' : 'Active'}
                            </span>
                            {isOverdue && (
                              <span className="text-sm font-medium text-red-700">
                                {Math.abs(daysRemaining)} days overdue
                              </span>
                            )}
                            {!isOverdue && daysRemaining <= 3 && (
                              <span className="text-sm font-medium text-yellow-700">
                                {daysRemaining} days remaining
                              </span>
                            )}
                          </>
                        ) : (
                          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                            Returned
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Return Date (if returned) */}
                    {returnDate && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Return Date</h3>
                        <p className="text-gray-700 mt-1">{returnDate}</p>
                      </div>
                    )}

                    {/* Warning for overdue */}
                    {isOverdue && loan.returnDate === null && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                        <p className="text-sm text-red-800 font-medium">
                          ⚠️ This loan is overdue. Please return this book as soon as possible.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">About Your Loans</h3>
        <ul className="text-blue-800 space-y-2 text-sm">
          <li>✓ You can have multiple active loans at the same time</li>
          <li>✓ Return books by the due date to avoid overdue penalties</li>
          <li>✓ Returned books will appear in the "Returned" filter</li>
          <li>✓ Need another book? Go to the <strong>Books</strong> page to reserve or loan</li>
        </ul>
      </div>
    </div>
  )
}

export default MemberLoansPage
