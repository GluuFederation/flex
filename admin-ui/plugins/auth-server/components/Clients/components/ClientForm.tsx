import React, { useCallback, useContext, useMemo, useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Formik, Form } from 'formik'
import { Box, Tabs, Tab, Button, Paper } from '@mui/material'
import { Card, CardBody } from 'Components'
import { ThemeContext } from 'Context/theme/themeContext'
import getThemeColor from 'Context/theme/config'
import GluuCommitDialog from 'Routes/Apps/Gluu/GluuCommitDialog'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'
import { adminUiFeatures } from 'Plugins/admin/helper/utils'
import { useGetOauthScopes } from 'JansConfigApi'
import { useSelector, useDispatch } from 'react-redux'
import { getScripts } from 'Redux/features/initSlice'
import { getOidcDiscovery } from 'Redux/features/oidcDiscoverySlice'
import type {
  ClientFormProps,
  ClientFormValues,
  ClientTab,
  ModifiedFields,
  ClientScope,
  RootState,
} from '../types'
import { clientValidationSchema } from '../helper/validations'
import { buildClientInitialValues, buildClientPayload, downloadClientAsJson } from '../helper/utils'
import { TAB_LABELS, DEFAULT_SCOPE_SEARCH_LIMIT } from '../helper/constants'
import BasicInfoTab from '../tabs/BasicInfoTab'
import AuthenticationTab from '../tabs/AuthenticationTab'
import ScopesGrantsTab from '../tabs/ScopesGrantsTab'
import AdvancedTab from '../tabs/AdvancedTab'
import UrisTab from '../tabs/UrisTab'

interface InitReducerState {
  scripts: Array<{ dn?: string; name?: string; scriptType?: string; enabled?: boolean }>
}

interface OidcDiscoveryState {
  configuration: Record<string, unknown>
  loading: boolean
}

interface ExtendedRootState extends RootState {
  initReducer: InitReducerState
  oidcDiscoveryReducer: OidcDiscoveryState
}

const TABS: ClientTab[] = ['basic', 'authentication', 'scopes', 'advanced', 'uris']

