import React, { ChangeEvent, useMemo } from 'react'
import { Col, FormGroup, Input, InputGroup, CustomInput } from 'Components'
import GluuLabel from 'Routes/Apps/Gluu/GluuLabel'
import { SCRIPT } from 'Utils/ApiResources'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/context/theme/themeContext'
import getThemeColor from '@/context/theme/config'
import { DEFAULT_THEME } from '@/context/theme/constants'
import { useStyles } from './styles/PersonAuthenticationFields.style'
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
  const { state: themeState } = useTheme()
  const themeColors = useMemo(
    () => getThemeColor(themeState?.theme ?? DEFAULT_THEME),
    [themeState?.theme],
  )
  const { classes } = useStyles({ themeColors })

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
              const target = e.target
              if (target instanceof HTMLSelectElement) {
                const values = Array.from(target.selectedOptions).map((o) => o.value)
                formik.setFieldValue('aliases', values)
              }
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
        <GluuLabel
          label="fields.interactive"
          required
          doc_category={SCRIPT}
          doc_entry="usage_type"
        />
        <Col sm={9}>
          <InputGroup>
            <CustomInput
              type="select"
              id="usage_type"
              name="usage_type"
              disabled={viewOnly}
              value={getModuleProperty('usage_type', formik.values.moduleProperties) || ''}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                usageTypeChange(e.target.value)
              }}
            >
              <option value="">{t('options.choose')}...</option>
              <option value="interactive">{t('options.usage_type_web')}</option>
              <option value="service">{t('options.usage_type_native')}</option>
              <option value="both">{t('options.usage_type_both')}</option>
            </CustomInput>
          </InputGroup>
          {formik.errors.moduleProperties && formik.touched.moduleProperties && (
            <div className={classes.errorText}>{String(formik.errors.moduleProperties)}</div>
          )}
        </Col>
      </FormGroup>
    </>
  )
}
