import React, { memo, useContext } from 'react'
import { GluuSpinner } from '@/components/GluuSpinner'
import { ThemeContext } from '@/context/theme/themeContext'
import { THEME_DARK, DEFAULT_THEME } from '@/context/theme/constants'
import { useStyles } from './GluuLoader.style'

interface GluuLoaderProps {
  blocking: boolean
  children?: React.ReactNode
}

const GluuLoader: React.FC<GluuLoaderProps> = memo(({ blocking, children }) => {
  const themeContext = useContext(ThemeContext)
  const currentTheme = themeContext?.state.theme || DEFAULT_THEME
  const isDark = currentTheme === THEME_DARK
  const { classes } = useStyles({ isDark })

  return (
    <div aria-busy={blocking}>
      {children}
      {blocking && (
        <div className={classes.overlay}>
          <GluuSpinner size={80} aria-label="Loading" />
        </div>
      )}
    </div>
  )
})

GluuLoader.displayName = 'GluuLoader'

export default GluuLoader
