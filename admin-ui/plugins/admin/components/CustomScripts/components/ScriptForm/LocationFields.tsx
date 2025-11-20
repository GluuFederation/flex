import React, { Suspense, lazy } from 'react'
import { FormGroup, Input, CustomInput, Col, InputGroup } from 'Components'
import { useTranslation } from 'react-i18next'
import GluuLabel from 'Routes/Apps/Gluu/GluuLabel'
import GluuSuspenseLoader from 'Routes/Apps/Gluu/GluuSuspenseLoader'
import type { LocationFieldsProps } from '../../types/props'
import { LOCATION_TYPES } from '../../constants'

const GluuInputEditor = lazy(() => import('Routes/Apps/Gluu/GluuInputEditor'))

export function LocationFields({
  formik,
  locationType,
  onLocationTypeChange,
  disabled = false,
}: LocationFieldsProps): JSX.Element {
  const { t } = useTranslation()

  const isFileBased = locationType === LOCATION_TYPES.FILE
  const isDatabaseBased = locationType === LOCATION_TYPES.DATABASE

  return (
    <>
      <FormGroup row>
        <GluuLabel
          label="fields.location_type"
          size={3}
          required
          doc_category="custom_script"
          doc_entry="locationType"
        />
        <Col sm={9}>
          <CustomInput
            type="select"
            id="location_type"
            name="location_type"
            value={locationType}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
              onLocationTypeChange(e.target.value as 'db' | 'file')
            }}
            disabled={disabled}
          >
            <option value={LOCATION_TYPES.DATABASE}>{t('options.database')}</option>
            <option value={LOCATION_TYPES.FILE}>{t('options.file')}</option>
          </CustomInput>
        </Col>
      </FormGroup>

      {isFileBased && (
        <FormGroup row>
          <GluuLabel
            label="fields.script_path"
            size={3}
            required
            doc_category="custom_script"
            doc_entry="locationPath"
          />
          <Col sm={9}>
            <InputGroup>
              <Input
                id="script_path"
                name="script_path"
                type="text"
                placeholder={t('placeholders.script_path')}
                value={formik.values.script_path}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={disabled}
                invalid={!!(formik.touched.script_path && formik.errors.script_path)}
              />
            </InputGroup>
            {formik.touched.script_path && formik.errors.script_path && (
              <div className="invalid-feedback d-block">{formik.errors.script_path}</div>
            )}
            <small className="form-text text-muted">{t('messages.script_path_description')}</small>
          </Col>
        </FormGroup>
      )}

      {isDatabaseBased && (
        <Suspense fallback={<GluuSuspenseLoader />}>
          <GluuInputEditor
            name="script"
            label="fields.script"
            formik={formik}
            value={formik.values.script || ''}
            required
            lsize={3}
            rsize={9}
            doc_category="custom_script"
            doc_entry="script"
            readOnly={disabled}
            language={formik.values.programmingLanguage === 'python' ? 'python' : 'java'}
            width="100%"
            height="400px"
            showError={!!(formik.touched.script && formik.errors.script)}
            errorMessage={formik.errors.script}
          />
        </Suspense>
      )}
    </>
  )
}

export default LocationFields
