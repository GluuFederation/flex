import React, { useMemo } from 'react'
import { RefreshIcon } from '@/components/icons'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/context/theme/themeContext'
import getThemeColor from '@/context/theme/config'
import { GluuButton } from '@/components/GluuButton'
import { useStyles } from './GluuRefreshButton.style'
import type { GluuRefreshButtonProps } from './types'

export type { GluuRefreshButtonProps }

const GluuRefreshButton: React.FC<GluuRefreshButtonProps> = ({
  onClick,
  disabled = false,
  label,
  loading = false,
  className,
  variant = 'outlined',
  minHeight,
  size = 'md',
  backgroundColor: backgroundColorProp,
  textColor: textColorProp,
  borderColor: borderColorProp,
  useOpacityOnHover = true,
}) => {
  const { t } = useTranslation()
  const { classes } = useStyles()
  const { state } = useTheme()
  const themeColors = useMemo(() => getThemeColor(state.theme), [state.theme])

  const displayLabel = label ?? t('actions.refresh')

  const isOutlined = variant === 'outlined'
  const backgroundColor =
    backgroundColorProp ??
    (isOutlined ? 'transparent' : themeColors.formFooter?.back?.backgroundColor)
  const textColor =
    textColorProp ?? (isOutlined ? themeColors.fontColor : themeColors.formFooter?.back?.textColor)
  const borderColor =
    borderColorProp ??
    (isOutlined ? themeColors.fontColor : themeColors.formFooter?.back?.borderColor)

  return (
    <GluuButton
      type="button"
      className={className}
      onClick={onClick}
      disabled={disabled || loading}
      size={size}
      outlined={isOutlined}
      backgroundColor={backgroundColor}
      textColor={textColor}
      borderColor={borderColor}
      useOpacityOnHover={useOpacityOnHover}
      minHeight={minHeight}
    >
      <RefreshIcon fontSize="small" className={loading ? classes.iconSpin : classes.icon} />
      {displayLabel}
    </GluuButton>
  )
}

export default React.memo(GluuRefreshButton)
