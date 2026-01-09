import React, { useEffect, useState, useMemo, useCallback, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { FormGroup, Card, CardBody, CardHeader, Form } from 'Components'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import GluuFormFooter from 'Routes/Apps/Gluu/GluuFormFooter'
import GluuCommitDialog from 'Routes/Apps/Gluu/GluuCommitDialog'
import PropertyBuilder from './JsonPropertyBuilder'
import { useDispatch, useSelector } from 'react-redux'
import { useQueryClient } from '@tanstack/react-query'
import RefreshIcon from '@mui/icons-material/Refresh'
import spec from '../../../../configApiSpecs.yaml'
import { buildPayload } from 'Utils/PermChecker'
import { useCedarling } from '@/cedarling'
import { CEDAR_RESOURCE_SCOPES } from '@/cedarling/constants/resourceScopes'
import { ADMIN_UI_RESOURCES } from '@/cedarling/utility'
import { getJsonConfig, patchJsonConfig } from 'Plugins/auth-server/redux/features/jsonConfigSlice'
import SetTitle from 'Utils/SetTitle'
import DefaultAcrInput from './DefaultAcrInput'
import {
  SIMPLE_PASSWORD_AUTH,
  FETCHING_JSON_PROPERTIES,
} from 'Plugins/auth-server/common/Constants'
import { useGetAcrs, usePutAcrs, getGetAcrsQueryKey } from 'JansConfigApi'
import { getScripts } from 'Redux/features/initSlice'
import customColors from '@/customColors'
import { useAppNavigation, ROUTES } from '@/helpers/navigation'
import { useAcrAudit } from '../AuthN/hooks'
import { updateToast } from 'Redux/features/toastSlice'
import { toast } from 'react-toastify'
import { useFormik, setIn } from 'formik'
import {
  generateLabel,
  isRenamedKey,
  renamedFieldFromObject,
  getMissingProperties,
  useAuthServerPropertiesActions,
} from './Properties/utils'
import type {
  AppConfiguration,
  RootState,
  JsonPatch,
  AcrPutOperation,
  Script,
  SpecSchema,
  SchemaProperty,
} from './types'
import type { GluuCommitDialogOperation, JsonValue } from 'Routes/Apps/Gluu/types'
import type { UserAction, ActionData } from 'Utils/PermChecker'

const AuthPage: React.FC = () => {
  const { hasCedarWritePermission, authorizeHelper } = useCedarling()
  const { navigateToRoute } = useAppNavigation()
  const { logAuthServerPropertiesUpdate } = useAuthServerPropertiesActions()
  const configuration = useSelector((state: RootState) => state.jsonConfigReducer.configuration)
  const scripts = useSelector((state: RootState) => state.initReducer.scripts)
  const { permissions: cedarPermissions } = useSelector(
    (state: RootState) => state.cedarPermissions,
  )

  const dispatch = useDispatch()
  const queryClient = useQueryClient()
  const { logAcrUpdate } = useAcrAudit()

  const { data: acrs, isLoading: acrLoading } = useGetAcrs({
    query: {
      staleTime: 30000,
    },
  })

  const handleAcrUpdateSuccess = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: getGetAcrsQueryKey() })
  }, [queryClient])

  const handleAcrUpdateError = useCallback(
    (error: unknown) => {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update default ACR'
      dispatch(updateToast(true, 'error', errorMessage))
    },
    [dispatch],
  )

  const putAcrsMutation = usePutAcrs({
    mutation: {
      onSuccess: handleAcrUpdateSuccess,
      onError: handleAcrUpdateError,
    },
  })

  const { t } = useTranslation()
  const lSize = 6
  const userAction: UserAction = {
    action_message: '',
    action_data: null,
  }

  const propertiesResourceId = ADMIN_UI_RESOURCES.AuthenticationServerConfiguration
  const propertiesScopes = useMemo(
    () => CEDAR_RESOURCE_SCOPES[propertiesResourceId] || [],
    [propertiesResourceId],
  )

  const canWriteProperties = useMemo(
    () => hasCedarWritePermission(propertiesResourceId),
    [hasCedarWritePermission, propertiesResourceId],
  )

  const [modal, setModal] = useState<boolean>(false)
  const [patches, setPatches] = useState<JsonPatch[]>([])
  const [resetKey, setResetKey] = useState<number>(0)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const [search, setSearch] = useState<string>('')
  const [finalSearch, setFinalSearch] = useState<string>('')
  const schema = (spec as unknown as SpecSchema).components.schemas.AppConfiguration.properties
  const properties = Object.keys(schema)
  const api_configurations = Object.keys(configuration)
  const missing_properties_data = useMemo(
    () => getMissingProperties(properties, api_configurations),
    [properties, api_configurations],
  )
  SetTitle(t('titles.jans_json_property'))

  const [put, setPut] = useState<AcrPutOperation | null>(null)

  const baselineConfigurationRef = useRef<AppConfiguration | null>(null)
  const previousConfigurationRef = useRef<AppConfiguration | null>(null)

  useEffect(() => {
    authorizeHelper(propertiesScopes)
  }, [authorizeHelper, propertiesScopes])

  const validate = useCallback((values: AppConfiguration) => {
    const errors: Record<string, string> = {}

    if (!values || typeof values !== 'object') {
      return errors
    }

    for (const key of Object.keys(values)) {
      const fieldValue = values[key]

      // Skip null/undefined/empty values
      if (fieldValue === null || fieldValue === undefined || fieldValue === '') {
        continue
      }

      const lowerName = key.toLowerCase()

      // Validate URL fields
      if (
        lowerName.endsWith('endpoint') ||
        lowerName.endsWith('uri') ||
        lowerName.endsWith('url') ||
        (lowerName.includes('url') && !lowerName.includes('curl')) ||
        lowerName === 'issuer'
      ) {
        if (typeof fieldValue === 'string' && fieldValue.trim() !== '') {
          try {
            new URL(fieldValue)
          } catch {
            errors[key] = 'Invalid URL format'
          }
        }
      }

      // Validate number fields
      if (
        lowerName.includes('lifetime') ||
        lowerName.includes('interval') ||
        (lowerName.includes('time') &&
          !lowerName.includes('endpoint') &&
          !lowerName.includes('url')) ||
        lowerName.includes('size') ||
        lowerName.includes('count') ||
        lowerName.includes('limit') ||
        lowerName.includes('delay') ||
        lowerName.includes('duration')
      ) {
        if (typeof fieldValue === 'string') {
          const trimmed = fieldValue.trim()
          if (trimmed !== '') {
            const num = Number(trimmed)
            if (isNaN(num) || !isFinite(num)) {
              errors[key] = 'Must be a valid number'
            } else if (num < 0) {
              errors[key] = 'Must be non-negative'
            }
          }
        } else if (typeof fieldValue === 'number') {
          if (fieldValue < 0) {
            errors[key] = 'Must be non-negative'
          }
        }
      }
    }

    return errors
  }, [])

  const formik = useFormik<AppConfiguration>({
    initialValues: configuration || {},
    validate,
    enableReinitialize: true,
    validateOnChange: true,
    validateOnBlur: true,
    validateOnMount: false,
    onSubmit: () => {
      // Form submission is handled by handleSubmit wrapper
    },
  })

  useEffect(() => {
    const configChanged =
      previousConfigurationRef.current === null ||
      JSON.stringify(previousConfigurationRef.current) !== JSON.stringify(configuration)

    if (configuration && Object.keys(configuration).length > 0 && configChanged) {
      if (patches.length === 0) {
        baselineConfigurationRef.current = JSON.parse(
          JSON.stringify(configuration),
        ) as AppConfiguration
        previousConfigurationRef.current = JSON.parse(
          JSON.stringify(configuration),
        ) as AppConfiguration
        formik.resetForm({
          values: configuration,
          touched: {},
          errors: {},
        })
        setResetKey((prev) => prev + 1)
      }
    }
  }, [configuration, patches.length, formik])

  const authScripts: string[] = scripts
    .filter((item: Script) => item.scriptType === 'person_authentication')
    .filter((item: Script) => item.enabled)
    .map((item: Script) => item.name)

  authScripts.push(SIMPLE_PASSWORD_AUTH)

  useEffect(() => {
    const actionPayload: ActionData = {}
    buildPayload(userAction, FETCHING_JSON_PROPERTIES, actionPayload)
    dispatch(getJsonConfig())
    dispatch(
      getScripts({
        action:
          (userAction.action_data as Record<
            string,
            string | number | boolean | string[] | number[] | boolean[] | null
          >) || {},
      }),
    )
  }, [dispatch])

  useEffect(() => {
    // Empty effect for cedarPermissions dependency
  }, [cedarPermissions])

  const operations = useMemo<GluuCommitDialogOperation[]>(() => {
    const patchOperations: GluuCommitDialogOperation[] = patches.map((patch) => ({
      path: patch.path as string,
      value: patch.op === 'remove' ? null : (patch.value as JsonValue),
    }))
    const putOperations: GluuCommitDialogOperation[] = put
      ? [
          {
            path: put.path,
            value: put.value as JsonValue,
          },
        ]
      : []
    return [...patchOperations, ...putOperations]
  }, [patches, put])

  const patchHandler = useCallback(
    (patch: JsonPatch) => {
      if (patch.op === 'replace' && patch.path) {
        const fieldPath = typeof patch.path === 'string' ? patch.path.replace(/^\//, '') : ''
        const formikPath = fieldPath.replace(/\//g, '.')

        formik.setFieldValue(formikPath, patch.value, false)
        formik.setTouched(setIn(formik.touched, formikPath, true), false)

        // Use validateForm() instead of validateField() because we use custom validate function
        setTimeout(() => {
          formik.validateForm()
        }, 0)
      }

      setPatches((existingPatches) => {
        // Replace existing patch for the same path instead of adding duplicates
        const filteredPatches = existingPatches.filter((p) => p.path !== patch.path)
        return [...filteredPatches, patch]
      })
    },
    [formik.setFieldValue, formik.setTouched, formik.touched, formik.validateForm],
  )

  const putHandler = useCallback(
    (putData: { value: string | string[]; path: string; op: 'replace' }) => {
      const putValue: AcrPutOperation = {
        path: putData.path,
        value: Array.isArray(putData.value) ? putData.value[0] : putData.value,
        op: 'replace',
      }
      setPut(putValue)
    },
    [],
  )

  const toggle = useCallback(() => {
    setModal((prev) => !prev)
  }, [])

  const handleBack = useCallback(() => {
    navigateToRoute(ROUTES.HOME_DASHBOARD)
  }, [navigateToRoute])

  const handleCancel = useCallback(() => {
    setPatches([])
    setPut(null)
    setResetKey((prev) => prev + 1)
    setErrorMessage(null)
    // Reset to baseline configuration - components will re-render with original values
    if (baselineConfigurationRef.current) {
      previousConfigurationRef.current = JSON.parse(
        JSON.stringify(baselineConfigurationRef.current),
      ) as AppConfiguration
      formik.resetForm({
        values: baselineConfigurationRef.current,
        touched: {},
        errors: {},
      })
    }
    // Refetch to ensure we have the latest server state
    dispatch(getJsonConfig())
  }, [dispatch, formik])

  const handleSubmit = useCallback(
    async (message: string) => {
      try {
        setErrorMessage(null)

        if (patches.length > 0) {
          const postBody = {
            requestBody: patches,
          } as unknown as ActionData

          buildPayload(userAction, message, postBody)
          dispatch(patchJsonConfig({ action: userAction }))
        }

        if (put && put.value) {
          const newAcr = { defaultAcr: put.value || acrs?.defaultAcr }
          try {
            await putAcrsMutation.mutateAsync({ data: newAcr })
            await logAcrUpdate(newAcr, message, { defaultAcr: newAcr.defaultAcr })
          } catch (error) {
            console.error('Error updating ACR:', error)
          }
        }

        let auditSuccess = true
        try {
          const auditPayload = {
            requestBody: patches,
            ...(put && put.value ? { defaultAcr: put.value } : {}),
          }
          auditSuccess = await logAuthServerPropertiesUpdate(message, auditPayload)
        } catch (auditError) {
          console.error('Error logging audit:', auditError)
          auditSuccess = false
        }

        if (auditSuccess) {
          toast.success(t('messages.success_in_saving'))
        } else {
          toast.warning(t('messages.success_in_saving_audit_failed'))
        }
      } catch (err) {
        console.error('Error updating auth server properties:', err)
        const errorMsg = err instanceof Error ? err.message : t('messages.error_in_saving')
        setErrorMessage(errorMsg)
        toast.error(errorMsg)
      }
    },
    [patches, put, acrs, dispatch, putAcrsMutation, logAcrUpdate, logAuthServerPropertiesUpdate, t],
  )

  const submitForm = useCallback(
    async (message: string) => {
      toggle()
      await handleSubmit(message)
    },
    [toggle, handleSubmit],
  )

  const hasChanges = useMemo(() => {
    return patches.length > 0 || (put && put.value && put.value !== acrs?.defaultAcr)
  }, [patches.length, put, acrs?.defaultAcr])

  return (
    <GluuLoader
      blocking={
        !(!!configuration && Object.keys(configuration).length > 0) ||
        acrLoading ||
        putAcrsMutation.isPending
      }
    >
      <Card style={{ borderRadius: 24 }}>
        <CardHeader>
          <div style={{ display: 'flex' }}>
            <div style={{ flex: 2 }}></div>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
              <div style={{ flex: 1 }}>
                <input
                  type="search"
                  className="form-control"
                  placeholder="Search..."
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
                  value={search}
                />
              </div>
              <div style={{ paddingLeft: 5 }}>
                <RefreshIcon
                  onClick={() => setFinalSearch(search.toLowerCase())}
                  style={{ cursor: 'pointer', color: customColors.lightBlue }}
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardBody>
          <Form
            onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
              e.preventDefault()
              toggle()
            }}
            style={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}
          >
            <div style={{ flex: 1, paddingBottom: '100px' }}>
              {Object.keys(configuration).length > 0 &&
                Object.entries(renamedFieldFromObject(configuration)).map(
                  ([propKey, propValue]) => {
                    if (generateLabel(propKey).includes(finalSearch)) {
                      return (
                        <PropertyBuilder
                          isRenamedKey={isRenamedKey(propKey)}
                          key={`${propKey}-${resetKey}`}
                          propKey={propKey}
                          propValue={propValue as AppConfiguration}
                          lSize={lSize}
                          handler={patchHandler}
                          schema={schema[propKey] as SchemaProperty}
                          errors={formik.errors}
                          touched={formik.touched}
                        />
                      )
                    }
                    return null
                  },
                )}

              {Object.keys(configuration).length > 0 &&
                missing_properties_data.map((propKey) => {
                  if (generateLabel(propKey).includes(finalSearch)) {
                    return (
                      <PropertyBuilder
                        key={`${propKey}-${resetKey}`}
                        propKey={propKey}
                        lSize={lSize}
                        schema={schema[propKey] as SchemaProperty}
                        handler={patchHandler}
                        errors={formik.errors}
                        touched={formik.touched}
                      />
                    )
                  }
                  return null
                })}
              {!!configuration && Object.keys(configuration).length > 0 && (
                <DefaultAcrInput
                  key={`defaultAcr-${resetKey}`}
                  name="defaultAcr"
                  lsize={lSize}
                  rsize={lSize}
                  label={t('fields.default_acr')}
                  handler={putHandler}
                  value={acrs?.defaultAcr}
                  options={authScripts}
                  path={'/ACR'}
                  showSaveButtons={false}
                />
              )}

              <FormGroup row></FormGroup>
            </div>

            {canWriteProperties && (
              <div className="position-sticky bottom-0 bg-body py-3" style={{ zIndex: 10 }}>
                <GluuFormFooter
                  showBack
                  onBack={handleBack}
                  backButtonLabel="Back"
                  showCancel
                  onCancel={handleCancel}
                  disableCancel={!hasChanges}
                  showApply
                  disableApply={!hasChanges}
                  applyButtonType="button"
                  onApply={toggle}
                />
              </div>
            )}
          </Form>
        </CardBody>
        {errorMessage && (
          <div className="alert alert-danger mt-3 mx-3" role="alert">
            {errorMessage}
          </div>
        )}
        {canWriteProperties && (
          <GluuCommitDialog
            handler={toggle}
            modal={modal}
            operations={operations}
            onAccept={submitForm}
          />
        )}
      </Card>
    </GluuLoader>
  )
}

export default AuthPage
