import React, { useCallback, useContext, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Formik, Form, FormikProps } from 'formik'
import { ErrorBoundary } from 'react-error-boundary'
import { Box, Button, Paper, Tabs, Tab } from '@mui/material'
import {
  InfoOutlined,
  LockOutlined,
  VpnKeyOutlined,
  LinkOutlined,
  TokenOutlined,
  PhoneCallbackOutlined,
  CodeOutlined,
  LanguageOutlined,
  SettingsOutlined,
  CreditCardOutlined,
} from '@mui/icons-material'
import customColors from '@/customColors'
import { Card, CardBody } from 'Components'
import { ThemeContext } from 'Context/theme/themeContext'
import getThemeColor from 'Context/theme/config'
import GluuCommitDialog from 'Routes/Apps/Gluu/GluuCommitDialog'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'
import { adminUiFeatures } from 'Plugins/admin/helper/utils'
import { useGetConfigScripts, useGetProperties } from 'JansConfigApi'
import type {
  ClientFormProps,
  ClientFormValues,
  ClientSection,
  ModifiedFields,
  SectionProps,
} from '../types'
import { useClientScopes } from '../hooks'
import SectionErrorFallback from './SectionErrorFallback'
import { clientValidationSchema } from '../helper/validations'
import { buildClientInitialValues, buildClientPayload, downloadClientAsJson } from '../helper/utils'
import { SECTIONS } from '../helper/constants'
import {
  BasicInfoSection,
  AuthenticationSection,
  ScopesGrantsSection,
  UrisSection,
  TokensSection,
  CibaSection,
  ScriptsSection,
  LocalizationSection,
  SystemInfoSection,
  ActiveTokensSection,
} from '../sections'

const SCRIPTS_FETCH_LIMIT = 200

const SECTION_ICONS: Record<string, React.ReactNode> = {
  InfoOutlined: <InfoOutlined />,
  LockOutlined: <LockOutlined />,
  VpnKeyOutlined: <VpnKeyOutlined />,
  LinkOutlined: <LinkOutlined />,
  TokenOutlined: <TokenOutlined />,
  PhoneCallbackOutlined: <PhoneCallbackOutlined />,
  CodeOutlined: <CodeOutlined />,
  LanguageOutlined: <LanguageOutlined />,
  SettingsOutlined: <SettingsOutlined />,
  CreditCardOutlined: <CreditCardOutlined />,
}

