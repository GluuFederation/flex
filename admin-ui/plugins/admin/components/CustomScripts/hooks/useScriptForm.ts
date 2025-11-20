import { useCallback, useMemo } from 'react'
import { useFormik } from 'formik'
import { useNavigate } from 'react-router-dom'
import type { CustomScript, FormMode } from '../types/domain'
import type { ScriptFormValues } from '../types/form'
import { transformToFormValues, transformToApiPayload } from '../services/scriptTransformers'
import { customScriptValidationSchema } from '../helper/validations'
import { MODULE_PROPERTY_KEYS, LOCATION_TYPES, SCRIPT_ROUTES } from '../constants'
import { useScriptProperties } from './useScriptProperties'

interface UseScriptFormOptions {
  mode: FormMode
  disabled?: boolean
}

export function useScriptForm({ script, mode, onSubmit, disabled = false }: UseScriptFormOptions) {
  const navigate = useNavigate()

  const formik = useFormik<ScriptFormValues>({
    initialValues: transformToFormValues(script),
    validationSchema: customScriptValidationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      const apiPayload = transformToApiPayload(values)
      const submitData = {
        customScript: {
          ...apiPayload,
          action_message: values.action_message,
        },
      }
      await onSubmit(submitData)
    },
  })

  const propertyHelpers = useScriptProperties(formik)

  const handleLocationTypeChange = useCallback(
    (locationType: 'db' | 'file') => {
      formik.setFieldValue('location_type', locationType)

      if (locationType === LOCATION_TYPES.FILE) {
        formik.setFieldValue('script', undefined)
        if (formik.values.script_path) {
          formik.setFieldValue('locationPath', formik.values.script_path)
          propertyHelpers.updateModuleProperty(
            MODULE_PROPERTY_KEYS.LOCATION_PATH,
            formik.values.script_path,
          )
        }
      } else {
        formik.setFieldValue('locationPath', undefined)
        formik.setFieldValue('script_path', '')
        propertyHelpers.removeModuleProperty(MODULE_PROPERTY_KEYS.LOCATION_PATH)
      }
    },
    [formik, propertyHelpers],
  )

  const handleScriptPathChange = useCallback(
    (path: string) => {
      formik.setFieldValue('script_path', path)
      formik.setFieldValue('locationPath', path)
      if (path) {
        propertyHelpers.updateModuleProperty(MODULE_PROPERTY_KEYS.LOCATION_PATH, path)
      } else {
        propertyHelpers.removeModuleProperty(MODULE_PROPERTY_KEYS.LOCATION_PATH)
      }
    },
    [formik, propertyHelpers],
  )

  const handleUsageTypeChange = useCallback(
    (usageType: string) => {
      propertyHelpers.updateModuleProperty(MODULE_PROPERTY_KEYS.USAGE_TYPE, usageType)
    },
    [propertyHelpers],
  )

  const handleNavigateBack = useCallback(() => {
    if (window.history.length > 1) {
      navigate(-1)
    } else {
      navigate(SCRIPT_ROUTES.LIST)
    }
  }, [navigate])

  const navigateToList = useCallback(() => {
    navigate(SCRIPT_ROUTES.LIST)
  }, [navigate])

  const currentUsageType = useMemo(() => {
    return formik.values.moduleProperties.find((p) => p.value1 === MODULE_PROPERTY_KEYS.USAGE_TYPE)
      ?.value2
  }, [formik.values.moduleProperties])

  const hasChanges = useMemo(() => {
    return formik.dirty
  }, [formik.dirty])

  const isValid = useMemo(() => {
    return formik.isValid
  }, [formik.isValid])

  const isPersonAuthentication = useMemo(() => {
    return formik.values.scriptType === 'person_authentication'
  }, [formik.values.scriptType])

  const isFileBased = useMemo(() => {
    return formik.values.location_type === LOCATION_TYPES.FILE
  }, [formik.values.location_type])

  const isDatabaseBased = useMemo(() => {
    return formik.values.location_type === LOCATION_TYPES.DATABASE
  }, [formik.values.location_type])

  return {
    formik,

    ...propertyHelpers,

    handleLocationTypeChange,
    handleScriptPathChange,
    handleUsageTypeChange,
    handleNavigateBack,
    navigateToList,

    currentUsageType,
    hasChanges,
    isValid,
    isPersonAuthentication,
    isFileBased,
    isDatabaseBased,

    mode,
    disabled,
    isSubmitting: formik.isSubmitting,
    errors: formik.errors,
    touched: formik.touched,
    values: formik.values,
  }
}
