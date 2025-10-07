// Utility functions and components for Agama Alias
import React from 'react'
import { Row, Col } from 'Components'
import PropTypes from 'prop-types'
import GluuFormDetailRow from 'Routes/Apps/Gluu/GluuFormDetailRow'

export function AgamaAliasDetailRow({ label = [], value = [] }) {
  const [label1, label2] = Array.isArray(label) ? label : [label, undefined]
  const [value1, value2] = Array.isArray(value) ? value : [value, undefined]
  return (
    <Row>
      <Col sm={6}>
        <GluuFormDetailRow label={label1} value={value1} />
      </Col>
      {label2 != null && value2 != null && (
        <Col sm={6}>
          <GluuFormDetailRow label={label2} value={value2} />
        </Col>
      )}
    </Row>
  )
}

AgamaAliasDetailRow.propTypes = {
  label: PropTypes.array,
  value: PropTypes.array,
}

export default AgamaAliasDetailRow
