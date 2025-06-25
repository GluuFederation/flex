import { FormGroup, Col } from 'Components'
import GluuLabel from 'Routes/Apps/Gluu/GluuLabel'
import Toggle from 'react-toggle'

const GluuToggleRow = ({
  formik,
  label,
  viewOnly = false,
  lsize = 4,
  rsize = 8,
  name,
  doc_category,
}: any) => {
  return (
    <FormGroup row>
      <GluuLabel label={label} size={lsize} doc_category={doc_category} doc_entry={name} />
      <Col sm={rsize}>
        <Toggle
          onChange={(event: any) => {
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
