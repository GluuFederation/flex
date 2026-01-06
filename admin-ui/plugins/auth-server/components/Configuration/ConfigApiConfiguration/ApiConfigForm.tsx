import React, { useCallback, useState, useEffect, useMemo, useRef } from 'react'
import { useFormik } from 'formik'
import GluuCommitDialog from 'Routes/Apps/Gluu/GluuCommitDialog'
import { FormGroup, Form } from 'Components'
import { useCedarling } from '@/cedarling'
import { CEDAR_RESOURCE_SCOPES } from '@/cedarling/constants/resourceScopes'
import { ADMIN_UI_RESOURCES } from '@/cedarling/utility'
import GluuFormFooter from 'Routes/Apps/Gluu/GluuFormFooter'
import JsonPropertyBuilderConfigApi from './JsonPropertyBuilderConfigApi'
import type { ApiAppConfiguration, JsonPatch } from './types'
import type { PropertyValue } from '../types'
import { useAppNavigation, ROUTES } from '@/helpers/navigation'
import { READ_ONLY_FIELDS } from './utils'
import type { GluuCommitDialogOperation, JsonValue } from 'Routes/Apps/Gluu/types'
import { configApiPropertiesSchema } from './validations'

interface ApiConfigFormProps {
  configuration: ApiAppConfiguration
  onSubmit: (patches: JsonPatch[], message: string) => Promise<void>
}

const CONFIG_API_RESOURCE_ID = ADMIN_UI_RESOURCES.ConfigApiConfiguration
const configApiScopes = CEDAR_RESOURCE_SCOPES[CONFIG_API_RESOURCE_ID] || []

