interface GluuErrorFallBackProps {
  error: { message: string }
}

const GluuErrorFallBack = ({ error }: GluuErrorFallBackProps) => (
  <div role="alert">
    <pre>{error.message}</pre>
  </div>
)

export default GluuErrorFallBack
