import React from 'react'

function GluuErrorFallBack({ error, resetErrorBoundary}) {
  return (
    <div role="alert">
      <p>Gluu Admin UI-Sidebar: something went wrong</p>
      <pre>{error.message}</pre>
      <pre>{JSON.stringify(error.stack)}</pre>
      <pre>{JSON.stringify(error)}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  )
}

export default GluuErrorFallBack
