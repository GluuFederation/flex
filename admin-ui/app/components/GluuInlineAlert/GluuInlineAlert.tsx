import React, { useMemo } from 'react'
import { useTheme } from '@/context/theme/themeContext'
import getThemeColor from '@/context/theme/config'
import GluuText from '@/routes/Apps/Gluu/GluuText'
import { useStyles } from './GluuInlineAlert.style'
import type { GluuInlineAlertProps, GluuInlineAlertSeverity } from './types'

const DEFAULT_SEVERITY: GluuInlineAlertSeverity = 'error'

const GluuInlineAlertComponent = ({
  title,
  detail,
  severity = DEFAULT_SEVERITY,
  className,
}: GluuInlineAlertProps) => {
  const { state } = useTheme()
  const themeColors = useMemo(() => getThemeColor(state.theme), [state.theme])
  const effectiveSeverity: GluuInlineAlertSeverity = severity ?? DEFAULT_SEVERITY
  const styleParams = useMemo(
    () => ({ themeColors, severity: effectiveSeverity }),
    [themeColors, effectiveSeverity],
  )
  const { classes } = useStyles(styleParams)
  const rootClassName = useMemo(
    () => [classes.root, className].filter(Boolean).join(' '),
    [classes.root, className],
  )
  const showDetail = detail != null && detail !== ''

  return (
    <div className={rootClassName} role="alert">
      <GluuText variant="p" className={classes.title} disableThemeColor>
        {title}
      </GluuText>
      {showDetail && (
        <GluuText variant="p" className={classes.detail} disableThemeColor>
          {detail}
        </GluuText>
      )}
    </div>
  )
}

export default React.memo(GluuInlineAlertComponent)
