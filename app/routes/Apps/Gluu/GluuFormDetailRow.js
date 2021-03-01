import React from 'react'
import { FormGroup, Label, Badge } from '../../../components'
function GluuFormDetailRow({ label, value, isBadge, badgeColor }) {
  return (
    <FormGroup row>
      <Label for="input" sm={6}>
        {label}:
      </Label>
      <Label for="input" sm={6}>
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
