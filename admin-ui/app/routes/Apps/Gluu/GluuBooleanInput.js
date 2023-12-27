import React from 'react'
import GluuLabel from './GluuLabel'
import GluuTooltip from './GluuTooltip'
import { Col, FormGroup, CustomInput, InputGroup } from 'Components'
import { useTranslation } from 'react-i18next'

function GluuBooleanInput({ label, name, value, lsize, rsize, doc_category }) {
  const { t } = useTranslation()
  return (
    <GluuTooltip doc_category={doc_category} doc_entry={name}>
      <FormGroup row>
        <GluuLabel label={label} size={lsize} />
        <Col sm={rsize}>
          <InputGroup>
            <CustomInput
              type="select"
              id={name}
              name={name}
              data-testid={name}
              defaultValue={value}
            >
              <option value="false">{t('options.false')}</option>
              <option value="true">{t('options.true')}</option>
            </CustomInput>
          </InputGroup>
        </Col>
      </FormGroup>
    </GluuTooltip>
  )
}

export default GluuBooleanInput
