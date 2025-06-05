function GluuErrorFallBack({ error }: any) {
  return (
    <div role="alert">
      <pre>{error.message}</pre>
    </div>
  )
}

export default GluuErrorFallBack
