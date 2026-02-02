import React, { memo, useContext, useMemo } from 'react'
import { ThemeContext } from '@/context/theme/themeContext'
import getThemeColor from '@/context/theme/config'
import { DEFAULT_THEME } from '@/context/theme/constants'
import customColors from '@/customColors'
import { useStyles } from './GluuPageContent.style'
import type { GluuPageContentProps } from './types'

const GluuPageContent: React.FC<GluuPageContentProps> = memo(
  ({ children, className, withVerticalPadding = true, maxWidth, backgroundColor }) => {
    const themeContext = useContext(ThemeContext)
    const currentTheme = useMemo(
      () => themeContext?.state.theme || DEFAULT_THEME,
      [themeContext?.state.theme],
    )
    const themeColors = useMemo(() => getThemeColor(currentTheme), [currentTheme])
    const background = backgroundColor ?? themeColors?.background ?? customColors.lightBackground

    const { classes } = useStyles({
      withVerticalPadding,
      maxWidth,
      background,
    })

    return (
      <div className={`${classes.root} ${className ?? ''}`.trim()}>
        {maxWidth ? <div className={classes.wrapper}>{children}</div> : children}
      </div>
    )
  },
)

GluuPageContent.displayName = 'GluuPageContent'

export default GluuPageContent
