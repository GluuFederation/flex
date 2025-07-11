import { Col, FormGroup, Input } from 'Components'
import GluuLabel from './GluuLabel'
import GluuTooltip from './GluuTooltip'
import customColors from '@/customColors'

function GluuInumInput({ label, name, value, lsize = 4, rsize = 8, doc_category }: any) {
  return (
    <GluuTooltip doc_category={doc_category} doc_entry={name}>
      <FormGroup row>
        <GluuLabel label={label} size={lsize} />
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
    </GluuTooltip>
  )
}
export default GluuInumInput
