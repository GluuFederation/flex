import React, { useState, useCallback, useMemo } from 'react'
import { Form } from 'Components'
import { useGetCustomScriptType } from 'JansConfigApi'
import GluuCommitDialog from 'Routes/Apps/Gluu/GluuCommitDialog'
import GluuFormFooter from 'Routes/Apps/Gluu/GluuFormFooter'
import { useTranslation } from 'react-i18next'
import { SCRIPT } from 'Utils/ApiResources'
import { adminUiFeatures } from 'Plugins/admin/helper/utils'
import type { ScriptFormProps } from './types/props'
import { useScriptForm } from './hooks'
import { ScriptErrorAlert } from './components/shared'
import {
  BasicInfoFields,
  ScriptTypeFields,
  LocationFields,
  PropertiesSection,
} from './components/ScriptForm'
import { formatScriptTypeName } from './constants'

function ScriptForm({ item, handleSubmit, viewOnly = false, mode }: ScriptFormProps): JSX.Element {
  const { t } = useTranslation()
  const [modal, setModal] = useState(false)

  // Fetch script types
  const { data: scriptTypesData, isLoading: loadingScriptTypes } = useGetCustomScriptType()

  const scriptTypes = useMemo(
    () =>
      (scriptTypesData || []).map((type) => ({
        value: type,
        name: formatScriptTypeName(type),
      })),
    [scriptTypesData],
  )

  // Initialize form with custom hook
  const formHelper = useScriptForm({
    script: item,
    mode,
    onSubmit: handleSubmit,
    disabled: viewOnly,
  })

  const toggle = useCallback(() => {
    setModal((prev) => !prev)
  }, [])

  const submitForm = useCallback(() => {
    toggle()
    formHelper.formik.handleSubmit()
  }, [toggle, formHelper.formik])

  return (
    <>
      <ScriptErrorAlert error={item.scriptError} />

      <Form onSubmit={formHelper.formik.handleSubmit}>
        {/* Basic Information Section */}
        <BasicInfoFields
          formik={formHelper.formik}
          scriptTypes={scriptTypes}
          disabled={viewOnly}
          loadingScriptTypes={loadingScriptTypes}
        />

        {/* Script Type-Specific Fields */}
        <ScriptTypeFields
          formik={formHelper.formik}
          scriptType={formHelper.values.scriptType}
          disabled={viewOnly}
        />

        {/* Location Fields (File vs Database) */}
        <LocationFields
          formik={formHelper.formik}
          locationType={formHelper.values.location_type}
          onLocationTypeChange={formHelper.handleLocationTypeChange}
          disabled={viewOnly}
        />

        {/* Properties Section */}
        <PropertiesSection formik={formHelper.formik} disabled={viewOnly} />

        {/* Form Footer with Actions */}
        <GluuFormFooter
          hideButtons={{ save: viewOnly, back: false }}
          saveHandler={toggle}
          goBackHandler={formHelper.handleNavigateBack}
        />

        {/* Commit Confirmation Dialog */}
        {!viewOnly && (
          <GluuCommitDialog
            handler={toggle}
            modal={modal}
            onAccept={submitForm}
            formik={formHelper.formik}
            feature={adminUiFeatures.custom_script_write}
            resource={SCRIPT}
          />
        )}
      </Form>
    </>
  )
}

export default ScriptForm
