import React, { Component, ErrorInfo, ReactNode } from 'react'
import { Alert, Button } from 'reactstrap'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

/**
 * Error boundary component for Agama sections
 * Catches JavaScript errors anywhere in the child component tree
 */
class AgamaErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  }

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to console for debugging
    console.error('Agama Error Boundary caught an error:', error, errorInfo)
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null })
    // Reload the page to reset the state
    window.location.reload()
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="p-4">
          <Alert color="danger">
            <h4 className="alert-heading">Something went wrong</h4>
            <p>
              An error occurred while loading the Agama component. This could be due to a network
              issue or a problem with the data.
            </p>
            {this.state.error && (
              <details className="mt-3">
                <summary>Error Details</summary>
                <pre className="mt-2 p-2 bg-light">
                  <code>{this.state.error.toString()}</code>
                </pre>
              </details>
            )}
            <hr />
            <div className="d-flex gap-2">
              <Button color="primary" onClick={this.handleReset}>
                Reload Page
              </Button>
              <Button color="secondary" onClick={() => window.history.back()}>
                Go Back
              </Button>
            </div>
          </Alert>
        </div>
      )
    }

    return this.props.children
  }
}

export default AgamaErrorBoundary
