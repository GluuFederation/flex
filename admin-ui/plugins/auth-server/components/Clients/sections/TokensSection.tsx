import React, { useCallback, useContext, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Box,
  Grid,
  TextField,
  Typography,
  Switch,
  FormControlLabel,
  Chip,
  Autocomplete,
} from '@mui/material'
import { ThemeContext } from 'Context/theme/themeContext'
import getThemeColor from 'Context/theme/config'
import type { SectionProps } from '../types'
import { TOKEN_ENDPOINT_AUTH_METHODS } from '../helper/constants'

const TokensSection: React.FC<SectionProps> = ({ formik, viewOnly = false, setModifiedFields }) => {
  const { t } = useTranslation()
  const theme = useContext(ThemeContext)
  const selectedTheme = theme?.state?.theme || 'darkBlue'
  const themeColors = useMemo(() => getThemeColor(selectedTheme), [selectedTheme])

  const handleFieldChange = useCallback(
    (fieldName: string, fieldLabel: string, value: unknown) => {
      formik.setFieldValue(fieldName, value)
      setModifiedFields((prev) => ({
        ...prev,
        [fieldLabel]: value,
      }))
    },
    [formik, setModifiedFields],
  )

  const handleAttributeChange = useCallback(
    (attrName: string, fieldLabel: string, value: unknown) => {
      formik.setFieldValue(`attributes.${attrName}`, value)
      setModifiedFields((prev) => ({
        ...prev,
        [fieldLabel]: value,
      }))
    },
    [formik, setModifiedFields],
  )

  const fieldStyle = useMemo(
    () => ({
      '& .MuiOutlinedInput-root': {
        'backgroundColor': viewOnly ? themeColors?.lightBackground : 'white',
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
          borderColor: themeColors?.background,
        },
      },
      '& .MuiInputLabel-root.Mui-focused': {
        color: themeColors?.background,
      },
    }),
    [viewOnly, themeColors],
  )

  const sectionStyle = useMemo(
    () => ({
      mb: 3,
      p: 2,
      borderRadius: 1,
      border: `1px solid ${themeColors?.lightBackground || '#e0e0e0'}`,
      backgroundColor: themeColors?.lightBackground || '#fafafa',
    }),
    [themeColors],
  )

  const sectionTitleStyle = useMemo(
    () => ({
      mb: 2,
      fontWeight: selectedTheme === 'darkBlack' ? 700 : 600,
      color: selectedTheme === 'darkBlack' ? '#000000' : themeColors?.fontColor || '#333',
      fontSize: '0.95rem',
    }),
    [themeColors, selectedTheme],
  )

  const switchStyle = useMemo(
    () => ({
      '& .MuiSwitch-switchBase.Mui-checked': {
        color: themeColors?.background,
      },
      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
        backgroundColor: themeColors?.background,
      },
    }),
    [themeColors],
  )

  const chipStyle = useMemo(
    () => ({
      backgroundColor: themeColors?.background,
      color: 'white',
    }),
    [themeColors],
  )

  return (
    <Box>
      <Box sx={sectionStyle}>
        <Typography sx={sectionTitleStyle}>{t('titles.token_lifetimes')}</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              size="small"
              type="number"
              label={t('fields.access_token_lifetime')}
              name="accessTokenLifetime"
              value={formik.values.accessTokenLifetime || ''}
              onChange={(e) =>
                handleFieldChange(
                  'accessTokenLifetime',
                  t('fields.access_token_lifetime'),
                  e.target.value ? parseInt(e.target.value) : null,
                )
              }
              disabled={viewOnly}
              sx={fieldStyle}
              InputProps={{ inputProps: { min: 0 } }}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              size="small"
              type="number"
              label={t('fields.refresh_token_lifetime')}
              name="refreshTokenLifetime"
              value={formik.values.refreshTokenLifetime || ''}
              onChange={(e) =>
                handleFieldChange(
                  'refreshTokenLifetime',
                  t('fields.refresh_token_lifetime'),
                  e.target.value ? parseInt(e.target.value) : null,
                )
              }
              disabled={viewOnly}
              sx={fieldStyle}
              InputProps={{ inputProps: { min: 0 } }}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              size="small"
              type="number"
              label={t('fields.default_max_age')}
              name="defaultMaxAge"
              value={formik.values.defaultMaxAge || ''}
              onChange={(e) =>
                handleFieldChange(
                  'defaultMaxAge',
                  t('fields.default_max_age'),
                  e.target.value ? parseInt(e.target.value) : null,
                )
              }
              disabled={viewOnly}
              sx={fieldStyle}
              InputProps={{ inputProps: { min: 0 } }}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              size="small"
              type="number"
              label={t('fields.id_token_lifetime')}
              name="attributes.idTokenLifetime"
              value={formik.values.attributes?.idTokenLifetime || ''}
              onChange={(e) =>
                handleAttributeChange(
                  'idTokenLifetime',
                  t('fields.id_token_lifetime'),
                  e.target.value ? parseInt(e.target.value) : null,
                )
              }
              disabled={viewOnly}
              sx={fieldStyle}
              InputProps={{ inputProps: { min: 0 } }}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              size="small"
              type="number"
              label={t('fields.tx_token_lifetime')}
              name="attributes.txTokenLifetime"
              value={formik.values.attributes?.txTokenLifetime || ''}
              onChange={(e) =>
                handleAttributeChange(
                  'txTokenLifetime',
                  t('fields.tx_token_lifetime'),
                  e.target.value ? parseInt(e.target.value) : null,
                )
              }
              disabled={viewOnly}
              sx={fieldStyle}
              InputProps={{ inputProps: { min: 0 } }}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              size="small"
              type="number"
              label={t('fields.requested_lifetime')}
              name="attributes.requestedLifetime"
              value={formik.values.attributes?.requestedLifetime || ''}
              onChange={(e) =>
                handleAttributeChange(
                  'requestedLifetime',
                  t('fields.requested_lifetime'),
                  e.target.value ? parseInt(e.target.value) : null,
                )
              }
              disabled={viewOnly}
              sx={fieldStyle}
              InputProps={{ inputProps: { min: 0 } }}
            />
          </Grid>
        </Grid>
      </Box>

      <Box sx={sectionStyle}>
        <Typography sx={sectionTitleStyle}>{t('titles.token_options')}</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <FormControlLabel
              control={
                <Switch
                  checked={Boolean(formik.values.accessTokenAsJwt)}
                  onChange={(e) =>
                    handleFieldChange(
                      'accessTokenAsJwt',
                      t('fields.access_token_as_jwt'),
                      e.target.checked,
                    )
                  }
                  disabled={viewOnly}
                  sx={switchStyle}
                />
              }
              label={t('fields.access_token_as_jwt')}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <FormControlLabel
              control={
                <Switch
                  checked={Boolean(formik.values.rptAsJwt)}
                  onChange={(e) =>
                    handleFieldChange('rptAsJwt', t('fields.rpt_as_jwt'), e.target.checked)
                  }
                  disabled={viewOnly}
                  sx={switchStyle}
                />
              }
              label={t('fields.rpt_as_jwt')}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <FormControlLabel
              control={
                <Switch
                  checked={formik.values.includeClaimsInIdToken || false}
                  onChange={(e) =>
                    handleFieldChange(
                      'includeClaimsInIdToken',
                      t('fields.include_claims_in_id_token'),
                      e.target.checked,
                    )
                  }
                  disabled={viewOnly}
                  sx={switchStyle}
                />
              }
              label={t('fields.include_claims_in_id_token')}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <FormControlLabel
              control={
                <Switch
                  checked={formik.values.persistClientAuthorizations || false}
                  onChange={(e) =>
                    handleFieldChange(
                      'persistClientAuthorizations',
                      t('fields.persist_client_authorizations'),
                      e.target.checked,
                    )
                  }
                  disabled={viewOnly}
                  sx={switchStyle}
                />
              }
              label={t('fields.persist_client_authorizations')}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <FormControlLabel
              control={
                <Switch
                  checked={
                    formik.values.attributes?.runIntrospectionScriptBeforeJwtCreation || false
                  }
                  onChange={(e) =>
                    handleAttributeChange(
                      'runIntrospectionScriptBeforeJwtCreation',
                      t('fields.run_introspection_script_before_jwt_creation'),
                      e.target.checked,
                    )
                  }
                  disabled={viewOnly}
                  sx={switchStyle}
                />
              }
              label={t('fields.run_introspection_script_before_jwt_creation')}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <FormControlLabel
              control={
                <Switch
                  checked={
                    formik.values.attributes?.keepClientAuthorizationAfterExpiration || false
                  }
                  onChange={(e) =>
                    handleAttributeChange(
                      'keepClientAuthorizationAfterExpiration',
                      t('fields.keep_client_authorization_after_expiration'),
                      e.target.checked,
                    )
                  }
                  disabled={viewOnly}
                  sx={switchStyle}
                />
              }
              label={t('fields.keep_client_authorization_after_expiration')}
            />
          </Grid>
        </Grid>
      </Box>

      <Box sx={sectionStyle}>
        <Typography sx={sectionTitleStyle}>{t('titles.par')}</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              size="small"
              type="number"
              label={t('fields.par_lifetime')}
              name="attributes.parLifetime"
              value={formik.values.attributes?.parLifetime || ''}
              onChange={(e) =>
                handleAttributeChange(
                  'parLifetime',
                  t('fields.par_lifetime'),
                  e.target.value ? parseInt(e.target.value) : null,
                )
              }
              disabled={viewOnly}
              sx={fieldStyle}
              InputProps={{ inputProps: { min: 0 } }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={formik.values.attributes?.requirePar || false}
                  onChange={(e) =>
                    handleAttributeChange('requirePar', t('fields.require_par'), e.target.checked)
                  }
                  disabled={viewOnly}
                  sx={switchStyle}
                />
              }
              label={t('fields.require_par')}
            />
          </Grid>
        </Grid>
      </Box>

      <Box sx={sectionStyle}>
        <Typography sx={sectionTitleStyle}>{t('titles.security')}</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <FormControlLabel
              control={
                <Switch
                  checked={formik.values.attributes?.requirePkce || false}
                  onChange={(e) =>
                    handleAttributeChange('requirePkce', t('fields.require_pkce'), e.target.checked)
                  }
                  disabled={viewOnly}
                  sx={switchStyle}
                />
              }
              label={t('fields.require_pkce')}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <FormControlLabel
              control={
                <Switch
                  checked={formik.values.attributes?.dpopBoundAccessToken || false}
                  onChange={(e) =>
                    handleAttributeChange(
                      'dpopBoundAccessToken',
                      t('fields.dpop_bound_access_token'),
                      e.target.checked,
                    )
                  }
                  disabled={viewOnly}
                  sx={switchStyle}
                />
              }
              label={t('fields.dpop_bound_access_token')}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <FormControlLabel
              control={
                <Switch
                  checked={formik.values.attributes?.jansDefaultPromptLogin || false}
                  onChange={(e) =>
                    handleAttributeChange(
                      'jansDefaultPromptLogin',
                      t('fields.default_prompt_login'),
                      e.target.checked,
                    )
                  }
                  disabled={viewOnly}
                  sx={switchStyle}
                />
              }
              label={t('fields.default_prompt_login')}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              size="small"
              label={t('fields.tls_client_auth_subject_dn')}
              name="attributes.tlsClientAuthSubjectDn"
              value={formik.values.attributes?.tlsClientAuthSubjectDn || ''}
              onChange={(e) =>
                handleAttributeChange(
                  'tlsClientAuthSubjectDn',
                  t('fields.tls_client_auth_subject_dn'),
                  e.target.value,
                )
              }
              disabled={viewOnly}
              sx={fieldStyle}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Autocomplete
              multiple
              options={TOKEN_ENDPOINT_AUTH_METHODS.map((m) => m.value)}
              value={formik.values.attributes?.additionalTokenEndpointAuthMethods || []}
              onChange={(_, newValue) =>
                handleAttributeChange(
                  'additionalTokenEndpointAuthMethods',
                  t('fields.additional_token_endpoint_auth_methods'),
                  newValue,
                )
              }
              disabled={viewOnly}
              renderInput={(params) => (
                <TextField
                  {...params}
                  size="small"
                  label={t('fields.additional_token_endpoint_auth_methods')}
                  sx={fieldStyle}
                />
              )}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    {...getTagProps({ index })}
                    key={index}
                    label={option}
                    size="small"
                    sx={chipStyle}
                  />
                ))
              }
            />
          </Grid>
        </Grid>
      </Box>

      <Box sx={sectionStyle}>
        <Typography sx={sectionTitleStyle}>{t('titles.acr_security')}</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              size="small"
              type="number"
              label={t('fields.minimum_acr_level')}
              name="attributes.minimumAcrLevel"
              value={formik.values.attributes?.minimumAcrLevel ?? ''}
              onChange={(e) =>
                handleAttributeChange(
                  'minimumAcrLevel',
                  t('fields.minimum_acr_level'),
                  e.target.value ? parseInt(e.target.value) : null,
                )
              }
              disabled={viewOnly}
              sx={fieldStyle}
              InputProps={{ inputProps: { min: -1 } }}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <FormControlLabel
              control={
                <Switch
                  checked={formik.values.attributes?.minimumAcrLevelAutoresolve || false}
                  onChange={(e) =>
                    handleAttributeChange(
                      'minimumAcrLevelAutoresolve',
                      t('fields.minimum_acr_level_autoresolve'),
                      e.target.checked,
                    )
                  }
                  disabled={viewOnly}
                  sx={switchStyle}
                />
              }
              label={t('fields.minimum_acr_level_autoresolve')}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <FormControlLabel
              control={
                <Switch
                  checked={formik.values.attributes?.allowOfflineAccessWithoutConsent || false}
                  onChange={(e) =>
                    handleAttributeChange(
                      'allowOfflineAccessWithoutConsent',
                      t('fields.allow_offline_access_without_consent'),
                      e.target.checked,
                    )
                  }
                  disabled={viewOnly}
                  sx={switchStyle}
                />
              }
              label={t('fields.allow_offline_access_without_consent')}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Autocomplete
              multiple
              freeSolo
              options={[]}
              value={formik.values.attributes?.minimumAcrPriorityList || []}
              onChange={(_, newValue) =>
                handleAttributeChange(
                  'minimumAcrPriorityList',
                  t('fields.minimum_acr_priority_list'),
                  newValue,
                )
              }
              disabled={viewOnly}
              renderInput={(params) => (
                <TextField
                  {...params}
                  size="small"
                  label={t('fields.minimum_acr_priority_list')}
                  sx={fieldStyle}
                />
              )}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    {...getTagProps({ index })}
                    key={index}
                    label={option}
                    size="small"
                    sx={chipStyle}
                  />
                ))
              }
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Autocomplete
              multiple
              freeSolo
              options={[]}
              value={formik.values.defaultAcrValues || []}
              onChange={(_, newValue) =>
                handleFieldChange('defaultAcrValues', t('fields.default_acr_values'), newValue)
              }
              disabled={viewOnly}
              renderInput={(params) => (
                <TextField
                  {...params}
                  size="small"
                  label={t('fields.default_acr_values')}
                  sx={fieldStyle}
                />
              )}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    {...getTagProps({ index })}
                    key={index}
                    label={option}
                    size="small"
                    sx={chipStyle}
                  />
                ))
              }
            />
          </Grid>

          <Grid item xs={12}>
            <Autocomplete
              multiple
              freeSolo
              options={[]}
              value={formik.values.attributes?.jansAuthorizedAcr || []}
              onChange={(_, newValue) =>
                handleAttributeChange(
                  'jansAuthorizedAcr',
                  t('fields.authorized_acr_values'),
                  newValue,
                )
              }
              disabled={viewOnly}
              renderInput={(params) => (
                <TextField
                  {...params}
                  size="small"
                  label={t('fields.authorized_acr_values')}
                  sx={fieldStyle}
                />
              )}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    {...getTagProps({ index })}
                    key={index}
                    label={option}
                    size="small"
                    sx={chipStyle}
                  />
                ))
              }
            />
          </Grid>
        </Grid>
      </Box>

      <Box sx={sectionStyle}>
        <Typography sx={sectionTitleStyle}>{t('titles.advanced_token')}</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Autocomplete
              multiple
              freeSolo
              options={[]}
              value={formik.values.attributes?.additionalAudience || []}
              onChange={(_, newValue) =>
                handleAttributeChange(
                  'additionalAudience',
                  t('fields.additional_audience'),
                  newValue,
                )
              }
              disabled={viewOnly}
              renderInput={(params) => (
                <TextField
                  {...params}
                  size="small"
                  label={t('fields.additional_audience')}
                  sx={fieldStyle}
                />
              )}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    {...getTagProps({ index })}
                    key={index}
                    label={option}
                    size="small"
                    sx={chipStyle}
                  />
                ))
              }
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              size="small"
              label={t('fields.jans_sub_attr')}
              name="attributes.jansSubAttr"
              value={formik.values.attributes?.jansSubAttr || ''}
              onChange={(e) =>
                handleAttributeChange('jansSubAttr', t('fields.jans_sub_attr'), e.target.value)
              }
              disabled={viewOnly}
              sx={fieldStyle}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              size="small"
              label={t('fields.id_token_token_binding_cnf')}
              name="idTokenTokenBindingCnf"
              value={formik.values.idTokenTokenBindingCnf || ''}
              onChange={(e) =>
                handleFieldChange(
                  'idTokenTokenBindingCnf',
                  t('fields.id_token_token_binding_cnf'),
                  e.target.value,
                )
              }
              disabled={viewOnly}
              sx={fieldStyle}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              size="small"
              label={t('fields.evidence')}
              name="attributes.evidence"
              value={formik.values.attributes?.evidence || ''}
              onChange={(e) =>
                handleAttributeChange('evidence', t('fields.evidence'), e.target.value)
              }
              disabled={viewOnly}
              multiline
              rows={2}
              sx={fieldStyle}
            />
          </Grid>

          <Grid item xs={12}>
            <Autocomplete
              multiple
              freeSolo
              options={[]}
              value={formik.values.attributes?.authorizationDetailsTypes || []}
              onChange={(_, newValue) =>
                handleAttributeChange(
                  'authorizationDetailsTypes',
                  t('fields.authorization_details_types'),
                  newValue,
                )
              }
              disabled={viewOnly}
              renderInput={(params) => (
                <TextField
                  {...params}
                  size="small"
                  label={t('fields.authorization_details_types')}
                  sx={fieldStyle}
                />
              )}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    {...getTagProps({ index })}
                    key={index}
                    label={option}
                    size="small"
                    sx={chipStyle}
                  />
                ))
              }
            />
          </Grid>
        </Grid>
      </Box>
    </Box>
  )
}

export default TokensSection
