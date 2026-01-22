import React, { useEffect, useState, useMemo, useCallback, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useQueryClient } from '@tanstack/react-query'
import { useFormik, setIn } from 'formik'
import * as Yup from 'yup'
import { debounce } from 'lodash'
import { toast } from 'react-toastify'
import SearchIcon from '@mui/icons-material/Search'
import { FormGroup, Card, CardBody, CardHeader, Form } from 'Components'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import GluuFormFooter from 'Routes/Apps/Gluu/GluuFormFooter'
import GluuCommitDialog from 'Routes/Apps/Gluu/GluuCommitDialog'
import PropertyBuilder from './JsonPropertyBuilder'
import DefaultAcrInput from './DefaultAcrInput'
import SetTitle from 'Utils/SetTitle'
import customColors from '@/customColors'
import { buildPayload } from 'Utils/PermChecker'
import { updateToast } from 'Redux/features/toastSlice'
import { getJsonConfig, patchJsonConfig } from 'Plugins/auth-server/redux/features/jsonConfigSlice'
import {
  SIMPLE_PASSWORD_AUTH,
  FETCHING_JSON_PROPERTIES,
} from 'Plugins/auth-server/common/Constants'
import { useGetAcrs, usePutAcrs, getGetAcrsQueryKey } from 'JansConfigApi'
import { getScripts } from 'Redux/features/initSlice'
import { useCedarling } from '@/cedarling'
import { CEDAR_RESOURCE_SCOPES } from '@/cedarling/constants/resourceScopes'
import { ADMIN_UI_RESOURCES } from '@/cedarling/utility'
import { useAppNavigation, ROUTES } from '@/helpers/navigation'
import { useAcrAudit } from '../AuthN/hooks'
import {
  generateLabel,
  isRenamedKey,
  renamedFieldFromObject,
  useAuthServerPropertiesActions,
} from './Properties/utils'
import { createAppConfigurationSchema } from './Properties/utils/validations'
import type { AppConfiguration, RootState, JsonPatch, AcrPutOperation, Script } from './types'
import type { GluuCommitDialogOperation, JsonValue } from 'Routes/Apps/Gluu/types'
import type { UserAction, ActionData } from 'Utils/PermChecker'

