import React, { useCallback, useContext, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Formik, Form } from 'formik'
import {
  Box,
  Button,
  Paper,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Tooltip,
  useMediaQuery,
  useTheme,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material'
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
  ChevronLeft,
  ChevronRight,
} from '@mui/icons-material'
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
  ClientScope,
} from '../types'
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
} from '../sections'

const NAV_COLLAPSED_KEY = 'clientFormNavCollapsed'

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
}

const ClientForm: React.FC<ClientFormProps> = ({
  client,
  isEdit = false,
  viewOnly = false,
  onSubmit,
  onCancel,
  scopes: propScopes = [],
  scopesLoading: propScopesLoading = false,
  onScopeSearch: propOnScopeSearch,
}) => {
  const { t } = useTranslation()
  const muiTheme = useTheme()
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'))
  const theme = useContext(ThemeContext)
  const selectedTheme = theme?.state?.theme || 'darkBlue'
  const themeColors = useMemo(() => getThemeColor(selectedTheme), [selectedTheme])

  const [activeSection, setActiveSection] = useState<ClientSection>('basic')
  const [navCollapsed, setNavCollapsed] = useState(() => {
    const stored = localStorage.getItem(NAV_COLLAPSED_KEY)
    return stored === 'true'
  })
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

  const oidcConfiguration = useMemo(() => propertiesData || {}, [propertiesData])

  const scopes = propScopes
  const scopesLoading = propScopesLoading
  const handleScopeSearch = useCallback(
    (pattern: string) => {
      if (propOnScopeSearch) {
        propOnScopeSearch(pattern)
      }
    },
    [propOnScopeSearch],
  )

  const { data: scriptsResponse } = useGetConfigScripts(
    { limit: 200 },
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

  const initialValues = useMemo(() => buildClientInitialValues(client), [client])

  const handleNavCollapse = useCallback(() => {
    setNavCollapsed((prev) => {
      const newValue = !prev
      localStorage.setItem(NAV_COLLAPSED_KEY, String(newValue))
      return newValue
    })
  }, [])

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

  const navPanelStyle = useMemo(
    () => ({
      width: navCollapsed ? 64 : 240,
      minWidth: navCollapsed ? 64 : 240,
      transition: 'width 0.2s ease, min-width 0.2s ease',
      borderRight: `1px solid ${themeColors?.lightBackground || '#e0e0e0'}`,
      backgroundColor: themeColors?.lightBackground || '#fafafa',
      display: 'flex',
      flexDirection: 'column' as const,
    }),
    [navCollapsed, themeColors],
  )

  const listItemStyle = useMemo(
    () => ({
      'py': 1.5,
      'px': navCollapsed ? 2 : 2,
      'justifyContent': navCollapsed ? 'center' : 'flex-start',
      '&.Mui-selected': {
        backgroundColor: `${themeColors?.background}15`,
        borderRight: `3px solid ${themeColors?.background}`,
      },
      '&.Mui-selected:hover': {
        backgroundColor: `${themeColors?.background}20`,
      },
      '&:hover': {
        backgroundColor: `${themeColors?.background}10`,
      },
    }),
    [navCollapsed, themeColors],
  )

  const renderSectionContent = useCallback(
    (formik: {
      values: ClientFormValues
      setFieldValue: (field: string, value: unknown) => void
      dirty: boolean
    }) => {
      const sectionProps = {
        formik: formik as any,
        viewOnly,
        setModifiedFields,
        scripts,
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
        default:
          return null
      }
    },
    [activeSection, viewOnly, scripts, scopes, scopesLoading, handleScopeSearch, oidcConfiguration],
  )

  const renderNavigation = useCallback(() => {
    if (isMobile) {
      return (
        <FormControl fullWidth size="small" sx={{ mb: 2 }}>
          <InputLabel id="section-select-label">{t('fields.section')}</InputLabel>
          <Select
            labelId="section-select-label"
            value={activeSection}
            label={t('fields.section')}
            onChange={(e) => handleSectionChange(e.target.value as ClientSection)}
            sx={{
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: themeColors?.lightBackground,
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: themeColors?.background,
              },
            }}
          >
            {SECTIONS.map((section) => (
              <MenuItem key={section.id} value={section.id}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {SECTION_ICONS[section.icon]}
                  {t(section.labelKey)}
                </Box>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )
    }

    return (
      <Paper elevation={0} sx={navPanelStyle}>
        <List sx={{ flex: 1, py: 1 }}>
          {SECTIONS.map((section) => (
            <Tooltip
              key={section.id}
              title={navCollapsed ? t(section.labelKey) : ''}
              placement="right"
              arrow
            >
              <ListItemButton
                selected={activeSection === section.id}
                onClick={() => handleSectionChange(section.id as ClientSection)}
                sx={listItemStyle}
              >
                <ListItemIcon
                  sx={{
                    minWidth: navCollapsed ? 0 : 40,
                    color: activeSection === section.id ? themeColors?.background : 'inherit',
                  }}
                >
                  {SECTION_ICONS[section.icon]}
                </ListItemIcon>
                {!navCollapsed && (
                  <ListItemText
                    primary={t(section.labelKey)}
                    sx={{
                      '& .MuiTypography-root': {
                        fontSize: '0.875rem',
                        fontWeight: activeSection === section.id ? 600 : 400,
                        color: activeSection === section.id ? themeColors?.background : 'inherit',
                      },
                    }}
                  />
                )}
              </ListItemButton>
            </Tooltip>
          ))}
        </List>
        <Box
          sx={{
            borderTop: `1px solid ${themeColors?.lightBackground || '#e0e0e0'}`,
            p: 1,
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <IconButton
            onClick={handleNavCollapse}
            size="small"
            sx={{ color: themeColors?.fontColor }}
          >
            {navCollapsed ? <ChevronRight /> : <ChevronLeft />}
          </IconButton>
        </Box>
      </Paper>
    )
  }, [
    isMobile,
    activeSection,
    navCollapsed,
    themeColors,
    t,
    handleSectionChange,
    handleNavCollapse,
    navPanelStyle,
    listItemStyle,
  ])

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

              {isMobile ? (
                <Box>
                  {renderNavigation()}
                  <Paper elevation={0} sx={{ p: 2 }}>
                    {renderSectionContent(formik)}
                  </Paper>
                </Box>
              ) : (
                <Box
                  sx={{
                    display: 'flex',
                    minHeight: 600,
                    border: `1px solid ${themeColors?.lightBackground || '#e0e0e0'}`,
                    borderRadius: 1,
                  }}
                >
                  {renderNavigation()}
                  <Box sx={{ flex: 1, p: 3, overflow: 'auto' }}>{renderSectionContent(formik)}</Box>
                </Box>
              )}

              {!viewOnly && (
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
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
