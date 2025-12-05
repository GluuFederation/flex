import React, { useCallback, useContext, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Formik, Form, Field, FieldArray } from 'formik'
import * as Yup from 'yup'
import {
  Box,
  Grid,
  Paper,
  Typography,
  TextField,
  Switch,
  FormControlLabel,
  Button,
  IconButton,
  InputAdornment,
  Autocomplete,
  Chip,
  Divider,
  Tooltip,
} from '@mui/material'
import {
  Visibility,
  VisibilityOff,
  ContentCopy,
  Add as AddIcon,
  Delete as DeleteIcon,
  Autorenew as GenerateIcon,
} from '@mui/icons-material'
import { Card, CardBody } from 'Components'
import { ThemeContext } from 'Context/theme/themeContext'
import getThemeColor from 'Context/theme/config'
import GluuCommitDialog from 'Routes/Apps/Gluu/GluuCommitDialog'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'
import { adminUiFeatures } from 'Plugins/admin/helper/utils'
import { useGetOauthScopes } from 'JansConfigApi'
import { GRANT_TYPES, DEFAULT_SCOPE_SEARCH_LIMIT } from '../helper/constants'
import { buildClientPayload } from '../helper/utils'
import type { ClientFormValues, ModifiedFields, ClientScope } from '../types'

interface ClientAddFormProps {
  onSubmit: (values: ClientFormValues, message: string, modifiedFields: ModifiedFields) => void
  onCancel?: () => void
}

interface AddFormValues {
  clientName: string
  clientSecret: string
  disabled: boolean
  description: string
  scopes: string[]
  grantTypes: string[]
  redirectUris: string[]
  postLogoutRedirectUris: string[]
}

const initialValues: AddFormValues = {
  clientName: '',
  clientSecret: '',
  disabled: false,
  description: '',
  scopes: [],
  grantTypes: [],
  redirectUris: [''],
  postLogoutRedirectUris: [''],
}

const urlValidation = Yup.string().test(
  'is-valid-uri',
  'Invalid URI format. Must be a valid URL (e.g., https://example.com) or custom scheme (e.g., myapp://callback)',
  (value) => {
    if (!value || value.trim() === '') return true
    try {
      new URL(value)
      return true
    } catch {
      if (value.startsWith('http://localhost') || value.startsWith('http://127.0.0.1')) {
        return true
      }
      const customSchemeRegex = /^[a-zA-Z][a-zA-Z0-9+.-]*:\/\/.+$/
      if (customSchemeRegex.test(value)) {
        return true
      }
      return false
    }
  },
)

const validationSchema = Yup.object().shape({
  clientName: Yup.string().required('Client name is required'),
  clientSecret: Yup.string().required('Client secret is required'),
  description: Yup.string(),
  scopes: Yup.array().of(Yup.string()),
  grantTypes: Yup.array().of(Yup.string()),
  redirectUris: Yup.array()
    .of(urlValidation)
    .test('has-valid-uri', 'At least one valid redirect URI is required', (value) => {
      if (!value || value.length === 0) return false
      return value.some((uri) => uri && uri.trim() !== '')
    }),
  postLogoutRedirectUris: Yup.array().of(urlValidation),
})

