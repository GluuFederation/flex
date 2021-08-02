import React from 'react'
import { useTranslation } from 'react-i18next'
import { FormGroup, Label, Badge } from '../../../components'
function GluuFormDetailRow({ label, value, isBadge, badgeColor, lsize, rsize }) {
  const { t } = useTranslation()
  return (
    <FormGroup row>
      <Label for="input" sm={lsize || 6}>
        {t(label)}:
      </Label>
      <Label for="input" sm={rsize || 6}>
        {!isBadge ? (
          value
        ) : (
          <Badge color={badgeColor ? badgeColor : 'primary'}>{value}</Badge>
        )}
      </Label>
    </FormGroup>
  )
}
export default GluuFormDetailRow
