import React from 'react'
import { useStyles } from './GluuSpinner.style'

const DEFAULT_ARIA_LABEL = 'Loading'
const DEFAULT_SPINNER_SIZE = 48

interface GluuSpinnerProps {
  'size'?: number
  'aria-label'?: string
}

const GluuSpinner = React.memo<GluuSpinnerProps>(
  ({ size = DEFAULT_SPINNER_SIZE, 'aria-label': ariaLabel = DEFAULT_ARIA_LABEL }) => {
    const { classes } = useStyles({ size })

    return <output className={classes.spinner} aria-label={ariaLabel} aria-live="polite" />
  },
)

GluuSpinner.displayName = 'GluuSpinner'

export default GluuSpinner
