import React, { useContext } from 'react'
import { ThemeContext } from '@/context/theme/themeContext'
import { THEME_DARK, DEFAULT_THEME } from '@/context/theme/constants'
import { useStyles } from './GluuSpinner.style'

interface GluuSpinnerProps {
  'size'?: number
  'isDark'?: boolean
  'aria-label'?: string
}

const GluuSpinner = React.memo<GluuSpinnerProps>(
  ({ size = 48, 'isDark': isDarkProp, 'aria-label': ariaLabel = 'Loading' }) => {
    const themeContext = useContext(ThemeContext)
    const currentTheme = themeContext?.state.theme || DEFAULT_THEME
    const isDark = isDarkProp ?? currentTheme === THEME_DARK

    const { classes } = useStyles({ size, isDark })

    return <output className={classes.spinner} aria-label={ariaLabel} aria-live="polite" />
  },
)

GluuSpinner.displayName = 'GluuSpinner'

export default GluuSpinner
