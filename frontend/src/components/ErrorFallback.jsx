import React from 'react';

export function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="text-center max-w-md">
        <div className="text-2xl font-bold text-red-500 mb-4">Application Error</div>
        <pre className="text-left bg-gray-100 p-4 rounded mb-6 overflow-auto text-sm">
          {error.message}
        </pre>
        <button
          onClick={resetErrorBoundary}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          Reload Application
        </button>
      </div>
    </div>
  );
}