import { Col, FormGroup, Input } from 'Components'
import GluuLabel from './GluuLabel'

function GluuCheckBoxRow({
  label,
  name,
  value,
  required = false,
  lsize = 3,
  rsize = 9,
  handleOnChange,
  doc_category,
}: any) {
  return (
    <FormGroup row>
      <GluuLabel label={label} size={lsize} required={required} doc_category={doc_category} doc_entry={name} />
      <Col sm={rsize}>
        <Input
          id={name}
          type="checkbox"
          name={name}
          data-testid={name}
          defaultChecked={value}
          onChange={handleOnChange}
        />
      </Col>
    </FormGroup>
  )
}
export default GluuCheckBoxRow
