import { memo, CSSProperties, useMemo, useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { FormGroup, Label, Badge, GluuBadge } from 'Components'
import GluuTooltip from './GluuTooltip'
import customColors from '@/customColors'
import { ThemeContext } from 'Context/theme/themeContext'
import getThemeColor from 'Context/theme/config'
import { DEFAULT_THEME } from '@/context/theme/constants'

interface GluuFormDetailRowProps {
  label: string
  value?: string | number | boolean | null
  isBadge?: boolean
  badgeColor?: string
  badgeBackgroundColor?: string
  badgeTextColor?: string
  lsize?: number
  rsize?: number
  doc_category?: string
  doc_entry?: string
  isDirect?: boolean
  labelStyle?: CSSProperties
  valueStyle?: CSSProperties
  rowClassName?: string
  /** When 'column', label stacks above value (avoids overlap on narrow screens) */
  layout?: 'row' | 'column'
}

const defaultLabelStyle: CSSProperties = { fontWeight: 'bold' }

function GluuFormDetailRow({
  label,
  value,
  isBadge,
  badgeColor,
  badgeBackgroundColor,
  badgeTextColor,
  lsize = 6,
  rsize = 6,
  doc_category,
  doc_entry,
  isDirect = false,
  labelStyle,
  valueStyle,
  rowClassName,
  layout = 'row',
}: GluuFormDetailRowProps) {
  const { t } = useTranslation()
  const theme = useContext(ThemeContext)
  const selectedTheme = theme?.state?.theme || DEFAULT_THEME
  const themeColors = useMemo(() => getThemeColor(selectedTheme), [selectedTheme])

  const appliedLabelStyle: CSSProperties = useMemo(
    () => ({
      ...defaultLabelStyle,
      color: themeColors.textMuted ?? themeColors.fontColor,
      ...labelStyle,
    }),
    [labelStyle, themeColors.textMuted, themeColors.fontColor],
  )

  const valueLabelStyle: CSSProperties = useMemo(
    () => ({
      color: themeColors.fontColor,
      ...valueStyle,
    }),
    [themeColors.fontColor, valueStyle],
  )

  const badgeStyle: CSSProperties = useMemo(
    () => ({
      backgroundColor: themeColors.background,
      color: customColors.white,
    }),
    [themeColors.background],
  )

  const formGroupProps = {
    row: layout === 'row',
    className: rowClassName,
    style:
      layout === 'column'
        ? { display: 'flex', flexDirection: 'column' as const, gap: 4 }
        : undefined,
  }

  return (
    <GluuTooltip doc_category={doc_category} isDirect={isDirect} doc_entry={doc_entry || label}>
      <FormGroup {...formGroupProps}>
        <Label for={label} style={appliedLabelStyle} sm={layout === 'row' ? lsize : 12}>
          {t(label)}:
        </Label>
        <Label for={value?.toString()} style={valueLabelStyle} sm={layout === 'row' ? rsize : 12}>
          {!isBadge ? (
            value
          ) : badgeBackgroundColor != null && badgeTextColor != null ? (
            <GluuBadge
              size="sm"
              backgroundColor={badgeBackgroundColor}
              textColor={badgeTextColor}
              borderColor={badgeBackgroundColor}
            >
              {value}
            </GluuBadge>
          ) : (
            <Badge style={badgeColor ? undefined : badgeStyle} color={badgeColor}>
              {value}
            </Badge>
          )}
        </Label>
      </FormGroup>
    </GluuTooltip>
  )
}
export default memo(GluuFormDetailRow)
