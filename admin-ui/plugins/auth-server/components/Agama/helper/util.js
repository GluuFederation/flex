// Utility functions and components for Agama Alias
import React from 'react'
import { Row, Col } from 'Components'
import GluuFormDetailRow from 'Routes/Apps/Gluu/GluuFormDetailRow'

export function AgamaAliasDetailRow({ label, value }) {
  return (
    <Row>
      <Col sm={6}>
        <GluuFormDetailRow label={label[0]} value={value[0]} />
      </Col>
      {label[1] && value[1] && (
        <Col sm={6}>
          <GluuFormDetailRow label={label[1]} value={value[1]} />
        </Col>
      )}
    </Row>
  )
}
