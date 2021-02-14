import React from 'react'
import { EmptyLayout, Label } from '../../../app/components'
function ByeBye() {
  return (
    <EmptyLayout>
      <EmptyLayout.Section center>
        <Label style={{ fontSize: '2em', fontWeight: 'bold' }}>
          Thanks for using the admin ui.
        </Label>
      </EmptyLayout.Section>
    </EmptyLayout>
  )
}

export default ByeBye
