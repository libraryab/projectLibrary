import { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorAlert from '../components/ErrorAlert'
import EmptyState from '../components/EmptyState'
import { getMemberReservations, cancelReservation } from '../services/reservationsService'

function MemberReservationsPage() {
  const { user } = useAuth()

  const [memberReservations, setMemberReservations] = useState([])
  const [filteredReservations, setFilteredReservations] = useState([])
  const [filterStatus, setFilterStatus] = useState('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [cancellingReservationId, setCancellingReservationId] = useState(null)

  useEffect(() => {
    loadMemberReservations()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [memberReservations, filterStatus])

  const loadMemberReservations = async () => {
    try {
      setLoading(true)
      setError(null)

      if (!user?.id) {
        setMemberReservations([])
        return
      }

      const response = await getMemberReservations(user.id)
      const reservations = response.reservations || []
      setMemberReservations(reservations)
    } catch (err) {
      console.error('Failed to load reservations:', err)
      setError(err)
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    try {
      let filtered = memberReservations

      if (filterStatus === 'active') {
        filtered = filtered.filter((reservation) => reservation.status === 'ACTIVE')
      } else if (filterStatus === 'cancelled') {
        filtered = filtered.filter((reservation) => reservation.status === 'CANCELLED')
      } else if (filterStatus === 'completed') {
        filtered = filtered.filter((reservation) => reservation.status === 'COMPLETED')
      }

      setFilteredReservations(filtered)
    } catch (err) {
      console.error('Filter error:', err)
    }
  }

  const handleCancelReservation = async (reservationId) => {
    try {
      setCancellingReservationId(reservationId)
      setError(null)

      await cancelReservation(reservationId)

      window.dispatchEvent(new CustomEvent('libraryDataChanged'))

      await loadMemberReservations()
    } catch (err) {
      console.error('Failed to cancel reservation:', err)
      setError(err)
    } finally {
      setCancellingReservationId(null)
    }
  }

  const activeReservationCount = memberReservations.filter((reservation) => reservation.status === 'ACTIVE').length
  const cancelledReservationCount = memberReservations.filter((reservation) => reservation.status === 'CANCELLED').length
  const completedReservationCount = memberReservations.filter((reservation) => reservation.status === 'COMPLETED').length

  if (loading) return <LoadingSpinner message="Loading your reservations..." />

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">My Reservations</h2>
        <p className="text-gray-600 mt-2">
          View the books you reserved.
        </p>
      </div>

      {error && <ErrorAlert error={error} onRetry={loadMemberReservations} />}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600 text-sm font-medium mb-2">Active Reservations</p>
          <p className="text-3xl font-bold text-indigo-600">{activeReservationCount}</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600 text-sm font-medium mb-2">Completed</p>
          <p className="text-3xl font-bold text-green-600">{completedReservationCount}</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600 text-sm font-medium mb-2">Cancelled</p>
          <p className="text-3xl font-bold text-gray-700">{cancelledReservationCount}</p>
        </div>
      </div>

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
          <option value="all">All Reservations</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {filteredReservations.length === 0 ? (
        <EmptyState
          title={filterStatus !== 'all' ? 'No reservations found' : 'No reservations yet'}
          message={
            filterStatus !== 'all'
              ? 'Try selecting a different filter.'
              : 'You have not reserved any books yet. Go to the Books page to reserve one.'
          }
          icon="book"
        />
      ) : (
        <div className="space-y-4">
          {filteredReservations.map((reservation) => {
            const reservationDate = new Date(reservation.reservationDate).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })
            const bookTitle = reservation.bookTitle || reservation.bookId

            return (
              <div key={reservation.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Book Title</h3>
                      <p className="text-lg font-semibold text-gray-900 mt-1">{bookTitle}</p>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Reservation Date</h3>
                      <p className="text-gray-700 mt-1">{reservationDate}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Status</h3>
                      <div className="flex items-center gap-3 mt-2">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                            reservation.status === 'ACTIVE'
                              ? 'bg-green-100 text-green-800'
                              : reservation.status === 'COMPLETED'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {reservation.status}
                        </span>
                      </div>
                    </div>

                    {reservation.status === 'ACTIVE' && (
                      <div>
                        <button
                          onClick={() => handleCancelReservation(reservation.id)}
                          disabled={cancellingReservationId === reservation.id}
                          className={`inline-flex items-center px-4 py-2 rounded-lg font-semibold transition duration-200 ${
                            cancellingReservationId === reservation.id
                              ? 'bg-gray-200 text-gray-600 cursor-not-allowed'
                              : 'bg-red-600 hover:bg-red-700 text-white cursor-pointer'
                          }`}
                        >
                          {cancellingReservationId === reservation.id ? 'Cancelling...' : 'Cancel Reservation'}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">About Your Reservations</h3>
        <ul className="text-blue-800 space-y-2 text-sm">
          <li>✓ You can reserve available books from the Books page</li>
          <li>✓ The admin manages the loan process after reservation</li>
          <li>✓ Completed and cancelled reservations are kept for history</li>
        </ul>
      </div>
    </div>
  )
}

export default MemberReservationsPage
