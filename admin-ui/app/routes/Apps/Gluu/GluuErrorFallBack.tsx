import type { FallbackProps } from 'react-error-boundary'

const GluuErrorFallBack = ({ error }: FallbackProps) => (
  <div role="alert">
    <pre>{error instanceof Error ? error.message : String(error)}</pre>
  </div>
)

export default GluuErrorFallBack
