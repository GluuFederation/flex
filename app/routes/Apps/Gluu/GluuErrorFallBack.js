import React from 'react'

function GluuErrorFallBack({ error}) {
  return (
    <div role="alert">
      <pre>{error.message}</pre>
    </div>
  )
}

export default GluuErrorFallBack
