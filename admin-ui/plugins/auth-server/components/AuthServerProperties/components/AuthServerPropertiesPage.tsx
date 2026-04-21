import React, { useEffect, useState, useMemo, useCallback, useRef, useDeferredValue } from 'react'
import { useTranslation } from 'react-i18next'
import { useQueryClient } from '@tanstack/react-query'
import { useFormik, type FormikProps } from 'formik'
import * as Yup from 'yup'
import { Card, CardBody, Form } from 'Components'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import GluuText from 'Routes/Apps/Gluu/GluuText'
import GluuThemeFormFooter from 'Routes/Apps/Gluu/GluuThemeFormFooter'
import GluuCommitDialog from 'Routes/Apps/Gluu/GluuCommitDialog'
import GluuInlineInput from 'Routes/Apps/Gluu/GluuInlineInput'
import GluuMultiSelectRow from 'Routes/Apps/Gluu/GluuMultiSelectRow'
import GluuSelectRow from 'Routes/Apps/Gluu/GluuSelectRow'
import type {
  MultiSelectOption,
  GluuMultiSelectRowFormik,
} from 'Routes/Apps/Gluu/types/GluuMultiSelectRow.types'
import type { GluuSelectRowFormik } from 'Routes/Apps/Gluu/types/GluuSelectRow.types'
import PropertyBuilder, { NumberField } from './JsonPropertyBuilder'
import DefaultAcrInput from './DefaultAcrInput'
import SetTitle from 'Utils/SetTitle'
import { buildPayload } from 'Utils/PermChecker'
import { devLogger } from '@/utils/devLogger'
import { updateToast } from 'Redux/features/toastSlice'
import {
  SIMPLE_PASSWORD_AUTH,
  FETCHING_JSON_PROPERTIES,
} from 'Plugins/auth-server/common/Constants'
import { useGetAcrs, usePutAcrs, getGetAcrsQueryKey } from 'JansConfigApi'
import {
  useAuthServerJsonPropertiesQuery,
  usePatchAuthServerJsonPropertiesMutation,
} from 'Plugins/auth-server/hooks/useAuthServerJsonProperties'
import { getScripts } from 'Redux/features/initSlice'
import { useCedarling } from '@/cedarling'
import { CEDAR_RESOURCE_SCOPES } from '@/cedarling/constants/resourceScopes'
import { ADMIN_UI_RESOURCES } from '@/cedarling/utility'
import { useAppNavigation, ROUTES } from '@/helpers/navigation'
import { useTheme } from '@/context/theme/themeContext'
import getThemeColor from '@/context/theme/config'
import { THEME_DARK } from '@/context/theme/constants'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { GluuPageContent } from '@/components'
import GluuViewWrapper from 'Routes/Apps/Gluu/GluuViewWrapper'
import { GluuSearchToolbar } from '@/components/GluuSearchToolbar'
import { buildKeyCandidates } from '@/utils/stringUtils'
import { REGEX_LEADING_SLASH, REGEX_FORWARD_SLASH, REGEX_NON_LOWERCASE_ALPHA } from '@/utils/regex'
import { getFieldPlaceholder } from '@/utils/placeholderUtils'
import { useStyles } from './styles/AuthServerPropertiesPage.style'
import { useAcrAudit } from '../../AuthN/hooks'
import {
  FIGMA_PRIORITY_ROWS,
  DEFAULT_FORM_LABEL_SIZE,
  DEFAULT_ACR_LABEL_KEY,
  DEFAULT_ACR_PATH,
  ACR_CHALLENGE_KEY,
  KEY_GROUP_ORDER,
  DEFAULT_AUTH_SERVER_CONFIG,
} from '../constants'
import {
  isRenamedKey,
  isScriptEntry,
  renamedFieldFromObject,
  DISCOVERY_DENY_KEYS_I18N,
  createAppConfigurationSchema,
} from '../Properties/utils'
import { LOGGING_LEVEL_FIELD_KEYS, LOGGING_LEVEL_OPTIONS } from '../../ConfigApiProperties/utils'
import {
  toPairs,
  generateLabel,
  isSimplePropertyValue as isSimplePropertyValueUtil,
  formatPatchValue,
  formatPatchPath,
} from 'Plugins/auth-server/common/propertiesUtils'
import type {
  AppConfiguration,
  JsonPatch,
  AcrPutOperation,
  PropertyValue,
  Script,
  SimpleFieldModel,
} from '../types'
import type { GluuCommitDialogOperation, JsonValue } from 'Routes/Apps/Gluu/types/index'
import type { UserAction, ActionData } from 'Utils/PermChecker'

