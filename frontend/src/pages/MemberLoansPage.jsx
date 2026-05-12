import { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorAlert from '../components/ErrorAlert'
import EmptyState from '../components/EmptyState'
import { getMemberLoans } from '../services/loansService'

/**
 * Format date to dd/mm/yyyy format
 */
const formatDateDDMMYYYY = (date) => {
  if (!date) return '-'
  const d = new Date(date)
  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const year = d.getFullYear()
  return `${day}/${month}/${year}`
}

/**
 * Calculate days remaining or days overdue
 */
const getDueInfo = (dueDate, returnedDate) => {
  if (returnedDate) {
    return { status: 'returned', text: 'Returned' }
  }

  const due = new Date(dueDate)
  const today = new Date()
  const daysRemaining = Math.ceil((due - today) / (1000 * 60 * 60 * 24))

  if (daysRemaining < 0) {
    return { status: 'overdue', text: `${Math.abs(daysRemaining)} days overdue` }
  } else if (daysRemaining === 0) {
    return { status: 'today', text: 'Due today' }
  } else {
    return { status: 'active', text: `${daysRemaining} days remaining` }
  }
}

function MemberLoansPage() {
  const { user } = useAuth()

  const [memberLoans, setMemberLoans] = useState([])
  const [filteredLoans, setFilteredLoans] = useState([])
  const [filterStatus, setFilterStatus] = useState('active')
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadMemberLoans()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [memberLoans, filterStatus, searchQuery])

  const loadMemberLoans = async () => {
    try {
      setLoading(true)
      setError(null)

      if (!user?.id) {
        setMemberLoans([])
        return
      }

      // Try to resolve the member's id by searching members by email (user.id is the user id)
      const membersResp = await fetch(`/api/v1/members?search=${encodeURIComponent(user.email)}`)
      const membersData = await membersResp.json()
      const membersList = membersData?.data || membersData || []
      const found = Array.isArray(membersList)
        ? membersList.find((m) => m.email === user.email)
        : null

      if (!found) {
        // No member record found for this user
        setMemberLoans([])
        return
      }

      const response = await getMemberLoans(found.id)
      const loans = response.loans || []
      setMemberLoans(loans)
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
        filtered = filtered.filter((loan) => loan.status === 'ACTIVE')
      } else if (filterStatus === 'overdue') {
        filtered = filtered.filter((loan) => loan.status === 'OVERDUE')
      } else if (filterStatus === 'returned') {
        filtered = filtered.filter((loan) => loan.status === 'RETURNED')
      }

      // Apply search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase()
        filtered = filtered.filter((loan) =>
          loan.bookTitle?.toLowerCase().includes(query)
        )
      }

      setFilteredLoans(filtered)
    } catch (err) {
      console.error('Filter error:', err)
    }
  }

  const activeLoansCount = memberLoans.filter((loan) => loan.status === 'ACTIVE').length
  const overdueLoansCount = memberLoans.filter((loan) => loan.status === 'OVERDUE').length
  const returnedLoansCount = memberLoans.filter((loan) => loan.status === 'RETURNED').length


  if (loading) return <LoadingSpinner message="Loading your loans..." />

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">My Loans</h2>
        <p className="text-gray-600 mt-2">
          View and manage the books you have borrowed.
        </p>
      </div>

      {error && <ErrorAlert error={error} onRetry={loadMemberLoans} />}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600 text-sm font-medium mb-2">Active Loans</p>
          <p className="text-3xl font-bold text-blue-600">{activeLoansCount}</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600 text-sm font-medium mb-2">Overdue</p>
          <p className="text-3xl font-bold text-red-600">{overdueLoansCount}</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600 text-sm font-medium mb-2">Returned</p>
          <p className="text-3xl font-bold text-green-600">{returnedLoansCount}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <option value="active">Active</option>
              <option value="overdue">Overdue</option>
              <option value="returned">Returned</option>
            </select>
          </div>

          <div>
            <label htmlFor="search-query" className="block text-sm font-medium text-gray-700 mb-2">
              Search by Book Title
            </label>
            <input
              id="search-query"
              type="text"
              placeholder="Search books..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
            />
          </div>
        </div>
      </div>

      {/* Empty State */}
      {filteredLoans.length === 0 ? (
        <EmptyState
          title={filterStatus !== 'all' || searchQuery ? 'No loans found' : 'No loans yet'}
          message={
            filterStatus !== 'all' || searchQuery
              ? 'Try adjusting your filters or search query.'
              : 'You have not borrowed any books yet. Go to Browse Books to reserve one.'
          }
          icon="book"
        />
      ) : (
        <div className="space-y-4">
          {filteredLoans.map((loan) => {
            const loanDate = formatDateDDMMYYYY(loan.loanDate)
            const dueDate = formatDateDDMMYYYY(loan.dueDate)
            const returnedDate = loan.returnedDate ? formatDateDDMMYYYY(loan.returnedDate) : null
            const dueInfo = getDueInfo(loan.dueDate, loan.returnedDate)
            const bookTitle = loan.bookTitle || loan.bookId

            return (
              <div key={loan.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Book Title</h3>
                      <p className="text-lg font-semibold text-gray-900 mt-1">{bookTitle}</p>
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

                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Status</h3>
                      <div className="flex items-center gap-3 mt-2">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                            loan.status === 'ACTIVE'
                              ? 'bg-blue-100 text-blue-800'
                              : loan.status === 'OVERDUE'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-green-100 text-green-800'
                          }`}
                        >
                          {loan.status}
                        </span>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Time Info</h3>
                      <p
                        className={`mt-1 font-medium ${
                          dueInfo.status === 'active'
                            ? 'text-blue-600'
                            : dueInfo.status === 'overdue'
                              ? 'text-red-600'
                              : dueInfo.status === 'today'
                                ? 'text-yellow-600'
                                : 'text-green-600'
                        }`}
                      >
                        {dueInfo.text}
                      </p>
                    </div>

                    {returnedDate && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Returned Date</h3>
                        <p className="text-gray-700 mt-1">{returnedDate}</p>
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
          <li>✓ Active loans show how many days you have to return the book</li>
          <li>✓ Overdue loans need to be returned as soon as possible</li>
          <li>✓ Returned loans are kept for your borrowing history</li>
          <li>✓ Contact the library if you need to extend your loan</li>
        </ul>
      </div>
    </div>
  )
}

export default MemberLoansPage
