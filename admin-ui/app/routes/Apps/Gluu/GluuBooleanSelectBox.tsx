import GluuLabel from './GluuLabel'
import GluuToogle from './GluuToogle'
import { Col, FormGroup, CustomInput, InputGroup } from 'Components'
import { useTranslation } from 'react-i18next'
import { FormikProps } from 'formik'
import { useMemo } from 'react'
import type { JsonValue } from './types/common'

interface GluuBooleanSelectBoxProps {
  label: string
  name: string
  value?: boolean | string
  formik: FormikProps<Record<string, JsonValue>>
  handler?: () => void
  lsize?: number
  rsize?: number
  doc_category?: string
  disabled?: boolean
  toToggle?: boolean
}

const GluuBooleanSelectBox = ({
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
}: GluuBooleanSelectBoxProps) => {
  const { t } = useTranslation()
  const normalizedValue = useMemo(() => {
    return typeof value === 'string' ? value === 'true' : value
  }, [value])
  return (
    <FormGroup row>
      <GluuLabel label={label} size={lsize} doc_category={doc_category} doc_entry={name} />
      <Col sm={rsize}>
        {!toToggle && (
          <InputGroup>
            <CustomInput
              type="select"
              id={name}
              name={name}
              data-testid={name}
              defaultValue={value != null ? String(value) : undefined}
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
            value={normalizedValue}
            disabled={disabled}
          />
        )}
      </Col>
    </FormGroup>
  )
}

export default GluuBooleanSelectBox
