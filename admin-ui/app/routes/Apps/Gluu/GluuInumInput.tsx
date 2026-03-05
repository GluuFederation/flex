import { Col, FormGroup, Input } from 'Components'
import GluuLabel from './GluuLabel'
import customColors from '@/customColors'

const GluuInumInput = ({ label, name, value, lsize = 4, rsize = 8, doc_category, isDark }: any) => {
  return (
    <FormGroup row>
      <GluuLabel
        label={label}
        size={lsize}
        doc_category={doc_category}
        doc_entry={name}
        isDark={isDark}
      />
      <Col sm={rsize}>
        <Input
          style={{ backgroundColor: customColors.whiteSmoke }}
          id={name}
          data-testid={name}
          name={name}
          disabled
          value={value}
        />
      </Col>
    </FormGroup>
  )
}
export default GluuInumInput
