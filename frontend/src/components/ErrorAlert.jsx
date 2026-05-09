/**
 * ErrorAlert Component
 * Displays an error message with optional retry button
 */
function ErrorAlert({ error, onRetry }) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-6 my-6">
      <div className="flex items-start gap-4">
        {/* Error icon */}
        <div className="flex-shrink-0">
          <svg
            className="w-6 h-6 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4v2m0-12a9 9 0 110 18 9 9 0 010-18zm0 0a.5.5 0 00-.5.5v.5a.5.5 0 00.5.5.5.5 0 00.5-.5v-.5a.5.5 0 00-.5-.5z"
            />
          </svg>
        </div>

        {/* Error content */}
        <div className="flex-grow">
          <h3 className="text-lg font-semibold text-red-800 mb-2">
            Something went wrong
          </h3>
          <p className="text-red-700 mb-4">
            {error?.response?.data?.message ||
              error?.message ||
              'Failed to load data. Please try again.'}
          </p>

          {/* Retry button */}
          {onRetry && (
            <button
              onClick={onRetry}
              className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition duration-200"
            >
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
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Retry
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default ErrorAlert
