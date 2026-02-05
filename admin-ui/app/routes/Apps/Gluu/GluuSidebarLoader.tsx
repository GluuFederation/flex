import React, { memo } from 'react'
import { GluuSpinner } from '@/components/GluuSpinner'

const SPINNER_SIZE = 48
const ARIA_LABEL_LOADING = 'Loading'

const CONTAINER_STYLE: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  minHeight: '100vh',
  padding: 20,
}

const GluuSidebarLoader = memo(function GluuSidebarLoader() {
  return (
    <div style={CONTAINER_STYLE} aria-busy aria-label={ARIA_LABEL_LOADING}>
      <GluuSpinner size={SPINNER_SIZE} aria-label={ARIA_LABEL_LOADING} />
    </div>
  )
})

GluuSidebarLoader.displayName = 'GluuSidebarLoader'

export default GluuSidebarLoader
