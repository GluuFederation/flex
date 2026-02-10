interface GluuErrorFallBackProps {
  error: { message: string }
}

function GluuErrorFallBack({ error }: GluuErrorFallBackProps) {
  return (
    <div role="alert">
      <pre>{error.message}</pre>
    </div>
  )
}

export default GluuErrorFallBack
