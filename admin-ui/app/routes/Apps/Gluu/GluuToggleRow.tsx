import { FormGroup, Col } from 'Components'
import GluuLabel from 'Routes/Apps/Gluu/GluuLabel'
import Toggle from 'react-toggle'
import type { JsonValue } from './types/common'
import type { GluuToggleRowProps } from './types/GluuToggleRow.types'

const GluuToggleRow = <T extends object = Record<string, JsonValue>>({
  formik,
  label,
  viewOnly = false,
  lsize = 4,
  rsize = 8,
  name,
  doc_category,
}: GluuToggleRowProps<T>) => {
  return (
    <FormGroup row>
      <GluuLabel label={label} size={lsize} doc_category={doc_category} doc_entry={name} />
      <Col sm={rsize}>
        <Toggle
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            formik.setFieldValue(name, event.target.checked)
          }}
          checked={Boolean(formik.values[name as keyof T])}
          disabled={viewOnly}
        />
      </Col>
    </FormGroup>
  )
}

export default GluuToggleRow