const ClientForm: React.FC<ClientFormProps> = ({
  client,
  isEdit = false,
  viewOnly = false,
  onSubmit,
  onCancel,
}) => {
  const { t } = useTranslation()
  const theme = useContext(ThemeContext)
  const selectedTheme = theme?.state?.theme || 'darkBlue'
  const themeColors = useMemo(() => getThemeColor(selectedTheme), [selectedTheme])

  const [activeSection, setActiveSection] = useState<ClientSection>('basic')
  const [modifiedFields, setModifiedFields] = useState<ModifiedFields>({})
  const [commitModalOpen, setCommitModalOpen] = useState(false)
  const [formValues, setFormValues] = useState<ClientFormValues | null>(null)

  const { data: propertiesData } = useGetProperties({
    query: {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      staleTime: 300000,
    },
  })

  const oidcConfiguration = useMemo(() => (propertiesData || {}) as any, [propertiesData])

  const { scopes, scopesLoading, handleScopeSearch } = useClientScopes()

  const { data: scriptsResponse } = useGetConfigScripts(
    { limit: SCRIPTS_FETCH_LIMIT },
    {
      query: {
        refetchOnMount: 'always' as const,
        refetchOnWindowFocus: false,
        staleTime: 30000,
      },
    },
  )

  const scripts = useMemo((): Array<{
    dn: string
    name: string
    scriptType?: string
    enabled?: boolean
  }> => {
    const entries = (scriptsResponse?.entries || []) as Array<{
      dn?: string
      name?: string
      scriptType?: string
      enabled?: boolean
    }>
    return entries.map((script) => ({
      dn: script.dn || '',
      name: script.name || '',
      scriptType: script.scriptType,
      enabled: script.enabled,
    }))
  }, [scriptsResponse?.entries])

  const scriptsTruncated = useMemo(() => {
    const totalCount = scriptsResponse?.totalEntriesCount
    return typeof totalCount === 'number' && totalCount > SCRIPTS_FETCH_LIMIT
  }, [scriptsResponse?.totalEntriesCount])

  const initialValues = useMemo(() => buildClientInitialValues(client), [client])

  const visibleSections = useMemo(() => {
    if (isEdit) {
      return SECTIONS
    }
    return SECTIONS.filter((s) => s.id !== 'activeTokens')
  }, [isEdit])

  const handleSectionChange = useCallback((section: ClientSection) => {
    setActiveSection(section)
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

  const operations = useMemo(() => {
    return Object.keys(modifiedFields).map((key) => ({
      path: key,
      value: modifiedFields[key] as any,
    }))
  }, [modifiedFields])

  const tabsSx = useMemo(
    () => ({
      '& .MuiTab-root.Mui-selected': {
        color: themeColors?.background,
        fontWeight: 600,
        background: themeColors?.background,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
      },
      '& .MuiTabs-indicator': {
        background: themeColors?.background,
        height: 3,
        borderRadius: '2px',
        boxShadow: `0 2px 4px ${themeColors?.background}`,
      },
    }),
    [themeColors],
  )

  const renderSectionContent = useCallback(
    (formik: FormikProps<ClientFormValues>) => {
      const sectionProps: SectionProps = {
        formik,
        viewOnly,
        setModifiedFields,
        scripts,
        scriptsTruncated,
        scopes,
        scopesLoading,
        onScopeSearch: handleScopeSearch,
        oidcConfiguration,
      }

      switch (activeSection) {
        case 'basic':
          return <BasicInfoSection {...sectionProps} />
        case 'authentication':
          return <AuthenticationSection {...sectionProps} />
        case 'scopes':
          return <ScopesGrantsSection {...sectionProps} />
        case 'uris':
          return <UrisSection {...sectionProps} />
        case 'tokens':
          return <TokensSection {...sectionProps} />
        case 'ciba':
          return <CibaSection {...sectionProps} />
        case 'scripts':
          return <ScriptsSection {...sectionProps} />
        case 'localization':
          return <LocalizationSection {...sectionProps} />
        case 'system':
          return <SystemInfoSection {...sectionProps} />
        case 'activeTokens':
          return <ActiveTokensSection formik={formik} viewOnly={viewOnly} />
        default:
          return null
      }
    },
    [
      activeSection,
      viewOnly,
      scripts,
      scriptsTruncated,
      scopes,
      scopesLoading,
      handleScopeSearch,
      oidcConfiguration,
    ],
  )

  const activeTabIndex = useMemo(
    () => visibleSections.findIndex((s) => s.id === activeSection),
    [visibleSections, activeSection],
  )

  const handleTabChange = useCallback(
    (_: React.SyntheticEvent, newValue: number) => {
      const section = visibleSections[newValue]
      if (section) {
        handleSectionChange(section.id as ClientSection)
      }
    },
    [visibleSections, handleSectionChange],
  )

  const renderNavigation = useCallback(() => {
    return (
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs
          value={activeTabIndex}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={tabsSx}
        >
          {visibleSections.map((section) => (
            <Tab
              key={section.id}
              icon={SECTION_ICONS[section.icon] as React.ReactElement}
              label={t(section.labelKey)}
              iconPosition="start"
            />
          ))}
        </Tabs>
      </Box>
    )
  }, [activeTabIndex, handleTabChange, tabsSx, visibleSections, t])

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
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mb: 2 }}>
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
                {!viewOnly && (
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={!formik.dirty && Object.keys(modifiedFields).length === 0}
                    sx={{
                      'backgroundColor': themeColors?.background,
                      'color': 'white',
                      '&:hover': {
                        backgroundColor: themeColors?.background,
                        opacity: 0.9,
                      },
                      '&:disabled': {
                        backgroundColor: themeColors?.lightBackground,
                        color: 'rgba(255, 255, 255, 0.7)',
                      },
                    }}
                  >
                    {isEdit ? t('actions.save') : t('actions.add')}
                  </Button>
                )}
              </Box>

              {renderNavigation()}
              <Paper elevation={0} sx={{ p: 2, minHeight: 400 }}>
                <ErrorBoundary FallbackComponent={SectionErrorFallback} resetKeys={[activeSection]}>
                  {renderSectionContent(formik)}
                </ErrorBoundary>
              </Paper>

              <Box
                sx={{
                  display: 'flex',
                  justifyContent: viewOnly ? 'flex-start' : 'space-between',
                  mt: 3,
                  pt: 2,
                  borderTop: `1px solid ${themeColors?.lightBackground || '#e0e0e0'}`,
                }}
              >
                {onCancel ? (
                  <Button
                    variant="outlined"
                    onClick={onCancel}
                    sx={{
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
                ) : (
                  <Box />
                )}
                {!viewOnly && (
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={!formik.dirty && Object.keys(modifiedFields).length === 0}
                    sx={{
                      'backgroundColor': themeColors?.background,
                      'color': 'white',
                      '&:hover': {
                        backgroundColor: themeColors?.background,
                        opacity: 0.9,
                      },
                      '&:disabled': {
                        backgroundColor: themeColors?.lightBackground,
                        color: 'rgba(255, 255, 255, 0.7)',
                      },
                    }}
                  >
                    {isEdit ? t('actions.save') : t('actions.add')}
                  </Button>
                )}
              </Box>
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