const AuthPage: React.FC = () => {
  const { t } = useTranslation()
  SetTitle(t('titles.jans_json_property'))

  const dispatch = useDispatch()
  const queryClient = useQueryClient()
  const { navigateBack } = useAppNavigation()
  const { hasCedarWritePermission, authorizeHelper } = useCedarling()
  const { logAuthServerPropertiesUpdate } = useAuthServerPropertiesActions()
  const { logAcrUpdate } = useAcrAudit()
  const configuration = useSelector((state: RootState) => state.jsonConfigReducer.configuration)
  const scripts = useSelector((state: RootState) => state.initReducer.scripts)
  const { data: acrs, isLoading: acrLoading } = useGetAcrs({
    query: { staleTime: 30000 },
  })
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
  const [put, setPut] = useState<AcrPutOperation | null>(null)
  const baselineConfigurationRef = useRef<AppConfiguration | null>(null)
  const setFieldValueRef = useRef<
    ((field: string, value: unknown, shouldValidate?: boolean) => void) | null
  >(null)
  const setTouchedRef = useRef<
    ((touched: Record<string, boolean | undefined>, shouldValidate?: boolean) => void) | null
  >(null)
  const validateFormRef = useRef<(() => Promise<unknown>) | null>(null)
  const touchedRef = useRef<Record<string, boolean | undefined>>({})
  const previousConfigurationRef = useRef<AppConfiguration | null>(null)
  const debouncedSetFinalSearch = useMemo(
    () =>
      debounce((value: string) => {
        setFinalSearch(value.toLowerCase())
      }, 300),
    [],
  )
  useEffect(() => {
    return () => {
      debouncedSetFinalSearch.cancel()
    }
  }, [debouncedSetFinalSearch])
  const validationSchema = useMemo(() => createAppConfigurationSchema(t), [t])
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
  const validate = useCallback(
    async (values: AppConfiguration) => {
      const errors: Record<string, string> = {}
      try {
        await validationSchema.validate(values, { abortEarly: false })
      } catch (err) {
        const validationError = err as Yup.ValidationError
        if (validationError.inner && Array.isArray(validationError.inner)) {
          for (const error of validationError.inner) {
            if (error.path) {
              errors[error.path] = error.message
            }
          }
        } else if (validationError.path) {
          errors[validationError.path] = validationError.message
        }
      }
      return errors
    },
    [validationSchema],
  )
  const formik = useFormik<AppConfiguration>({
    initialValues: configuration || {},
    validate,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: true,
    validateOnMount: false,
    onSubmit: () => {},
  })
  useEffect(() => {
    authorizeHelper(propertiesScopes)
  }, [authorizeHelper, propertiesScopes])
  useEffect(() => {
    setFieldValueRef.current = formik.setFieldValue
    setTouchedRef.current = formik.setTouched
    validateFormRef.current = formik.validateForm
    touchedRef.current = formik.touched
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
  const propertiesData = useMemo(() => {
    if (Object.keys(configuration).length === 0) {
      return []
    }
    const renamed = renamedFieldFromObject(configuration)
    return Object.entries(renamed)
      .filter(([propKey]) => generateLabel(propKey).includes(finalSearch))
      .map(([propKey, propValue]) => ({
        propKey,
        propValue: propValue as AppConfiguration,
      }))
  }, [configuration, finalSearch])
  const authScripts = useMemo(() => {
    const filteredScripts: string[] = scripts
      .filter((item: Script) => item.scriptType === 'person_authentication')
      .filter((item: Script) => item.enabled)
      .map((item: Script) => item.name)
    filteredScripts.push(SIMPLE_PASSWORD_AUTH)
    return filteredScripts
  }, [scripts])
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
  const hasChanges = useMemo(() => {
    return patches.length > 0 || (put && put.value && put.value !== acrs?.defaultAcr)
  }, [patches.length, put, acrs?.defaultAcr])
  const isConfigEmpty = !configuration || Object.keys(configuration).length === 0
  const patchHandler = useCallback(
    (patch: JsonPatch) => {
      if (patch.op === 'replace' && patch.path) {
        const fieldPath = typeof patch.path === 'string' ? patch.path.replace(/^\//, '') : ''
        const formikPath = fieldPath.replace(/\//g, '.')
        if (setFieldValueRef.current) {
          setFieldValueRef.current(formikPath, patch.value, false)
        }
        if (setTouchedRef.current) {
          setTouchedRef.current(setIn(touchedRef.current, formikPath, true), false)
        }
        if (validateFormRef.current) {
          void validateFormRef.current()
        }
      }
      setPatches((existingPatches) => {
        const filteredPatches = existingPatches.filter((p) => p.path !== patch.path)
        return [...filteredPatches, patch]
      })
    },
    [setPatches],
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
    navigateBack(ROUTES.HOME_DASHBOARD)
  }, [navigateBack])
  const handleCancel = useCallback(() => {
    setPatches([])
    setPut(null)
    setResetKey((prev) => prev + 1)
    setErrorMessage(null)
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

  return (
    <GluuLoader blocking={isConfigEmpty || acrLoading || putAcrsMutation.isPending}>
      <Card style={{ borderRadius: 24 }}>
        <CardHeader>
          <div style={{ display: 'flex' }}>
            <div style={{ flex: 2 }}></div>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
              <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center' }}>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search..."
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setSearch(e.target.value)
                    debouncedSetFinalSearch(e.target.value)
                  }}
                  value={search}
                  style={{ paddingRight: '30px' }}
                />
                <SearchIcon
                  style={{
                    position: 'absolute',
                    right: '10px',
                    color: customColors.lightBlue,
                    pointerEvents: 'none',
                  }}
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
              {propertiesData.length > 0 &&
                propertiesData.map(({ propKey, propValue }) => (
                  <PropertyBuilder
                    isRenamedKey={isRenamedKey(propKey)}
                    key={`${propKey}-${resetKey}`}
                    propKey={propKey}
                    propValue={propValue}
                    lSize={lSize}
                    handler={patchHandler}
                    errors={formik.errors}
                    touched={formik.touched}
                  />
                ))}
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
                  backButtonLabel={t('actions.back')}
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