const propertiesResourceId = ADMIN_UI_RESOURCES.AuthenticationServerConfiguration
const propertiesScopes = CEDAR_RESOURCE_SCOPES[propertiesResourceId] || []
const createUserAction = (): UserAction => ({
  action_message: '',
  action_data: null,
})

const AuthServerPropertiesPage: React.FC = () => {
  const { t, i18n } = useTranslation()
  SetTitle(t('titles.jans_json_property'))

  const dispatch = useAppDispatch()
  const queryClient = useQueryClient()
  const { navigateBack } = useAppNavigation()
  const { state: themeState } = useTheme()
  const { themeColors, isDark } = useMemo(
    () => ({
      themeColors: getThemeColor(themeState?.theme ?? 'light'),
      isDark: themeState?.theme === THEME_DARK,
    }),
    [themeState?.theme],
  )
  const { classes } = useStyles({ isDark, themeColors })
  const { hasCedarReadPermission, hasCedarWritePermission, authorizeHelper } = useCedarling()
  const { logAcrUpdate } = useAcrAudit()
  const {
    data: serverConfigurationData,
    isSuccess: jsonConfigQuerySuccess,
    isLoading: jsonConfigQueryLoading,
  } = useAuthServerJsonPropertiesQuery()
  const patchJsonPropertiesMutation = usePatchAuthServerJsonPropertiesMutation()
  const serverConfiguration = (serverConfigurationData ?? {}) as AppConfiguration
  const isConfigLoaded = jsonConfigQuerySuccess && Object.keys(serverConfiguration).length > 0
  const configuration = useMemo<AppConfiguration>(
    () => (isConfigLoaded ? serverConfiguration : DEFAULT_AUTH_SERVER_CONFIG),
    [isConfigLoaded, serverConfiguration],
  )
  const rawScripts = useAppSelector((state) => state.initReducer?.scripts ?? [])
  const scripts = useMemo<Script[]>(() => rawScripts.filter(isScriptEntry), [rawScripts])
  const { data: acrs, isLoading: acrLoading } = useGetAcrs({
    query: { staleTime: 30000 },
  })
  const lSize = DEFAULT_FORM_LABEL_SIZE
  const canReadProperties = useMemo(
    () => hasCedarReadPermission(propertiesResourceId),
    [hasCedarReadPermission],
  )
  const canWriteProperties = useMemo(
    () => hasCedarWritePermission(propertiesResourceId),
    [hasCedarWritePermission],
  )
  const [modal, setModal] = useState<boolean>(false)
  const [patches, setPatches] = useState<JsonPatch[]>([])
  const [resetKey, setResetKey] = useState<number>(0)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [search, setSearch] = useState<string>('')
  const [put, setPut] = useState<AcrPutOperation | null>(null)
  const baselineConfigurationRef = useRef<AppConfiguration | null>(null)
  const setFieldValueRef = useRef<FormikProps<AppConfiguration>['setFieldValue'] | null>(null)
  const resetFormRef = useRef<FormikProps<AppConfiguration>['resetForm'] | null>(null)
  const previousConfigurationRef = useRef<AppConfiguration | null>(null)
  const validationSchema = useMemo(() => createAppConfigurationSchema(t), [t])
  const handleAcrUpdateSuccess = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: getGetAcrsQueryKey() })
  }, [queryClient])
  const handleAcrUpdateError = useCallback(
    (error: Error) => {
      dispatch(updateToast(true, 'error', error.message))
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
  }, [authorizeHelper])
  useEffect(() => {
    setFieldValueRef.current = formik.setFieldValue
    resetFormRef.current = formik.resetForm
  }, [formik.setFieldValue, formik.resetForm])
  useEffect(() => {
    const configChanged =
      previousConfigurationRef.current === null ||
      JSON.stringify(previousConfigurationRef.current) !== JSON.stringify(serverConfiguration)
    if (isConfigLoaded && configChanged) {
      if (patches.length === 0) {
        baselineConfigurationRef.current = JSON.parse(
          JSON.stringify(serverConfiguration),
        ) as AppConfiguration
        previousConfigurationRef.current = JSON.parse(
          JSON.stringify(serverConfiguration),
        ) as AppConfiguration
        resetFormRef.current?.({
          values: serverConfiguration,
          touched: {},
          errors: {},
        })
        setResetKey((prev) => prev + 1)
      }
    }
  }, [serverConfiguration, isConfigLoaded, patches.length])
  useEffect(() => {
    const actionPayload: ActionData = {}
    const userAction = createUserAction()
    buildPayload(userAction, FETCHING_JSON_PROPERTIES, actionPayload)
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
  const deferredSearch = useDeferredValue(search.toLowerCase())

  const searchableEntries = useMemo(() => {
    const renamed = renamedFieldFromObject(configuration, t(DISCOVERY_DENY_KEYS_I18N))
    return Object.entries(renamed).map(([propKey, propValue]) => ({
      propKey,
      propValue: propValue as AppConfiguration,
      searchableLabel: generateLabel(propKey).toLowerCase(),
    }))
  }, [configuration])

  const propertiesData = useMemo(() => {
    return searchableEntries
      .filter(({ searchableLabel }) => searchableLabel.includes(deferredSearch))
      .map(({ propKey, propValue }) => ({
        propKey,
        propValue,
      }))
  }, [searchableEntries, deferredSearch])

  const isSimplePropertyValue = useCallback(
    (value: PropertyValue): boolean => isSimplePropertyValueUtil(value),
    [],
  )

  const getPropertyLabel = useCallback(
    (propKey: string) => {
      const candidates = buildKeyCandidates(propKey)

      for (const candidate of candidates) {
        const key = `fields.${candidate}`
        if (i18n.exists(key)) {
          return key
        }
      }

      const fallbackKey = `fields.${propKey}`
      if (!i18n.exists(fallbackKey)) {
        i18n.addResource(i18n.language, 'translation', fallbackKey, generateLabel(propKey))
      }
      return fallbackKey
    },
    [i18n],
  )

  const simpleEntries = useMemo(
    () => propertiesData.filter(({ propValue }) => isSimplePropertyValue(propValue)),
    [propertiesData, isSimplePropertyValue],
  )

  const complexEntries = useMemo(
    () => propertiesData.filter(({ propValue }) => !isSimplePropertyValue(propValue)),
    [propertiesData, isSimplePropertyValue],
  )

  const simpleEntriesByKey = useMemo(
    () =>
      simpleEntries.reduce<Record<string, PropertyValue>>((acc, { propKey, propValue }) => {
        acc[propKey] = propValue
        return acc
      }, {}),
    [simpleEntries],
  )

  const prioritizedSimpleKeys = useMemo(
    () =>
      FIGMA_PRIORITY_ROWS.flatMap(([left, right]) => [left, ...(right ? [right] : [])]).filter(
        (key) => Object.prototype.hasOwnProperty.call(simpleEntriesByKey, key),
      ),
    [simpleEntriesByKey],
  )

  const remainingSimpleKeys = useMemo(
    () =>
      simpleEntries
        .map((entry) => entry.propKey)
        .filter((key) => !prioritizedSimpleKeys.includes(key) && key !== ACR_CHALLENGE_KEY),
    [simpleEntries, prioritizedSimpleKeys],
  )

  const hasActiveSearch = useMemo(() => deferredSearch.trim().length > 0, [deferredSearch])

  const handleSearchChange = useCallback((value: string) => {
    setSearch(value)
  }, [])

  const groupedSimpleRows = useMemo(() => {
    const sourceKeys = hasActiveSearch
      ? simpleEntries.map((entry) => entry.propKey).filter((key) => key !== ACR_CHALLENGE_KEY)
      : remainingSimpleKeys

    const grouped = sourceKeys.reduce<Record<number, string[]>>(
      (acc, key) => {
        const value = simpleEntriesByKey[key]
        const group = Array.isArray(value)
          ? KEY_GROUP_ORDER.ARRAY
          : typeof value === 'boolean'
            ? KEY_GROUP_ORDER.BOOLEAN
            : KEY_GROUP_ORDER.INPUT
        acc[group].push(key)
        return acc
      },
      {
        [KEY_GROUP_ORDER.INPUT]: [],
        [KEY_GROUP_ORDER.BOOLEAN]: [],
        [KEY_GROUP_ORDER.ARRAY]: [],
      },
    )

    return [
      ...toPairs(grouped[KEY_GROUP_ORDER.INPUT]),
      ...toPairs(grouped[KEY_GROUP_ORDER.BOOLEAN]),
      ...toPairs(grouped[KEY_GROUP_ORDER.ARRAY]),
    ]
  }, [hasActiveSearch, remainingSimpleKeys, simpleEntries, simpleEntriesByKey])

  const simpleFieldModels = useMemo(() => {
    return Object.entries(simpleEntriesByKey).reduce<Record<string, SimpleFieldModel>>(
      (acc, [propKey, propValue]) => {
        if (!isSimplePropertyValue(propValue)) return acc

        const isArray = Array.isArray(propValue)
        const isBoolean = typeof propValue === 'boolean'
        const normalizedValue: string | number | boolean | string[] = isArray
          ? propValue
          : isBoolean
            ? propValue
            : typeof propValue === 'number'
              ? propValue
              : String(propValue ?? '')

        acc[propKey] = {
          propKey,
          label: getPropertyLabel(propKey),
          value: normalizedValue,
          isBoolean,
          isArray,
          options: isArray ? (propValue as string[]) : undefined,
        }
        return acc
      },
      {},
    )
  }, [getPropertyLabel, isSimplePropertyValue, simpleEntriesByKey])
  const authScripts = useMemo(() => {
    const filteredScripts = scripts
      .filter((item) => item.scriptType === 'person_authentication')
      .filter((item) => item.enabled)
      .map((item) => item.name)
    filteredScripts.push(SIMPLE_PASSWORD_AUTH)
    return filteredScripts
  }, [scripts])
  const operations = useMemo<GluuCommitDialogOperation[]>(() => {
    const labelResolver = (key: string) => t(getPropertyLabel(key))

    const patchOperations: GluuCommitDialogOperation[] = patches.map((patch) => ({
      path: formatPatchPath(patch.path as string, labelResolver),
      value: formatPatchValue(patch),
    }))
    const putOperations: GluuCommitDialogOperation[] = put
      ? [
          {
            path: t(getPropertyLabel(put.path.replace(REGEX_LEADING_SLASH, ''))),
            value: put.value as JsonValue,
          },
        ]
      : []
    return [...patchOperations, ...putOperations]
  }, [patches, put, t, getPropertyLabel])
  const hasChanges = useMemo(() => {
    const hasPutChange = put && put.value && put.value !== acrs?.defaultAcr
    if (hasPutChange) return true
    if (patches.length === 0) return false
    if (patches.some((p) => p.op === 'remove')) return true
    if (!baselineConfigurationRef.current) return patches.length > 0
    return JSON.stringify(formik.values) !== JSON.stringify(baselineConfigurationRef.current)
  }, [patches, put, acrs?.defaultAcr, formik.values])
  const patchHandler = useCallback(
    (patch: JsonPatch) => {
      if (patch.op === 'replace' && patch.path) {
        const fieldPath =
          typeof patch.path === 'string' ? patch.path.replace(REGEX_LEADING_SLASH, '') : ''
        const formikPath = fieldPath.replace(REGEX_FORWARD_SLASH, '.')
        if (setFieldValueRef.current) {
          setFieldValueRef.current(formikPath, patch.value, false)
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
      resetFormRef.current?.({
        values: baselineConfigurationRef.current,
        touched: {},
        errors: {},
      })
    }
  }, [])
  const handleSubmit = useCallback(
    async (message: string) => {
      try {
        setErrorMessage(null)
        if (patches.length > 0) {
          const patchAction = createUserAction()
          buildPayload(patchAction, message, { requestBody: patches })
          await patchJsonPropertiesMutation.mutateAsync(patchAction)
        }
        if (put && put.value) {
          const newAcr = { defaultAcr: put.value || acrs?.defaultAcr }
          try {
            await putAcrsMutation.mutateAsync({ data: newAcr })
            await logAcrUpdate(newAcr, message, { defaultAcr: newAcr.defaultAcr ?? '' })
          } catch (error) {
            devLogger.error('Error updating ACR:', error)
          }
        }
        setPatches([])
        setPut(null)
        setResetKey((prev) => prev + 1)
      } catch (err) {
        devLogger.error('Error updating auth server properties:', err)
        const errorMsg = err instanceof Error ? err.message : t('messages.error_in_saving')
        setErrorMessage(errorMsg)
      }
    },
    [patches, put, acrs, patchJsonPropertiesMutation, putAcrsMutation, logAcrUpdate, t],
  )
  const arrayFormikAdapters = useMemo(() => {
    const adapters: Record<string, GluuMultiSelectRowFormik> = {}
    for (const [propKey, model] of Object.entries(simpleFieldModels)) {
      if (!model?.isArray) continue
      adapters[propKey] = {
        setFieldValue: (_field: string, newValues: string[]) => {
          patchHandler({ op: 'replace', path: `/${propKey}`, value: newValues })
        },
        setFieldTouched: () => {},
      }
    }
    return adapters
  }, [simpleFieldModels, patchHandler])

  const arrayMultiSelectOptions = useMemo(() => {
    const optionsMap: Record<string, MultiSelectOption[]> = {}
    for (const [propKey, model] of Object.entries(simpleFieldModels)) {
      if (!model?.isArray || !model.options) continue
      const unique = [...new Set(model.options)]
      optionsMap[propKey] = unique.map((v) => ({ value: v, label: v }))
    }
    return optionsMap
  }, [simpleFieldModels])

  const loggingLevelFormikAdapters = useMemo(() => {
    const adapters: Record<string, GluuSelectRowFormik> = {}
    for (const propKey of Object.keys(simpleFieldModels)) {
      const normalizedKey = propKey.toLowerCase().replace(REGEX_NON_LOWERCASE_ALPHA, '')
      if (LOGGING_LEVEL_FIELD_KEYS.has(normalizedKey)) {
        adapters[propKey] = {
          handleChange: (event) => {
            patchHandler({ op: 'replace', path: `/${propKey}`, value: event.target.value })
          },
          handleBlur: () => {},
        }
      }
    }
    return adapters
  }, [simpleFieldModels, patchHandler])

  const renderSimpleField = useCallback(
    (propKey: string) => {
      const model = simpleFieldModels[propKey]
      if (!model) return null

      if (model.isArray) {
        return (
          <GluuMultiSelectRow
            key={`${model.propKey}-${resetKey}`}
            label={model.label}
            name={model.propKey}
            value={model.value as string[]}
            formik={arrayFormikAdapters[propKey]}
            options={arrayMultiSelectOptions[propKey] || []}
            lsize={12}
            rsize={12}
          />
        )
      }

      if (typeof model.value === 'number') {
        return (
          <NumberField
            key={`${model.propKey}-${resetKey}`}
            propKey={model.propKey}
            value={model.value}
            label={model.label}
            path={`/${model.propKey}`}
            handler={patchHandler}
            lSize={12}
            formResetKey={resetKey}
          />
        )
      }

      const normalizedKey = propKey.toLowerCase().replace(REGEX_NON_LOWERCASE_ALPHA, '')
      if (LOGGING_LEVEL_FIELD_KEYS.has(normalizedKey) && loggingLevelFormikAdapters[propKey]) {
        return (
          <GluuSelectRow
            key={`${model.propKey}-${resetKey}`}
            label={model.label}
            name={model.propKey}
            value={model.value as string}
            formik={loggingLevelFormikAdapters[propKey]}
            values={LOGGING_LEVEL_OPTIONS}
            lsize={12}
            rsize={12}
            doc_category="json_properties"
            doc_entry={model.propKey}
          />
        )
      }

      return (
        <GluuInlineInput
          key={`${model.propKey}-${resetKey}`}
          id={model.propKey}
          name={model.propKey}
          label={model.label}
          value={model.value}
          lsize={12}
          rsize={12}
          isBoolean={model.isBoolean}
          isArray={false}
          handler={patchHandler}
          path={`/${model.propKey}`}
          showSaveButtons={false}
          placeholder={getFieldPlaceholder(t, model.label)}
        />
      )
    },
    [
      patchHandler,
      simpleFieldModels,
      arrayFormikAdapters,
      arrayMultiSelectOptions,
      loggingLevelFormikAdapters,
      resetKey,
      t,
    ],
  )

  const simpleFieldsContent = useMemo(
    () => (
      <>
        {!hasActiveSearch &&
          FIGMA_PRIORITY_ROWS.map(([leftKey, rightKey]) => {
            const hasLeft = prioritizedSimpleKeys.includes(leftKey)
            const hasRight =
              typeof rightKey === 'string' ? prioritizedSimpleKeys.includes(rightKey) : false
            if (!hasLeft && !hasRight) return null
            return (
              <React.Fragment key={`priority-row-${leftKey}-${rightKey ?? 'none'}-${resetKey}`}>
                <div className={classes.fieldItem}>
                  {hasLeft ? renderSimpleField(leftKey) : null}
                </div>
                <div className={classes.fieldItem}>
                  {hasRight && rightKey ? renderSimpleField(rightKey) : null}
                </div>
              </React.Fragment>
            )
          })}

        {groupedSimpleRows.map(([leftKey, rightKey]) => (
          <React.Fragment key={`grouped-${leftKey}-${rightKey ?? 'none'}-${resetKey}`}>
            <div className={classes.fieldItem}>{renderSimpleField(leftKey)}</div>
            <div className={classes.fieldItem}>{rightKey ? renderSimpleField(rightKey) : null}</div>
          </React.Fragment>
        ))}
      </>
    ),
    [
      classes.fieldItem,
      groupedSimpleRows,
      hasActiveSearch,
      prioritizedSimpleKeys,
      renderSimpleField,
      resetKey,
    ],
  )

  return (
    <GluuLoader
      blocking={
        acrLoading ||
        putAcrsMutation.isPending ||
        jsonConfigQueryLoading ||
        patchJsonPropertiesMutation.isPending
      }
    >
      <GluuViewWrapper canShow={canReadProperties}>
        <GluuPageContent>
          <div className={classes.searchCard}>
            <div className={classes.searchCardContent}>
              <GluuSearchToolbar
                searchLabel={`${t('actions.search')}:`}
                searchValue={search}
                searchPlaceholder={t('placeholders.search_pattern')}
                searchOnType
                searchDebounceMs={300}
                onSearch={handleSearchChange}
                onSearchSubmit={handleSearchChange}
              />
            </div>
          </div>
          <Card className={classes.pageCard}>
            <CardBody>
              <Form
                onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
                  e.preventDefault()
                  toggle()
                }}
                className={classes.form}
              >
                <div className={classes.formContent}>
                  <div className={classes.fieldsGrid}>
                    {simpleFieldsContent}

                    {isConfigLoaded &&
                      (t(DEFAULT_ACR_LABEL_KEY).toLowerCase().includes(deferredSearch) ||
                        generateLabel(ACR_CHALLENGE_KEY)
                          .toLowerCase()
                          .includes(deferredSearch)) && (
                        <React.Fragment key={`acr-row-${resetKey}`}>
                          <div className={classes.fieldItem}>
                            <DefaultAcrInput
                              name="defaultAcr"
                              lsize={12}
                              rsize={12}
                              label={DEFAULT_ACR_LABEL_KEY}
                              handler={putHandler}
                              value={acrs?.defaultAcr}
                              options={authScripts}
                              path={DEFAULT_ACR_PATH}
                              showSaveButtons={false}
                            />
                          </div>
                          <div className={classes.fieldItem}>
                            {simpleFieldModels[ACR_CHALLENGE_KEY] &&
                              renderSimpleField(ACR_CHALLENGE_KEY)}
                          </div>
                        </React.Fragment>
                      )}

                    {complexEntries.map(({ propKey, propValue }) => (
                      <div
                        key={`complex-${propKey}-${resetKey}`}
                        className={classes.fieldItemFullWidth}
                      >
                        <PropertyBuilder
                          isRenamedKey={isRenamedKey(propKey, t(DISCOVERY_DENY_KEYS_I18N))}
                          propKey={propKey}
                          propValue={propValue}
                          lSize={lSize}
                          handler={patchHandler}
                          errors={formik.errors}
                          touched={formik.touched}
                          formResetKey={resetKey}
                        />
                      </div>
                    ))}
                  </div>
                </div>
                {canWriteProperties && (
                  <div className={classes.stickyFooter}>
                    <GluuThemeFormFooter
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
              <GluuText
                variant="div"
                className={`alert alert-danger ${classes.errorAlert}`}
                role="alert"
                disableThemeColor
              >
                {errorMessage}
              </GluuText>
            )}
            {canWriteProperties && (
              <GluuCommitDialog
                handler={toggle}
                modal={modal}
                operations={operations}
                onAccept={handleSubmit}
              />
            )}
          </Card>
        </GluuPageContent>
      </GluuViewWrapper>
    </GluuLoader>
  )
}

export default AuthServerPropertiesPage
