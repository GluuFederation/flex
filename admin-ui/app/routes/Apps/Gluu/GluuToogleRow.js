import React from 'react'
import { Col, FormGroup } from 'Components'
import GluuLabel from './GluuLabel'
import GluuTooltip from './GluuTooltip'
import GluuToogle from './GluuToogle'

function GluuToogleRow({
  label,
  name,
  value,
  formik,
  lsize,
  handler,
  rsize,
  doc_category ="no_category",
}) {
  return (
    <GluuTooltip doc_category={doc_category} doc_entry={name}>
      <FormGroup row>
        <GluuLabel label={label} size={lsize} />
        <Col sm={rsize}>
          <GluuToogle
            id={name}
            data-testid={name}
            name={name}
            handler={handler}
            formik={formik}
            value={value}
          />
        </Col>
      </FormGroup>
    </GluuTooltip>
  )
}
GluuToogleRow.defaultProps = {
  lsize: 3,
  rsize: 9,
}

export default GluuToogleRow
