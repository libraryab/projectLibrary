/**
 * LoadingSpinner Component
 * Displays a loading spinner while data is being fetched
 */
function LoadingSpinner({ message = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
      <p className="mt-4 text-gray-600 font-medium">{message}</p>
    </div>
  )
}

export default LoadingSpinner
