import React, { useMemo } from 'react'
import { FormGroup, Col } from 'Components'
import { useTranslation } from 'react-i18next'
import GluuLabel from 'Routes/Apps/Gluu/GluuLabel'
import GluuProperties from 'Routes/Apps/Gluu/GluuProperties'
import { filterEmptyObjects, mapPropertyToKeyValue } from 'Utils/Util'
import type { PropertiesSectionProps } from '../../types/props'

export function PropertiesSection({
  formik,
  disabled = false,
}: PropertiesSectionProps): JSX.Element {
  const { t } = useTranslation()

  const modulePropertiesOptions = useMemo(() => {
    return filterEmptyObjects(formik.values.moduleProperties)?.map(mapPropertyToKeyValue) || []
  }, [formik.values.moduleProperties])

  const configurationPropertiesOptions = useMemo(() => {
    return (
      filterEmptyObjects(formik.values.configurationProperties)?.map(mapPropertyToKeyValue) || []
    )
  }, [formik.values.configurationProperties])

  return (
    <>
      <FormGroup row>
        <GluuLabel
          label="fields.module_properties"
          size={3}
          doc_category="custom_script"
          doc_entry="moduleProperties"
        />
        <Col sm={9}>
          <GluuProperties
            compName="moduleProperties"
            label="fields.module_properties"
            formik={formik}
            keyPlaceholder={t('placeholders.enter_property_key')}
            valuePlaceholder={t('placeholders.enter_property_value')}
            options={modulePropertiesOptions}
            disabled={disabled}
          />
        </Col>
      </FormGroup>

      <FormGroup row>
        <GluuLabel
          label="fields.configuration_properties"
          size={3}
          doc_category="custom_script"
          doc_entry="configurationProperties"
        />
        <Col sm={9}>
          <GluuProperties
            compName="configurationProperties"
            label="fields.configuration_properties"
            formik={formik}
            keyPlaceholder={t('placeholders.enter_property_key')}
            valuePlaceholder={t('placeholders.enter_property_value')}
            options={configurationPropertiesOptions}
            disabled={disabled}
          />
        </Col>
      </FormGroup>
    </>
  )
}

export default PropertiesSection
