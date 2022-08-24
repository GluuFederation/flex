import React from 'react'
import GluuLabel from './GluuLabel'
import GluuTooltip from './GluuTooltip'
import { Col, FormGroup, CustomInput, InputGroup } from 'Components'
import { useTranslation } from 'react-i18next'

function GluuBooleanSelectBox({
  label,
  name,
  value,
  formik,
  lsize,
  rsize,
  doc_category,
  disabled,
}) {
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
              onChange={formik.handleChange}
              disabled={disabled}
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

export default GluuBooleanSelectBox
