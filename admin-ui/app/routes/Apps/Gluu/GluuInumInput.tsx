import { Col, FormGroup, Input } from 'Components'
import GluuLabel from './GluuLabel'
import { OPACITY } from '@/constants'
import type { GluuInumInputProps } from './types/GluuInumInput.types'

const GluuInumInput = ({
  label,
  name,
  value,
  lsize = 4,
  rsize = 8,
  doc_category,
  isDark,
}: GluuInumInputProps) => {
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
          id={name}
          data-testid={name}
          name={name}
          disabled
          value={value}
          style={{ opacity: OPACITY.DISABLED }}
        />
      </Col>
    </FormGroup>
  )
}
export default GluuInumInput
