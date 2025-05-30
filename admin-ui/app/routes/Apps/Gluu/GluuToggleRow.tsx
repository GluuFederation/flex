// @ts-nocheck
import React from 'react'
import { FormGroup, Col } from 'Components'
import GluuLabel from 'Routes/Apps/Gluu/GluuLabel'
import Toggle from 'react-toggle'
import PropTypes from 'prop-types'

const GluuToggleRow = ({
  formik,
  label,
  viewOnly = false,
  lsize = 4,
  rsize = 8,
  name,
  doc_category
}) => {
  return (
    <FormGroup row>
      <GluuLabel label={label} size={lsize} doc_category={doc_category} doc_entry={name}/>
      <Col sm={rsize}>
        <Toggle
          onChange={(event) => {
            formik.setFieldValue(name, event.target.checked)
          }}
          checked={formik.values[name]}
          disabled={viewOnly}
        />
      </Col>
    </FormGroup>
  )
}

export default GluuToggleRow
GluuToggleRow.propTypes = {
  formik: PropTypes.object,
  label: PropTypes.string,
  viewOnly: PropTypes.bool,
  lsize: PropTypes.number,
  rsize: PropTypes.number,
  name: PropTypes.string
}
