import React from 'react'
import { useTranslation } from 'react-i18next'
import { FormGroup, Label, Badge } from '../../../components'
import GluuTooltip from './GluuTooltip'
function GluuFormDetailRow({
  label,
  value,
  isBadge,
  badgeColor,
  lsize,
  rsize,
  doc_category,
  doc_entry,
}) {
  const { t } = useTranslation()
  return (
    <GluuTooltip doc_category={doc_category} doc_entry={doc_entry || label}>
      <FormGroup row>
        <Label for={label} sm={lsize || 6}>
          {t(label)}:
        </Label>
        <Label for={value} sm={rsize || 6}>
          {!isBadge ? (
            value
          ) : (
            <Badge color={badgeColor ? badgeColor : 'primary'}>{value}</Badge>
          )}
        </Label>
      </FormGroup>
    </GluuTooltip>
  )
}
export default GluuFormDetailRow
