import { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { FormGroup, Label, Badge } from 'Components'
import GluuTooltip from './GluuTooltip'
import { ThemeContext } from 'Context/theme/themeContext'

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
}: any) {
  const { t } = useTranslation()
  const theme: any = useContext(ThemeContext)
  const selectedTheme = theme.state.theme

  return (
    <GluuTooltip doc_category={doc_category} isDirect={isDirect} doc_entry={doc_entry || label}>
      <FormGroup row>
        <Label for={label} style={{ fontWeight: 'bold' }} sm={lsize || 6}>
          {t(label)}:
        </Label>
        <Label for={value?.toString()} sm={rsize || 6}>
          {!isBadge ? (
            value
          ) : (
            <Badge color={badgeColor ? badgeColor : `primary-${selectedTheme}`}>{value}</Badge>
          )}
        </Label>
      </FormGroup>
    </GluuTooltip>
  )
}
export default GluuFormDetailRow
