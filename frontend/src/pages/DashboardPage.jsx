function DashboardPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Books</h3>
          <p className="text-3xl font-bold text-indigo-600">0</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Active Members</h3>
          <p className="text-3xl font-bold text-indigo-600">0</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Active Loans</h3>
          <p className="text-3xl font-bold text-indigo-600">0</p>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
