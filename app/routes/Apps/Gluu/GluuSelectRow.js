import React from 'react'
import GluuLabel from './GluuLabel'
import { Col, FormGroup, CustomInput, InputGroup } from '../../../components'
import { useTranslation } from 'react-i18next'

function GluuSelectRow({ label, name, value, formik, values, lsize, rsize }) {
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
            <option value="">{t("Choose")}...</option>
            {values.map((item, key) => (
              <option value={item} key={key}>
                {item}
              </option>
            ))}
          </CustomInput>
        </InputGroup>
      </Col>
    </FormGroup>
  )
}

GluuSelectRow.defaultProps = {
  values: [],
  lsize: 3,
  rsize: 9,
}

export default GluuSelectRow
