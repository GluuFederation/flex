import React, { useCallback, useMemo } from 'react'
import { Col, FormGroup } from 'Components'
import { Input } from 'Components'
import GluuLabel from 'Routes/Apps/Gluu/GluuLabel'
import GluuSelectRow from 'Routes/Apps/Gluu/GluuSelectRow'
import { SCRIPT } from 'Utils/ApiResources'
import { useTranslation } from 'react-i18next'
import { SAML_ACRS_OPTIONS, INTERACTIVE_OPTIONS } from './constants'
import type { FormikProps } from 'formik'
import type { FormValues } from './types'

interface PersonAuthenticationFieldsProps {
  formik: FormikProps<FormValues>
  viewOnly?: boolean
  isDark?: boolean
  usageTypeChange: (value: string) => void
  getModuleProperty: (key: string, properties: FormValues['moduleProperties']) => string | undefined
}

export const PersonAuthenticationFields: React.FC<PersonAuthenticationFieldsProps> = ({
  formik,
  viewOnly,
  isDark,
  usageTypeChange,
  getModuleProperty,
}) => {
  const { t } = useTranslation()

  const interactiveOptions = useMemo(
    () =>
      INTERACTIVE_OPTIONS.map((opt) => ({
        value: opt.value,
        label: t(opt.labelKey),
      })),
    [t],
  )

  const interactiveFormik = useMemo(
    () => ({
      handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        usageTypeChange(e.target.value)
      },
      handleBlur: formik.handleBlur,
    }),
    [formik.handleBlur, usageTypeChange],
  )

  const handleAliasToggle = useCallback(
    (acr: string) => {
      const current = formik.values.aliases || []
      const updated = current.includes(acr) ? current.filter((a) => a !== acr) : [...current, acr]
      formik.setFieldValue('aliases', updated)
    },
    [formik],
  )

  return (
    <>
      <FormGroup row>
        <GluuLabel
          label="fields.saml_acrs"
          size={12}
          doc_category={SCRIPT}
          doc_entry="aliases"
          isDark={isDark}
        />
        <Col sm={12}>
          <Input
            type="select"
            multiple
            name="aliases"
            id="aliases"
            value={formik.values.aliases || []}
            disabled={viewOnly}
          >
            {SAML_ACRS_OPTIONS.map((acr) => (
              <option
                key={acr}
                value={acr}
                onMouseDown={(e) => {
                  e.preventDefault()
                  if (!viewOnly) handleAliasToggle(acr)
                }}
              >
                {acr}
              </option>
            ))}
          </Input>
        </Col>
      </FormGroup>

      <GluuSelectRow
        label="fields.interactive"
        name="usage_type"
        value={getModuleProperty('usage_type', formik.values.moduleProperties) || ''}
        formik={interactiveFormik}
        values={interactiveOptions}
        lsize={12}
        rsize={12}
        required
        doc_category={SCRIPT}
        doc_entry="usage_type"
        disabled={viewOnly}
        errorMessage={
          formik.errors.moduleProperties && formik.touched.moduleProperties
            ? String(formik.errors.moduleProperties)
            : undefined
        }
        showError={!!(formik.errors.moduleProperties && formik.touched.moduleProperties)}
        isDark={isDark}
      />
    </>
  )
}
