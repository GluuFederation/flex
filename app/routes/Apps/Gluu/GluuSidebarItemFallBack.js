import React from 'react'

function GluuSidebarItemFallBack({ error, resetErrorBoundary }) {
  return (
    <div role="alert">
      <p>Side bar item: something went wrong</p>
      <pre>{error.message}</pre>
      <pre>{JSON.stringify(error.stack)}</pre>
      <pre>{JSON.stringify(error)}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  )
}

export default GluuSidebarItemFallBack
