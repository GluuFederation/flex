import React from 'react'
import GluuLabel from './GluuLabel'
import GluuTooltip from './GluuTooltip'
import GluuToogle from './GluuToogle'
import { Col, FormGroup, CustomInput, InputGroup } from 'Components'
import { useTranslation } from 'react-i18next'

function GluuBooleanSelectBox({
  label,
  name,
  value,
  formik,
  handler,
  lsize,
  rsize,
  doc_category,
  disabled,
  toToggle = true,
}) {
  const { t } = useTranslation()
  return (
    
      <FormGroup row>
        <GluuLabel label={label} size={lsize} doc_category={doc_category} doc_entry={name}/>
        <Col sm={rsize}>
          {!toToggle && (
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
          )}
          {toToggle && (
            <GluuToogle
              id={name}
              data-testid={name}
              name={name}
              handler={handler}
              formik={formik}
              value={value}
              disabled={disabled}
            />
          )}
        </Col>
      </FormGroup>
    
  )
}

export default GluuBooleanSelectBox
