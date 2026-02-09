import React, { useCallback, useState, useEffect, useMemo, useRef } from 'react'
import { useFormik, setIn } from 'formik'
import { toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'
import { FormGroup, Form } from 'Components'
import { useCedarling } from '@/cedarling'
import { CEDAR_RESOURCE_SCOPES } from '@/cedarling/constants/resourceScopes'
import { ADMIN_UI_RESOURCES } from '@/cedarling/utility'
import { useAppNavigation, ROUTES } from '@/helpers/navigation'
import GluuCommitDialogLegacy from 'Routes/Apps/Gluu/GluuCommitDialogLegacy'
import GluuFormFooter from 'Routes/Apps/Gluu/GluuFormFooter'
import type { GluuCommitDialogOperation, JsonValue } from 'Routes/Apps/Gluu/types'
import type { FormikTouched } from 'formik'
import JsonPropertyBuilderConfigApi from './JsonPropertyBuilderConfigApi'
import {
  READ_ONLY_FIELDS,
  updateValuesAfterRemoval,
  applyRemovePatchToValues,
  configApiPropertiesSchema,
} from './utils'
import type { ApiAppConfiguration, JsonPatch } from './types'
import type { PropertyValue } from '../types'

interface ApiConfigFormProps {
  configuration: ApiAppConfiguration
  onSubmit: (patches: JsonPatch[], message: string) => Promise<void>
}

const CONFIG_API_RESOURCE_ID = ADMIN_UI_RESOURCES.ConfigApiConfiguration
const configApiScopes = CEDAR_RESOURCE_SCOPES[CONFIG_API_RESOURCE_ID] || []

const ApiConfigForm: React.FC<ApiConfigFormProps> = ({ configuration, onSubmit }) => {
  const { t } = useTranslation()
  const { authorizeHelper, hasCedarWritePermission } = useCedarling()
  const { navigateToRoute } = useAppNavigation()
  const [modal, setModal] = useState(false)
  const [patches, setPatches] = useState<JsonPatch[]>([])
  const [resetKey, setResetKey] = useState(0)
  const baselineConfigurationRef = useRef<ApiAppConfiguration>(
    JSON.parse(JSON.stringify(configuration)),
  )
  const previousConfigurationRef = useRef<ApiAppConfiguration | null>(null)
  const processingRemovalsRef = useRef<Set<string>>(new Set())

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
    onSubmit: () => {},
  })

  const handleFormSubmit = useCallback(async () => {
    if (patches.length === 0) {
      return
    }

    const hasPatches = patches.length > 0
    const errors = await formik.validateForm()
    const hasErrors = Object.keys(errors).length > 0

    if (!hasPatches && (!formik.isValid || hasErrors)) {
      return
    }

    setModal(true)
  }, [patches, formik.validateForm, formik.isValid])

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
  }, [configuration, patches.length, formik.resetForm])

  useEffect(() => {
    if (configApiScopes && configApiScopes.length > 0) {
      authorizeHelper(configApiScopes)
    }
  }, [authorizeHelper])

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

  const removeArrayItem = useCallback(
    (
      parentField: string | null,
      arrayField: string,
      indexToRemove: number,
      patch: JsonPatch,
    ): boolean => {
      const removalKey = patch.path as string

      if (processingRemovalsRef.current.has(removalKey)) {
        return false
      }

      processingRemovalsRef.current.add(removalKey)

      formik.setValues((currentValues) => {
        const updatedValues = updateValuesAfterRemoval(
          currentValues,
          parentField,
          arrayField,
          indexToRemove,
        )

        if (updatedValues === null) {
          processingRemovalsRef.current.delete(removalKey)
          return currentValues
        }

        return updatedValues
      })

      setPatches((existingPatches) => {
        const removalPath = typeof patch.path === 'string' ? patch.path : ''
        const removalPathNormalized = removalPath.replace(/^\//, '')

        let hasExistingRemove = false
        const filteredPatches = existingPatches.filter((existingPatch) => {
          if (existingPatch.path === patch.path && existingPatch.op === 'remove') {
            hasExistingRemove = true
            return false
          }

          const existingPath = typeof existingPatch.path === 'string' ? existingPatch.path : ''
          const existingPathNormalized = existingPath.replace(/^\//, '')

          if (existingPathNormalized === removalPathNormalized) {
            return false
          }

          if (existingPathNormalized.startsWith(removalPathNormalized + '/')) {
            return false
          }

          return true
        })

        if (hasExistingRemove) {
          processingRemovalsRef.current.delete(removalKey)
          return existingPatches
        }

        return [...filteredPatches, patch]
      })

      const touchedField = parentField || arrayField
      formik.setTouched({
        ...formik.touched,
        [touchedField]: true,
      } as FormikTouched<ApiAppConfiguration>)

      setResetKey((prev) => prev + 1)

      formik.validateForm().then(() => {
        processingRemovalsRef.current.delete(removalKey)
      })
      return true
    },
    [
      formik.setValues,
      formik.setTouched,
      formik.validateForm,
      formik.touched,
      setPatches,
      setResetKey,
    ],
  )

  const patchHandler = useCallback(
    (patch: JsonPatch) => {
      if (patch.op === 'remove') {
        const fieldPath = typeof patch.path === 'string' ? patch.path.replace(/^\//, '') : ''
        const pathParts = fieldPath.split('/')

        if (pathParts.length >= 3) {
          const parentField = pathParts[0]
          const arrayField = pathParts[1]
          const indexToRemove = parseInt(pathParts[2])
          if (!isNaN(indexToRemove)) {
            removeArrayItem(parentField, arrayField, indexToRemove, patch)
            return
          }
        } else if (pathParts.length === 2) {
          const arrayField = pathParts[0]
          const indexToRemove = parseInt(pathParts[1])
          if (!isNaN(indexToRemove)) {
            removeArrayItem(null, arrayField, indexToRemove, patch)
            return
          }
        }
      }

      if (patch.op === 'replace' && patch.path) {
        const fieldPath = typeof patch.path === 'string' ? patch.path.replace(/^\//, '') : ''
        const formikPath = fieldPath.replace(/\//g, '.')

        formik.setFieldValue(formikPath, patch.value, false)
        formik.setTouched(setIn(formik.touched, formikPath, true), false)

        setTimeout(() => {
          formik.validateField(formikPath)
        }, 0)
      }

      setPatches((existingPatches) => {
        const filteredPatches = existingPatches.filter(
          (existingPatch) => existingPatch.path !== patch.path,
        )
        return [...filteredPatches, patch]
      })
    },
    [
      removeArrayItem,
      formik.setFieldValue,
      formik.setTouched,
      formik.touched,
      formik.validateField,
    ],
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
        toast.error(t('messages.error_in_saving'))
      }
    },
    [toggle, onSubmit, patches, t],
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

  const propertyKeys = useMemo(() => Object.keys(configuration), [configuration])

  const removePatches = useMemo(() => patches.filter((p) => p.op === 'remove'), [patches])

  const currentValues = useMemo(() => {
    if (removePatches.length === 0) {
      return baselineConfigurationRef.current
    }

    const values = JSON.parse(
      JSON.stringify(baselineConfigurationRef.current),
    ) as ApiAppConfiguration

    removePatches.forEach((patch) => {
      applyRemovePatchToValues(values, patch)
    })

    return values
  }, [removePatches, resetKey])

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
          {propertyKeys.map((propKey) => {
            const isDisabled = READ_ONLY_FIELDS.includes(propKey)
            const propValue = currentValues[propKey as keyof ApiAppConfiguration]

            if (propValue === undefined) {
              return null
            }

            return (
              <div key={`${propKey}-${resetKey}`}>
                <JsonPropertyBuilderConfigApi
                  propKey={propKey}
                  propValue={propValue as PropertyValue}
                  lSize={6}
                  handler={patchHandler}
                  doc_category="config_api_properties"
                  disabled={isDisabled}
                  errors={formik.errors}
                  touched={formik.touched}
                />
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
              disableApply={!hasChanges || (patches.length === 0 && !formik.isValid)}
              applyButtonType="submit"
            />
          </div>
        )}
      </Form>

      {canWriteConfigApi && (
        <GluuCommitDialogLegacy
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