const ClientAddForm: React.FC<ClientAddFormProps> = ({ onSubmit, onCancel }) => {
  const { t } = useTranslation()
  const theme = useContext(ThemeContext)
  const selectedTheme = theme?.state?.theme || 'darkBlue'
  const themeColors = useMemo(() => getThemeColor(selectedTheme), [selectedTheme])

  const [showSecret, setShowSecret] = useState(false)
  const [commitModalOpen, setCommitModalOpen] = useState(false)
  const [formValues, setFormValues] = useState<AddFormValues | null>(null)
  const [scopeSearchPattern, setScopeSearchPattern] = useState('')

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

  const handleToggleSecret = useCallback(() => {
    setShowSecret((prev) => !prev)
  }, [])

  const generateSecret = useCallback((length = 32): string => {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*'
    const array = new Uint8Array(length)
    crypto.getRandomValues(array)
    return Array.from(array, (byte) => charset[byte % charset.length]).join('')
  }, [])

  const handleCopyToClipboard = useCallback((text: string) => {
    navigator.clipboard.writeText(text)
  }, [])

  const handleFormSubmit = useCallback((values: AddFormValues) => {
    setFormValues(values)
    setCommitModalOpen(true)
  }, [])

  const handleCommitAccept = useCallback(
    (message: string) => {
      if (formValues) {
        const fullPayload = {
          ...formValues,
          applicationType: 'web' as const,
          subjectType: 'public' as const,
          tokenEndpointAuthMethod: 'client_secret_basic' as const,
          responseTypes: [] as string[],
          redirectUris: formValues.redirectUris.filter(Boolean),
          postLogoutRedirectUris: formValues.postLogoutRedirectUris.filter(Boolean),
          frontChannelLogoutSessionRequired: false,
          backchannelUserCodeParameter: false,
          trustedClient: false,
          persistClientAuthorizations: false,
          includeClaimsInIdToken: false,
          rptAsJwt: false,
          accessTokenAsJwt: false,
          deletable: true,
          customObjectClasses: ['top'],
          contacts: [] as string[],
          defaultAcrValues: [] as string[],
          claims: [] as string[],
          claimRedirectUris: [] as string[],
          authorizedOrigins: [] as string[],
          requestUris: [] as string[],
          attributes: {
            runIntrospectionScriptBeforeJwtCreation: false,
            keepClientAuthorizationAfterExpiration: false,
            allowSpontaneousScopes: false,
            backchannelLogoutSessionRequired: false,
            backchannelLogoutUri: [] as string[],
            rptClaimsScripts: [] as string[],
            consentGatheringScripts: [] as string[],
            spontaneousScopeScriptDns: [] as string[],
            introspectionScripts: [] as string[],
            postAuthnScripts: [] as string[],
            ropcScripts: [] as string[],
            updateTokenScriptDns: [] as string[],
            additionalAudience: [] as string[],
            spontaneousScopes: [] as string[],
            jansAuthorizedAcr: [] as string[],
            requirePar: false,
            dpopBoundAccessToken: false,
            jansDefaultPromptLogin: false,
            minimumAcrLevelAutoresolve: false,
            requirePkce: false,
          },
        }
        const payload = buildClientPayload(fullPayload as unknown as ClientFormValues)
        const modifiedFields: ModifiedFields = {}
        Object.entries(formValues).forEach(([key, value]) => {
          if (value !== undefined && value !== '' && (!Array.isArray(value) || value.length > 0)) {
            modifiedFields[key] = value
          }
        })
        onSubmit(payload as ClientFormValues, message, modifiedFields)
      }
      setCommitModalOpen(false)
    },
    [formValues, onSubmit],
  )

  const handleCommitClose = useCallback(() => {
    setCommitModalOpen(false)
  }, [])

  const panelStyle = useMemo(
    () => ({
      p: 3,
      borderRadius: 2,
      height: '100%',
      backgroundColor: 'background.paper',
    }),
    [],
  )

  const sectionTitleStyle = useMemo(
    () => ({
      fontSize: '1.1rem',
      fontWeight: 600,
      mb: 3,
      color: 'text.primary',
    }),
    [],
  )

  const fieldStyle = useMemo(
    () => ({
      '& .MuiOutlinedInput-root': {
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
          borderColor: themeColors?.background,
        },
      },
      '& .MuiInputLabel-root.Mui-focused': {
        color: themeColors?.background,
      },
    }),
    [themeColors],
  )

  const fieldLabelStyle = useMemo(
    () => ({
      fontSize: '0.85rem',
      fontWeight: 500,
      mb: 0.5,
      color: 'text.secondary',
    }),
    [],
  )

  return (
    <Card style={applicationStyle.mainCard}>
      <CardBody>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleFormSubmit}
        >
          {(formik) => (
            <Form>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Paper elevation={1} sx={panelStyle}>
                    <Typography sx={sectionTitleStyle}>{t('titles.client_information')}</Typography>

                    <Box sx={{ mb: 2.5 }}>
                      <Typography sx={fieldLabelStyle}>
                        {t('fields.name')} <span style={{ color: 'red' }}>*</span>
                      </Typography>
                      <Field
                        as={TextField}
                        name="clientName"
                        fullWidth
                        size="small"
                        placeholder={t('placeholders.enter_client_name')}
                        error={formik.touched.clientName && Boolean(formik.errors.clientName)}
                        helperText={formik.touched.clientName && formik.errors.clientName}
                        sx={fieldStyle}
                      />
                    </Box>

                    <Box sx={{ mb: 2.5 }}>
                      <Typography sx={fieldLabelStyle}>
                        {t('fields.client_secret')} <span style={{ color: 'red' }}>*</span>
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Field
                          as={TextField}
                          name="clientSecret"
                          fullWidth
                          size="small"
                          type={showSecret ? 'text' : 'password'}
                          placeholder="••••••••••••"
                          error={formik.touched.clientSecret && Boolean(formik.errors.clientSecret)}
                          helperText={formik.touched.clientSecret && formik.errors.clientSecret}
                          sx={fieldStyle}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton onClick={handleToggleSecret} edge="end" size="small">
                                  {showSecret ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                        />
                        <Tooltip title={t('actions.generate_secret')}>
                          <IconButton
                            onClick={() => {
                              const newSecret = generateSecret()
                              formik.setFieldValue('clientSecret', newSecret)
                              setShowSecret(true)
                            }}
                            sx={{
                              'border': '1px solid',
                              'borderColor': 'divider',
                              'borderRadius': 1,
                              '&:hover': {
                                backgroundColor: `${themeColors?.background}10`,
                              },
                            }}
                          >
                            <GenerateIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Box>

                    <Box sx={{ mb: 2.5 }}>
                      <Typography sx={fieldLabelStyle}>{t('fields.status')}</Typography>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={!formik.values.disabled}
                            onChange={(e) => formik.setFieldValue('disabled', !e.target.checked)}
                            sx={{
                              '& .MuiSwitch-switchBase.Mui-checked': {
                                color: themeColors?.background,
                              },
                              '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                backgroundColor: themeColors?.background,
                              },
                            }}
                          />
                        }
                        label={formik.values.disabled ? t('fields.disabled') : t('fields.active')}
                      />
                    </Box>

                    <Box>
                      <Typography sx={fieldLabelStyle}>{t('fields.description')}</Typography>
                      <Field
                        as={TextField}
                        name="description"
                        fullWidth
                        size="small"
                        multiline
                        rows={4}
                        placeholder={t('placeholders.enter_description')}
                        sx={fieldStyle}
                      />
                    </Box>
                  </Paper>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Paper elevation={1} sx={panelStyle}>
                    <Typography sx={sectionTitleStyle}>
                      {t('titles.permissions_and_endpoints')}
                    </Typography>

                    <Box sx={{ mb: 2.5 }}>
                      <Typography sx={fieldLabelStyle}>{t('fields.scopes')}</Typography>
                      <Autocomplete
                        multiple
                        options={scopes}
                        getOptionLabel={(option) =>
                          typeof option === 'string'
                            ? option
                            : option.id || option.displayName || ''
                        }
                        value={scopes.filter((s) => formik.values.scopes.includes(s.dn))}
                        onChange={(_, newValue) => {
                          formik.setFieldValue(
                            'scopes',
                            newValue.map((v) => (typeof v === 'string' ? v : v.dn)),
                          )
                        }}
                        onInputChange={(_, value) => setScopeSearchPattern(value)}
                        loading={scopesLoading}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            size="small"
                            placeholder={t('placeholders.search_scopes')}
                            sx={fieldStyle}
                          />
                        )}
                        renderTags={(value, getTagProps) =>
                          value.map((option, index) => (
                            <Chip
                              {...getTagProps({ index })}
                              key={typeof option === 'string' ? option : option.dn}
                              label={
                                typeof option === 'string'
                                  ? option
                                  : option.id || option.displayName
                              }
                              size="small"
                              sx={{
                                backgroundColor: themeColors?.background,
                                color: 'white',
                              }}
                            />
                          ))
                        }
                      />
                    </Box>

                    <Box sx={{ mb: 2.5 }}>
                      <Typography sx={fieldLabelStyle}>{t('fields.grant_types')}</Typography>
                      <Autocomplete
                        multiple
                        options={GRANT_TYPES}
                        getOptionLabel={(option) => option.label}
                        value={GRANT_TYPES.filter((g) =>
                          formik.values.grantTypes.includes(g.value),
                        )}
                        onChange={(_, newValue) => {
                          formik.setFieldValue(
                            'grantTypes',
                            newValue.map((v) => v.value),
                          )
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            size="small"
                            placeholder={t('placeholders.select_grant_types')}
                            sx={fieldStyle}
                          />
                        )}
                        renderTags={(value, getTagProps) =>
                          value.map((option, index) => (
                            <Chip
                              {...getTagProps({ index })}
                              key={option.value}
                              label={option.label}
                              size="small"
                              sx={{
                                backgroundColor: themeColors?.background,
                                color: 'white',
                              }}
                            />
                          ))
                        }
                      />
                    </Box>

                    <Divider sx={{ my: 2.5 }} />
                    <Typography sx={{ ...fieldLabelStyle, fontWeight: 600, mb: 2 }}>
                      {t('titles.uris')}
                    </Typography>

                    <Box sx={{ mb: 2.5 }}>
                      <Typography sx={fieldLabelStyle}>
                        {t('fields.login_uris')} <span style={{ color: 'red' }}>*</span>
                      </Typography>
                      {typeof formik.errors.redirectUris === 'string' &&
                        formik.touched.redirectUris && (
                          <Typography sx={{ color: 'error.main', fontSize: '0.75rem', mb: 1 }}>
                            {formik.errors.redirectUris}
                          </Typography>
                        )}
                      <FieldArray name="redirectUris">
                        {({ push, remove }) => (
                          <Box>
                            {formik.values.redirectUris.map((uri, index) => (
                              <Box key={index} sx={{ display: 'flex', gap: 1, mb: 1 }}>
                                <Field
                                  as={TextField}
                                  name={`redirectUris.${index}`}
                                  fullWidth
                                  size="small"
                                  placeholder="https://example.com/callback"
                                  error={Boolean(
                                    (formik.touched.redirectUris as boolean[] | undefined)?.[
                                      index
                                    ] &&
                                      Array.isArray(formik.errors.redirectUris) &&
                                      formik.errors.redirectUris[index],
                                  )}
                                  helperText={
                                    (formik.touched.redirectUris as boolean[] | undefined)?.[
                                      index
                                    ] &&
                                    Array.isArray(formik.errors.redirectUris) &&
                                    formik.errors.redirectUris[index]
                                  }
                                  sx={fieldStyle}
                                  InputProps={{
                                    endAdornment: uri && (
                                      <InputAdornment position="end">
                                        <Tooltip title={t('actions.copy')}>
                                          <IconButton
                                            onClick={() => handleCopyToClipboard(uri)}
                                            edge="end"
                                            size="small"
                                          >
                                            <ContentCopy fontSize="small" />
                                          </IconButton>
                                        </Tooltip>
                                      </InputAdornment>
                                    ),
                                  }}
                                />
                                {formik.values.redirectUris.length > 1 && (
                                  <IconButton
                                    onClick={() => remove(index)}
                                    size="small"
                                    color="error"
                                  >
                                    <DeleteIcon />
                                  </IconButton>
                                )}
                              </Box>
                            ))}
                            <Button
                              size="small"
                              startIcon={<AddIcon />}
                              onClick={() => push('')}
                              sx={{ color: themeColors?.background }}
                            >
                              {t('actions.add_uri')}
                            </Button>
                          </Box>
                        )}
                      </FieldArray>
                    </Box>

                    <Box>
                      <Typography sx={fieldLabelStyle}>{t('fields.logout_uris')}</Typography>
                      <FieldArray name="postLogoutRedirectUris">
                        {({ push, remove }) => (
                          <Box>
                            {formik.values.postLogoutRedirectUris.map((uri, index) => (
                              <Box key={index} sx={{ display: 'flex', gap: 1, mb: 1 }}>
                                <Field
                                  as={TextField}
                                  name={`postLogoutRedirectUris.${index}`}
                                  fullWidth
                                  size="small"
                                  placeholder="https://example.com/logout"
                                  error={Boolean(
                                    (
                                      formik.touched.postLogoutRedirectUris as boolean[] | undefined
                                    )?.[index] &&
                                      Array.isArray(formik.errors.postLogoutRedirectUris) &&
                                      formik.errors.postLogoutRedirectUris[index],
                                  )}
                                  helperText={
                                    (
                                      formik.touched.postLogoutRedirectUris as boolean[] | undefined
                                    )?.[index] &&
                                    Array.isArray(formik.errors.postLogoutRedirectUris) &&
                                    formik.errors.postLogoutRedirectUris[index]
                                  }
                                  sx={fieldStyle}
                                  InputProps={{
                                    endAdornment: uri && (
                                      <InputAdornment position="end">
                                        <Tooltip title={t('actions.copy')}>
                                          <IconButton
                                            onClick={() => handleCopyToClipboard(uri)}
                                            edge="end"
                                            size="small"
                                          >
                                            <ContentCopy fontSize="small" />
                                          </IconButton>
                                        </Tooltip>
                                      </InputAdornment>
                                    ),
                                  }}
                                />
                                {formik.values.postLogoutRedirectUris.length > 1 && (
                                  <IconButton
                                    onClick={() => remove(index)}
                                    size="small"
                                    color="error"
                                  >
                                    <DeleteIcon />
                                  </IconButton>
                                )}
                              </Box>
                            ))}
                            <Button
                              size="small"
                              startIcon={<AddIcon />}
                              onClick={() => push('')}
                              sx={{ color: themeColors?.background }}
                            >
                              {t('actions.add_uri')}
                            </Button>
                          </Box>
                        )}
                      </FieldArray>
                    </Box>
                  </Paper>
                </Grid>
              </Grid>

              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                {onCancel && (
                  <Button
                    variant="outlined"
                    onClick={onCancel}
                    sx={{
                      'borderColor': themeColors?.background,
                      'color': themeColors?.background,
                      'px': 4,
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
                  sx={{
                    'backgroundColor': themeColors?.background,
                    'color': 'white',
                    'px': 4,
                    '&:hover': {
                      backgroundColor: themeColors?.background,
                      opacity: 0.9,
                    },
                  }}
                >
                  {t('actions.save')}
                </Button>
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
        operations={
          formValues
            ? Object.entries(formValues)
                .filter(
                  ([, value]) =>
                    value !== undefined &&
                    value !== '' &&
                    (!Array.isArray(value) || value.length > 0),
                )
                .map(([key, value]) => ({ path: key, value }))
            : []
        }
      />
    </Card>
  )
}

export default ClientAddForm
