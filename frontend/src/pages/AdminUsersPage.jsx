import { useEffect, useState } from 'react'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorAlert from '../components/ErrorAlert'
import EmptyState from '../components/EmptyState'
import { useAuth } from '../hooks/useAuth'
import { getUsers, updateUserRole, deleteUser } from '../services/usersService'

function AdminUsersPage() {
  const { user } = useAuth()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [staffTypeByUser, setStaffTypeByUser] = useState({})
  const [savingUserId, setSavingUserId] = useState(null)
  const [deletingUserId, setDeletingUserId] = useState(null)

  const loadUsers = async (search = '') => {
    try {
      setLoading(true)
      setError('')
      const data = await getUsers(search)
      const usersList = Array.isArray(data) ? data : []
      setUsers(usersList)
      setStaffTypeByUser(
        usersList.reduce((acc, currentUser) => {
          acc[currentUser.id] = currentUser.staffType || 'LIBRARIAN'
          return acc
        }, {}),
      )
    } catch (err) {
      console.error('Failed to load users:', err)
      setError(err.response?.data?.error || 'Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUsers()
  }, [])

  const handleSearch = async (value) => {
    setSearchQuery(value)
    await loadUsers(value)
  }

  const handleRoleChange = async (targetUser, role) => {
    if (targetUser.id === user?.id) return

    try {
      setSavingUserId(targetUser.id)
      setError('')
      await updateUserRole(targetUser.id, {
        role,
        staffType: role === 'STAFF' ? staffTypeByUser[targetUser.id] || 'LIBRARIAN' : undefined,
      })
      await loadUsers(searchQuery)
      window.dispatchEvent(new CustomEvent('libraryDataChanged'))
    } catch (err) {
      console.error('Failed to update user role:', err)
      setError(err.response?.data?.error || 'Failed to update user role')
    } finally {
      setSavingUserId(null)
    }
  }

  const handleDeleteUser = async (targetUser) => {
    if (targetUser.id === user?.id) return

    const confirmed = window.confirm(
      `Delete ${targetUser.name}? This will remove the account and linked member data.`,
    )

    if (!confirmed) return

    try {
      setDeletingUserId(targetUser.id)
      setError('')
      await deleteUser(targetUser.id)
      await loadUsers(searchQuery)
      window.dispatchEvent(new CustomEvent('libraryDataChanged'))
    } catch (err) {
      console.error('Failed to delete user:', err)
      setError(err.response?.data?.error || 'Failed to delete user')
    } finally {
      setDeletingUserId(null)
    }
  }

  if (loading) return <LoadingSpinner message="Loading users..." />

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Manage Users</h2>
        <p className="text-gray-600 mt-2">Create users as Library Member and change roles here when needed.</p>
      </div>

      {error && <ErrorAlert error={error} onRetry={() => loadUsers(searchQuery)} />}

      <div className="bg-white rounded-lg shadow-md p-6">
        <label htmlFor="user-search" className="block text-sm font-medium text-gray-700 mb-2">
          Search by name or email
        </label>
        <input
          id="user-search"
          type="text"
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search users..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
        />
      </div>

      {users.length === 0 ? (
        <EmptyState
          title="No users found"
          message="Try a different search term or create a new account."
          icon="document"
        />
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">Name</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">Email</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">Role</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((currentUser) => {
                const isSelf = currentUser.id === user?.id
                const isStaff = currentUser.role === 'STAFF'

                return (
                  <tr key={currentUser.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">{currentUser.name}</td>
                    <td className="px-6 py-4 text-gray-600">{currentUser.email}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${isStaff ? 'bg-indigo-100 text-indigo-700' : 'bg-green-100 text-green-700'}`}>
                        {isStaff ? currentUser.staffType || 'STAFF' : 'Library Member'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {isSelf ? (
                        <span className="text-xs font-medium text-gray-500">Current account</span>
                      ) : isStaff ? (
                        <button
                          type="button"
                          onClick={() => handleRoleChange(currentUser, 'MEMBER')}
                          disabled={savingUserId === currentUser.id || deletingUserId === currentUser.id}
                          className="px-4 py-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 disabled:opacity-50"
                        >
                          {savingUserId === currentUser.id ? 'Saving...' : 'Make Member'}
                        </button>
                      ) : (
                        <div className="flex items-center gap-3">
                          <select
                            value={staffTypeByUser[currentUser.id] || 'LIBRARIAN'}
                            onChange={(e) =>
                              setStaffTypeByUser((prev) => ({
                                ...prev,
                                [currentUser.id]: e.target.value,
                              }))
                            }
                            className="px-3 py-2 border border-gray-300 rounded-lg"
                          >
                            <option value="LIBRARIAN">Librarian</option>
                            <option value="ADMIN">Admin</option>
                          </select>
                          <button
                            type="button"
                            onClick={() => handleRoleChange(currentUser, 'STAFF')}
                            disabled={savingUserId === currentUser.id || deletingUserId === currentUser.id}
                            className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50"
                          >
                            {savingUserId === currentUser.id ? 'Saving...' : 'Make Staff'}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteUser(currentUser)}
                            disabled={savingUserId === currentUser.id || deletingUserId === currentUser.id}
                            className="px-4 py-2 rounded-lg bg-black text-white hover:bg-gray-800 disabled:opacity-50"
                          >
                            {deletingUserId === currentUser.id ? 'Deleting...' : 'Delete'}
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default AdminUsersPage