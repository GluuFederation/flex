import React from 'react'
import GluuLabel from './GluuLabel'
import { Col, FormGroup, CustomInput, InputGroup } from '../../../components'
import { useTranslation } from 'react-i18next'

function GluuBooleanSelectBox({ label, name, value, formik, lsize, rsize }) {
  const { t } = useTranslation()
  return (
    <FormGroup row>
      <GluuLabel label={label} size={lsize} />
      <Col sm={rsize}>
        <InputGroup>
          <CustomInput
            type="select"
            id={name}
            name={name}
            defaultValue={value}
            onChange={formik.handleChange}
          >
            <option value="false">{t('options.false')}</option>
            <option value="true">{t('options.true')}</option>
          </CustomInput>
        </InputGroup>
      </Col>
    </FormGroup>
  )
}

export default GluuBooleanSelectBox
