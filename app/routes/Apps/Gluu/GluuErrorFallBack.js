import React from 'react'

function GluuErrorFallBack({ error, resetErrorBoundary }) {
  function logger(error) {
    console.log(error.message)
  }
  return (
    <div role="alert">
      <pre>{error.message}</pre>
    </div>
  )
}

export default GluuErrorFallBack