const ClientForm: React.FC<ClientFormProps> = ({
  client,
  isEdit = false,
  viewOnly = false,
  onSubmit,
  onCancel,
}) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const theme = useContext(ThemeContext)
  const selectedTheme = theme?.state?.theme || 'darkBlue'
  const themeColors = useMemo(() => getThemeColor(selectedTheme), [selectedTheme])

  const [activeTab, setActiveTab] = useState<ClientTab>('basic')
  const [modifiedFields, setModifiedFields] = useState<ModifiedFields>({})
  const [commitModalOpen, setCommitModalOpen] = useState(false)
  const [formValues, setFormValues] = useState<ClientFormValues | null>(null)
  const [scopeSearchPattern, setScopeSearchPattern] = useState('')

  const reduxScripts = useSelector((state: ExtendedRootState) => state.initReducer?.scripts || [])

  const scripts = useMemo(
    () =>
      reduxScripts.map(
        (s): { dn: string; name: string; scriptType?: string; enabled?: boolean } => ({
          dn: s.dn || '',
          name: s.name || '',
          scriptType: s.scriptType,
          enabled: s.enabled,
        }),
      ),
    [reduxScripts],
  )
  const oidcConfiguration = useSelector(
    (state: ExtendedRootState) => state.oidcDiscoveryReducer?.configuration || {},
  )

  const scopeQueryParams = useMemo(
    () => ({
      limit: DEFAULT_SCOPE_SEARCH_LIMIT,
      pattern: scopeSearchPattern || undefined,
    }),
    [scopeSearchPattern],
  )

  const { data: scopesResponse, isLoading: scopesLoading } = useGetOauthScopes(scopeQueryParams, {
    query: {
      refetchOnMount: 'always' as const,
      refetchOnWindowFocus: false,
      staleTime: 30000,
    },
  })

  const scopes = useMemo((): ClientScope[] => {
    const entries = (scopesResponse?.entries || []) as Array<{
      dn?: string
      inum?: string
      id?: string
      displayName?: string
      description?: string
    }>
    return entries.map(
      (scope): ClientScope => ({
        dn: scope.dn || '',
        inum: scope.inum,
        id: scope.id,
        displayName: scope.displayName || scope.id,
        description: scope.description,
      }),
    )
  }, [scopesResponse?.entries])

  const initialValues = useMemo(() => buildClientInitialValues(client), [client])

  useEffect(() => {
    dispatch(getScripts({ action: { limit: 100000 } }))
    dispatch(getOidcDiscovery())
  }, [dispatch])

  const handleTabChange = useCallback((_: React.SyntheticEvent, newValue: ClientTab) => {
    setActiveTab(newValue)
  }, [])

  const handleScopeSearch = useCallback((pattern: string) => {
    setScopeSearchPattern(pattern)
  }, [])

  const handleFormSubmit = useCallback((values: ClientFormValues) => {
    setFormValues(values)
    setCommitModalOpen(true)
  }, [])

  const handleCommitAccept = useCallback(
    (message: string) => {
      if (formValues) {
        const payload = buildClientPayload(formValues)
        onSubmit(payload as ClientFormValues, message, modifiedFields)
      }
      setCommitModalOpen(false)
    },
    [formValues, modifiedFields, onSubmit],
  )

  const handleCommitClose = useCallback(() => {
    setCommitModalOpen(false)
  }, [])

  const handleDownload = useCallback((values: ClientFormValues) => {
    downloadClientAsJson(values)
  }, [])

  const tabStyle = useMemo(
    () => ({
      borderBottom: 1,
      borderColor: 'divider',
      mb: 2,
    }),
    [],
  )

  const buttonStyle = useMemo(
    () => ({
      ...applicationStyle.buttonStyle,
      mr: 1,
    }),
    [],
  )

  const operations = useMemo(() => {
    return Object.keys(modifiedFields).map((key) => ({
      path: key,
      value: modifiedFields[key],
    }))
  }, [modifiedFields])

  const renderTabContent = useCallback(
    (formik: {
      values: ClientFormValues
      setFieldValue: (field: string, value: unknown) => void
    }) => {
      const tabProps = {
        formik: formik as any,
        viewOnly,
        modifiedFields,
        setModifiedFields,
      }

      switch (activeTab) {
        case 'basic':
          return <BasicInfoTab {...tabProps} oidcConfiguration={oidcConfiguration} />
        case 'authentication':
          return <AuthenticationTab {...tabProps} oidcConfiguration={oidcConfiguration} />
        case 'scopes':
          return (
            <ScopesGrantsTab
              {...tabProps}
              scopes={scopes}
              scopesLoading={scopesLoading}
              onScopeSearch={handleScopeSearch}
            />
          )
        case 'advanced':
          return <AdvancedTab {...tabProps} scripts={scripts} isEdit={isEdit} />
        case 'uris':
          return <UrisTab {...tabProps} />
        default:
          return null
      }
    },
    [
      activeTab,
      viewOnly,
      modifiedFields,
      oidcConfiguration,
      scopes,
      scopesLoading,
      handleScopeSearch,
      scripts,
      isEdit,
    ],
  )

  return (
    <Card style={applicationStyle.mainCard}>
      <CardBody>
        <Formik
          initialValues={initialValues}
          validationSchema={clientValidationSchema}
          onSubmit={handleFormSubmit}
          enableReinitialize
        >
          {(formik) => (
            <Form>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                <Button
                  variant="outlined"
                  onClick={() => handleDownload(formik.values)}
                  startIcon={<i className="fa fa-download" />}
                  sx={{
                    'borderColor': themeColors?.background,
                    'color': themeColors?.background,
                    '&:hover': {
                      borderColor: themeColors?.background,
                      backgroundColor: `${themeColors?.background}10`,
                    },
                  }}
                >
                  {t('fields.download_summary')}
                </Button>
              </Box>

              <Paper elevation={0} sx={{ mb: 2 }}>
                <Box sx={tabStyle}>
                  <Tabs
                    value={activeTab}
                    onChange={handleTabChange}
                    variant="scrollable"
                    scrollButtons="auto"
                  >
                    {TABS.map((tab) => (
                      <Tab key={tab} label={t(TAB_LABELS[tab])} value={tab} />
                    ))}
                  </Tabs>
                </Box>

                {renderTabContent(formik)}
              </Paper>

              {!viewOnly && (
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    mt: 3,
                    pt: 2,
                    borderTop: `1px solid ${themeColors?.lightBackground || '#e0e0e0'}`,
                  }}
                >
                  {onCancel && (
                    <Button
                      variant="outlined"
                      onClick={onCancel}
                      sx={{
                        ...buttonStyle,
                        'borderColor': themeColors?.background,
                        'color': themeColors?.background,
                        '&:hover': {
                          borderColor: themeColors?.background,
                          backgroundColor: `${themeColors?.background}10`,
                        },
                      }}
                    >
                      {t('actions.cancel')}
                    </Button>
                  )}
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={!formik.dirty && Object.keys(modifiedFields).length === 0}
                    sx={{
                      'backgroundColor': themeColors?.background,
                      '&:hover': {
                        backgroundColor: themeColors?.background,
                        opacity: 0.9,
                      },
                      '&:disabled': {
                        backgroundColor: themeColors?.lightBackground,
                      },
                    }}
                  >
                    {isEdit ? t('actions.save') : t('actions.add')}
                  </Button>
                </Box>
              )}
            </Form>
          )}
        </Formik>
      </CardBody>

      <GluuCommitDialog
        feature={adminUiFeatures.oidc_clients_write}
        handler={handleCommitClose}
        modal={commitModalOpen}
        onAccept={handleCommitAccept}
        operations={operations}
      />
    </Card>
  )
}

export default ClientForm
