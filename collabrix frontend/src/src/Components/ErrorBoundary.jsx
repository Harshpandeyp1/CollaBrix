import React from 'react'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    // You can log to an external service here if needed
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="max-w-2xl rounded-2xl bg-white border border-red-200 p-6 text-center shadow-lg">
          <h2 className="text-xl font-semibold text-red-700">Something went wrong.</h2>
          <p className="mt-2 text-sm text-gray-600">
            We couldn&apos;t load the profile header right now. Please refresh or try again later.
          </p>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary

