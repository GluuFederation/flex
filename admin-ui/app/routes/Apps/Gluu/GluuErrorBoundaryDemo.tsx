import { useState } from 'react'
import { GluuButton } from '@/components/GluuButton'

const GluuErrorBoundaryDemo = () => {
  const [boom, setBoom] = useState(false)

  if (boom) {
    throw new Error('Demo crash: triggered from the navbar to test the error fallback screen')
  }

  return (
    <GluuButton
      outlined
      fontWeight={700}
      minHeight={32}
      padding="0 12px"
      onClick={() => setBoom(true)}
    >
      Trigger error
    </GluuButton>
  )
}

export default GluuErrorBoundaryDemo
