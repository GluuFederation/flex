import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/context/theme/themeContext'
import getThemeColor from '@/context/theme/config'
import { GluuButton } from '@/components/GluuButton'
import { fontSizes } from '@/styles/fonts'

export interface GluuRefreshButtonProps {
  onClick: () => void
  disabled?: boolean
  label?: string
  loading?: boolean
  className?: string
  variant?: 'primary' | 'outlined'
  minHeight?: number
  size?: 'sm' | 'md' | 'lg'
  backgroundColor?: string
  textColor?: string
  borderColor?: string
  useOpacityOnHover?: boolean
}

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
      <i
        className={`fa fa-refresh ${loading ? 'fa-spin' : ''}`}
        style={{ fontSize: fontSizes.md }}
      />
      {displayLabel}
    </GluuButton>
  )
}

export default React.memo(GluuRefreshButton)
