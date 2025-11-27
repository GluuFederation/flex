import React, { ChangeEvent } from 'react'
import { Col, FormGroup, Input, InputGroup, CustomInput } from 'Components'
import GluuLabel from 'Routes/Apps/Gluu/GluuLabel'
import { SCRIPT } from 'Utils/ApiResources'
import { useTranslation } from 'react-i18next'
import customColors from '@/customColors'
import { SAML_ACRS_OPTIONS } from './constants'
import type { FormikProps } from 'formik'
import type { FormValues } from './types'

interface PersonAuthenticationFieldsProps {
  formik: FormikProps<FormValues>
  viewOnly?: boolean
  usageTypeChange: (value: string) => void
  getModuleProperty: (key: string, properties: FormValues['moduleProperties']) => string | undefined
}

export const PersonAuthenticationFields: React.FC<PersonAuthenticationFieldsProps> = ({
  formik,
  viewOnly,
  usageTypeChange,
  getModuleProperty,
}) => {
  const { t } = useTranslation()

  return (
    <>
      <FormGroup row>
        <GluuLabel label="fields.saml_acrs" doc_category={SCRIPT} doc_entry="aliases" />
        <Col sm={9}>
          <Input
            type="select"
            name="aliases"
            id="aliases"
            value={formik.values.aliases}
            multiple
            disabled={viewOnly}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              const target = e.target as unknown as HTMLSelectElement
              const values = Array.from(target.selectedOptions).map((o) => o.value)
              formik.setFieldValue('aliases', values)
            }}
          >
            {SAML_ACRS_OPTIONS.map((acr) => (
              <option key={acr} value={acr}>
                {acr}
              </option>
            ))}
          </Input>
        </Col>
      </FormGroup>

      <FormGroup row>
        <GluuLabel label="Interactive" required doc_category={SCRIPT} doc_entry="usage_type" />
        <Col sm={9}>
          <InputGroup>
            <CustomInput
              type="select"
              id="usage_type"
              name="usage_type"
              disabled={viewOnly}
              value={getModuleProperty('usage_type', formik.values.moduleProperties) || ''}
              onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                usageTypeChange(e.target.value)
              }}
            >
              <option value="">{t('options.choose')}...</option>
              <option value="interactive">Web</option>
              <option value="service">Native</option>
              <option value="both">Both methods</option>
            </CustomInput>
          </InputGroup>
          {formik.errors.moduleProperties && formik.touched.moduleProperties && (
            <div style={{ color: customColors.accentRed }}>
              {String(formik.errors.moduleProperties)}
            </div>
          )}
        </Col>
      </FormGroup>
    </>
  )
}
