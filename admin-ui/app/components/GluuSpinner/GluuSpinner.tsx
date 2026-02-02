import React, { useContext } from 'react'
import { ThemeContext } from '@/context/theme/themeContext'
import { THEME_DARK, DEFAULT_THEME } from '@/context/theme/constants'
import { useStyles } from './GluuSpinner.style'

export interface GluuSpinnerProps {
  /** Size in pixels. Default: 48 for inline, use 80 for full-page blocking overlay */
  'size'?: number
  /** Override theme detection. When not provided, uses ThemeContext */
  'isDark'?: boolean
  /** Accessible label for screen readers */
  'aria-label'?: string
}

const GluuSpinner = React.memo<GluuSpinnerProps>(
  ({ size = 48, 'isDark': isDarkProp, 'aria-label': ariaLabel = 'Loading' }) => {
    const themeContext = useContext(ThemeContext)
    const currentTheme = themeContext?.state.theme || DEFAULT_THEME
    const isDark = isDarkProp ?? currentTheme === THEME_DARK

    const { classes } = useStyles({ size, isDark })

    return (
      <div className={classes.spinner} role="status" aria-label={ariaLabel} aria-live="polite" />
    )
  },
)

GluuSpinner.displayName = 'GluuSpinner'

export default GluuSpinner
