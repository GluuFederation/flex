import { memo, CSSProperties, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { FormGroup, Label, Badge } from 'Components'
import GluuTooltip from './GluuTooltip'
import customColors from '@/customColors'

interface GluuFormDetailRowProps {
  label: string
  value?: string | number | boolean | null
  isBadge?: boolean
  badgeColor?: string
  lsize?: number
  rsize?: number
  doc_category?: string
  doc_entry?: string
  isDirect?: boolean
  labelStyle?: CSSProperties
  rowClassName?: string
}

const defaultLabelStyle: CSSProperties = { fontWeight: 'bold' }

function GluuFormDetailRow({
  label,
  value,
  isBadge,
  badgeColor,
  lsize = 6,
  rsize = 6,
  doc_category,
  doc_entry,
  isDirect = false,
  labelStyle,
  rowClassName,
}: GluuFormDetailRowProps) {
  const { t } = useTranslation()
  const labelColor = useMemo(() => customColors.primaryDark, [])

  const appliedLabelStyle: CSSProperties = useMemo(
    () => ({
      ...defaultLabelStyle,
      color: labelColor,
      ...labelStyle,
    }),
    [labelColor, labelStyle],
  )

  const valueLabelStyle: CSSProperties = useMemo(
    () => ({
      color: labelColor,
    }),
    [labelColor],
  )

  return (
    <GluuTooltip doc_category={doc_category} isDirect={isDirect} doc_entry={doc_entry || label}>
      <FormGroup row className={rowClassName}>
        <Label for={label} style={appliedLabelStyle} sm={lsize}>
          {t(label)}:
        </Label>
        <Label for={value?.toString()} style={valueLabelStyle} sm={rsize}>
          {!isBadge ? value : <Badge color={badgeColor ? badgeColor : 'primary'}>{value}</Badge>}
        </Label>
      </FormGroup>
    </GluuTooltip>
  )
}
export default memo(GluuFormDetailRow)
