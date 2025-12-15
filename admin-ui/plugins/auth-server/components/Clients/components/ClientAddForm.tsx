import React, { useCallback, useContext, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Formik, Form, Field, FieldArray } from 'formik'
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
import { GRANT_TYPES } from '../helper/constants'
import { useClientScopes } from '../hooks'
import { buildAddFormPayload, buildClientPayload, generateClientSecret } from '../helper/utils'
import { clientAddValidationSchema } from '../helper/validations'
import type { AddFormValues, ClientFormValues, ClientScope, ModifiedFields } from '../types'

interface ClientAddFormProps {
  onSubmit: (values: ClientFormValues, message: string, modifiedFields: ModifiedFields) => void
  onCancel?: () => void
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

const ClientAddForm: React.FC<ClientAddFormProps> = ({ onSubmit, onCancel }) => {
  const { t } = useTranslation()
  const theme = useContext(ThemeContext)
  const selectedTheme = theme?.state?.theme || 'darkBlue'
  const themeColors = useMemo(() => getThemeColor(selectedTheme), [selectedTheme])

  const [showSecret, setShowSecret] = useState(false)
  const [commitModalOpen, setCommitModalOpen] = useState(false)
  const [formValues, setFormValues] = useState<AddFormValues | null>(null)

  const { scopes, scopesLoading, handleScopeSearch } = useClientScopes()

  const handleToggleSecret = useCallback(() => {
    setShowSecret((prev) => !prev)
  }, [])

  const handleCopyToClipboard = useCallback((text: string) => {
    navigator.clipboard.writeText(text).catch(() => {
      // Clipboard API may fail in non-secure contexts or due to permissions
    })
  }, [])

  const handleFormSubmit = useCallback((values: AddFormValues) => {
    setFormValues(values)
    setCommitModalOpen(true)
  }, [])

  const fieldLabelMap = useMemo(
    () => ({
      clientName: t('fields.client_name'),
      clientSecret: t('fields.client_secret'),
      disabled: t('fields.status'),
      description: t('fields.description'),
      scopes: t('fields.scopes'),
      grantTypes: t('fields.grant_types'),
      redirectUris: t('fields.redirect_uris'),
      postLogoutRedirectUris: t('fields.post_logout_redirect_uris'),
    }),
    [t],
  )

  const handleCommitAccept = useCallback(
    (message: string) => {
      if (formValues) {
        const fullPayload = buildAddFormPayload(formValues)
        const payload = buildClientPayload(fullPayload) as ClientFormValues
        const modifiedFields: ModifiedFields = {}
        Object.entries(formValues).forEach(([key, value]) => {
          if (value !== undefined && value !== '' && (!Array.isArray(value) || value.length > 0)) {
            const label = fieldLabelMap[key as keyof typeof fieldLabelMap] || key
            modifiedFields[label] = value
          }
        })
        onSubmit(payload, message, modifiedFields)
      }
      setCommitModalOpen(false)
    },
    [formValues, onSubmit, fieldLabelMap],
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
          validationSchema={clientAddValidationSchema}
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
                              try {
                                const newSecret = generateClientSecret()
                                formik.setFieldValue('clientSecret', newSecret)
                                setShowSecret(true)
                              } catch {
                                // Error generating secret - crypto API unavailable
                                // User should ensure HTTPS context
                              }
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
                        onInputChange={(_, value) => handleScopeSearch(value)}
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
