/**
 * StatCard Component
 * Reusable card for displaying a statistic
 */
function StatCard({ title, value, icon, color = 'indigo', trend }) {
  const colorClasses = {
    indigo: 'text-indigo-600 bg-indigo-50',
    green: 'text-green-600 bg-green-50',
    blue: 'text-blue-600 bg-blue-50',
    yellow: 'text-yellow-600 bg-yellow-50',
    red: 'text-red-600 bg-red-50'
  }

  const bgColor = colorClasses[color] || colorClasses.indigo

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium mb-1">{title}</p>
          <div className="flex items-center gap-2">
            <p className="text-3xl font-bold text-gray-900">{value}</p>
            {trend && (
              <span className={`text-sm font-semibold ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
              </span>
            )}
          </div>
        </div>
        {icon && (
          <div className={`p-3 rounded-lg ${bgColor}`}>
            {icon}
          </div>
        )}
      </div>
    </div>
  )
}

export default StatCard
