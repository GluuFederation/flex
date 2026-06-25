import React, { memo, use } from 'react'
import { GluuSpinner } from '@/components/GluuSpinner'
import { ThemeContext, getStoredTheme } from '@/context/theme/themeContext'
import { THEME_DARK } from '@/context/theme/constants'
import { useStyles } from './GluuLoader.style'

interface GluuLoaderProps {
  blocking: boolean
  children?: React.ReactNode
}

const GluuLoader: React.FC<GluuLoaderProps> = memo(({ blocking, children }) => {
  const themeContext = use(ThemeContext)
  const currentTheme = themeContext?.state.theme || getStoredTheme()
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