const ApiConfigForm: React.FC<ApiConfigFormProps> = ({ configuration, onSubmit }) => {
  const { authorizeHelper, hasCedarWritePermission } = useCedarling()
  const { navigateToRoute } = useAppNavigation()
  const [modal, setModal] = useState(false)
  const [patches, setPatches] = useState<JsonPatch[]>([])
  const [resetKey, setResetKey] = useState(0)
  const baselineConfigurationRef = useRef<ApiAppConfiguration>(
    JSON.parse(JSON.stringify(configuration)),
  )
  const previousConfigurationRef = useRef<ApiAppConfiguration | null>(null)

  const canWriteConfigApi = useMemo(
    () => hasCedarWritePermission(CONFIG_API_RESOURCE_ID),
    [hasCedarWritePermission],
  )

  const formik = useFormik<ApiAppConfiguration>({
    initialValues: configuration,
    validationSchema: configApiPropertiesSchema,
    enableReinitialize: true,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: () => {
      // Form submission is handled by handleFormSubmit wrapper
    },
  })

  const handleFormSubmit = useCallback(async () => {
    if (patches.length === 0) {
      return
    }

    const errors = await formik.validateForm()
    if (Object.keys(errors).length > 0 || !formik.isValid) {
      return
    }

    setModal(true)
  }, [patches, formik])

  useEffect(() => {
    const configChanged =
      previousConfigurationRef.current === null ||
      JSON.stringify(previousConfigurationRef.current) !== JSON.stringify(configuration)

    if (configuration && configChanged) {
      if (patches.length === 0) {
        baselineConfigurationRef.current = JSON.parse(JSON.stringify(configuration))
        previousConfigurationRef.current = JSON.parse(JSON.stringify(configuration))
        formik.resetForm({
          values: configuration,
          touched: {},
          errors: {},
        })
        setResetKey((prev) => prev + 1)
      }
    }
  }, [configuration, patches.length, formik])

  useEffect(() => {
    if (configApiScopes && configApiScopes.length > 0) {
      authorizeHelper(configApiScopes)
    }
  }, [authorizeHelper, configApiScopes])

  const operations: GluuCommitDialogOperation[] = useMemo(
    () =>
      patches.map((patch) => ({
        path: patch.path as string,
        value: patch.op === 'remove' ? null : (patch.value as JsonValue),
      })),
    [patches],
  )

  const hasChanges = useMemo(() => {
    return patches.length > 0 || formik.dirty
  }, [patches.length, formik.dirty])

  const patchHandler = useCallback(
    (patch: JsonPatch) => {
      setPatches((existingPatches) => {
        const filteredPatches = existingPatches.filter(
          (existingPatch) => existingPatch.path !== patch.path,
        )
        return [...filteredPatches, patch]
      })

      const fieldPath = typeof patch.path === 'string' ? patch.path.replace(/^\//, '') : ''

      if (fieldPath && patch.op !== 'remove') {
        formik.setFieldValue(fieldPath, patch.value, false)
      } else if (fieldPath && patch.op === 'remove') {
        const pathParts = fieldPath.split('/')

        if (pathParts.length >= 3) {
          const parentField = pathParts[0]
          const arrayField = pathParts[1]
          const indexToRemove = parseInt(pathParts[2])

          if (!isNaN(indexToRemove)) {
            const parentValue = formik.values[parentField as keyof ApiAppConfiguration]
            if (parentValue && typeof parentValue === 'object' && !Array.isArray(parentValue)) {
              const parentValueObj = parentValue as unknown as Record<string, unknown>
              const currentArray = parentValueObj[arrayField]
              if (Array.isArray(currentArray)) {
                const newArray = currentArray.filter((_, index) => index !== indexToRemove)

                const updatedParent = {
                  ...parentValueObj,
                  [arrayField]: newArray,
                }
                formik.setFieldValue(
                  parentField,
                  updatedParent as unknown as ApiAppConfiguration[keyof ApiAppConfiguration],
                  false,
                )
                formik.setTouched({ ...formik.touched, [parentField]: true }, false)

                setTimeout(() => {
                  formik.validateForm()
                }, 0)
              }
            }
          }
        }
      }
    },
    [formik],
  )

  const toggle = useCallback(() => {
    setModal((prev) => !prev)
  }, [])

  const submitForm = useCallback(
    async (userMessage: string) => {
      toggle()
      try {
        await onSubmit(patches, userMessage)
        setPatches([])
      } catch (error) {
        console.error('Error submitting form:', error)
      }
    },
    [toggle, onSubmit, patches],
  )

  const handleBack = useCallback(() => {
    navigateToRoute(ROUTES.HOME_DASHBOARD)
  }, [navigateToRoute])

  const handleCancel = useCallback(() => {
    const resetValues = JSON.parse(JSON.stringify(baselineConfigurationRef.current))
    formik.resetForm({
      values: resetValues,
      touched: {},
      errors: {},
    })
    setPatches([])
    setResetKey((prev) => prev + 1)
  }, [formik])

  return (
    <>
      <Form
        onSubmit={(e) => {
          e.preventDefault()
          handleFormSubmit()
        }}
        style={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}
      >
        <div style={{ flex: 1, paddingBottom: '100px' }}>
          {Object.keys(configuration).map((propKey) => {
            const isDisabled = READ_ONLY_FIELDS.includes(propKey)
            const propValue =
              formik.values[propKey as keyof ApiAppConfiguration] ??
              baselineConfigurationRef.current[propKey as keyof ApiAppConfiguration]
            const fieldError = formik.errors[propKey as keyof ApiAppConfiguration]
            const fieldTouched = formik.touched[propKey as keyof ApiAppConfiguration]

            return (
              <div key={`${propKey}-${resetKey}`}>
                <JsonPropertyBuilderConfigApi
                  propKey={propKey}
                  propValue={propValue as PropertyValue}
                  lSize={6}
                  handler={patchHandler}
                  doc_category="config_api_properties"
                  disabled={isDisabled}
                />
                {fieldTouched && fieldError && (
                  <div className="text-danger small mt-1">{String(fieldError)}</div>
                )}
              </div>
            )
          })}

          <FormGroup row />
        </div>

        {canWriteConfigApi && (
          <div className="position-sticky bottom-0 bg-body py-3" style={{ zIndex: 10 }}>
            <GluuFormFooter
              showBack
              onBack={handleBack}
              showCancel
              onCancel={handleCancel}
              disableCancel={!hasChanges}
              showApply
              disableApply={!formik.isValid || !hasChanges}
              applyButtonType="submit"
            />
          </div>
        )}
      </Form>

      {canWriteConfigApi && (
        <GluuCommitDialog
          handler={toggle}
          modal={modal}
          operations={operations}
          onAccept={submitForm}
        />
      )}
    </>
  )
}

export default ApiConfigForm
