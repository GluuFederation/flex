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
import type { AdvancedTabProps } from '../types'
import { BACKCHANNEL_TOKEN_DELIVERY_MODES, SCRIPT_TYPES } from '../helper/constants'
import { filterScriptsByType, getScriptNameFromDn } from '../helper/utils'

const AdvancedTab: React.FC<AdvancedTabProps> = ({
  formik,
  viewOnly = false,
  modifiedFields,
  setModifiedFields,
  scripts = [],
  isEdit = false,
}) => {
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
        backgroundColor: viewOnly ? themeColors?.lightBackground : 'white',
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

  const postAuthnScripts = useMemo(
    () => filterScriptsByType(scripts, SCRIPT_TYPES.POST_AUTHN),
    [scripts],
  )

  const spontaneousScopeScripts = useMemo(
    () => filterScriptsByType(scripts, SCRIPT_TYPES.SPONTANEOUS_SCOPE),
    [scripts],
  )

  const consentScripts = useMemo(
    () => filterScriptsByType(scripts, SCRIPT_TYPES.CONSENT_GATHERING),
    [scripts],
  )

  const introspectionScripts = useMemo(
    () => filterScriptsByType(scripts, SCRIPT_TYPES.INTROSPECTION),
    [scripts],
  )

  const ropcScripts = useMemo(
    () => filterScriptsByType(scripts, SCRIPT_TYPES.RESOURCE_OWNER_PASSWORD_CREDENTIALS),
    [scripts],
  )

  const updateTokenScripts = useMemo(
    () => filterScriptsByType(scripts, SCRIPT_TYPES.UPDATE_TOKEN),
    [scripts],
  )

  const rptClaimsScripts = useMemo(
    () => filterScriptsByType(scripts, SCRIPT_TYPES.UMA_RPT_CLAIMS),
    [scripts],
  )

  const renderScriptSelector = useCallback(
    (
      label: string,
      attrName: string,
      availableScripts: Array<{ dn: string; name: string }>,
      currentValue: string[] | undefined,
    ) => (
      <Autocomplete
        multiple
        options={availableScripts}
        getOptionLabel={(option) => option.name}
        value={availableScripts.filter((s) => (currentValue || []).includes(s.dn))}
        onChange={(_, newValue) => {
          const dnValues = newValue.map((v) => v.dn)
          handleAttributeChange(attrName, label, dnValues)
        }}
        disabled={viewOnly}
        isOptionEqualToValue={(option, value) => option.dn === value.dn}
        renderInput={(params) => (
          <TextField {...params} size="small" label={label} sx={fieldStyle} />
        )}
        renderTags={(value, getTagProps) =>
          value.map((option, index) => (
            <Chip {...getTagProps({ index })} key={option.dn} label={option.name} size="small" />
          ))
        }
      />
    ),
    [handleAttributeChange, viewOnly, fieldStyle],
  )

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={sectionStyle}>
        <Typography sx={sectionTitleStyle}>{t('titles.token_settings')}</Typography>
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
        </Grid>
      </Box>

      <Box sx={sectionStyle}>
        <Typography sx={sectionTitleStyle}>{t('titles.ciba')}</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              select
              size="small"
              label={t('fields.backchannel_token_delivery_mode')}
              name="backchannelTokenDeliveryMode"
              value={formik.values.backchannelTokenDeliveryMode || ''}
              onChange={(e) =>
                handleFieldChange(
                  'backchannelTokenDeliveryMode',
                  t('fields.backchannel_token_delivery_mode'),
                  e.target.value,
                )
              }
              disabled={viewOnly}
              sx={fieldStyle}
              SelectProps={{ native: true }}
            >
              <option value="">{t('actions.choose')}...</option>
              {BACKCHANNEL_TOKEN_DELIVERY_MODES.map((mode) => (
                <option key={mode.value} value={mode.value}>
                  {mode.label}
                </option>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              size="small"
              label={t('fields.backchannel_client_notification_endpoint')}
              name="backchannelClientNotificationEndpoint"
              value={formik.values.backchannelClientNotificationEndpoint || ''}
              onChange={(e) =>
                handleFieldChange(
                  'backchannelClientNotificationEndpoint',
                  t('fields.backchannel_client_notification_endpoint'),
                  e.target.value,
                )
              }
              disabled={viewOnly}
              sx={fieldStyle}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <FormControlLabel
              control={
                <Switch
                  checked={formik.values.backchannelUserCodeParameter || false}
                  onChange={(e) =>
                    handleFieldChange(
                      'backchannelUserCodeParameter',
                      t('fields.backchannel_user_code_parameter'),
                      e.target.checked,
                    )
                  }
                  disabled={viewOnly}
                  sx={switchStyle}
                />
              }
              label={t('fields.backchannel_user_code_parameter')}
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
        <Typography sx={sectionTitleStyle}>{t('titles.uma')}</Typography>
        <Grid container spacing={2}>
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

          <Grid item xs={12}>
            {renderScriptSelector(
              t('fields.rpt_claims_scripts'),
              'rptClaimsScripts',
              rptClaimsScripts,
              formik.values.attributes?.rptClaimsScripts,
            )}
          </Grid>
        </Grid>
      </Box>

      <Box sx={sectionStyle}>
        <Typography sx={sectionTitleStyle}>{t('titles.client_scripts')}</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            {renderScriptSelector(
              t('fields.post_authn_scripts'),
              'postAuthnScripts',
              postAuthnScripts,
              formik.values.attributes?.postAuthnScripts,
            )}
          </Grid>

          <Grid item xs={12} md={6}>
            {renderScriptSelector(
              t('fields.spontaneous_scope_scripts'),
              'spontaneousScopeScriptDns',
              spontaneousScopeScripts,
              formik.values.attributes?.spontaneousScopeScriptDns,
            )}
          </Grid>

          <Grid item xs={12} md={6}>
            {renderScriptSelector(
              t('fields.consent_gathering_scripts'),
              'consentGatheringScripts',
              consentScripts,
              formik.values.attributes?.consentGatheringScripts,
            )}
          </Grid>

          <Grid item xs={12} md={6}>
            {renderScriptSelector(
              t('fields.introspection_scripts'),
              'introspectionScripts',
              introspectionScripts,
              formik.values.attributes?.introspectionScripts,
            )}
          </Grid>

          <Grid item xs={12} md={6}>
            {renderScriptSelector(
              t('fields.ropc_scripts'),
              'ropcScripts',
              ropcScripts,
              formik.values.attributes?.ropcScripts,
            )}
          </Grid>

          <Grid item xs={12} md={6}>
            {renderScriptSelector(
              t('fields.update_token_scripts'),
              'updateTokenScriptDns',
              updateTokenScripts,
              formik.values.attributes?.updateTokenScriptDns,
            )}
          </Grid>
        </Grid>
      </Box>

      <Box sx={sectionStyle}>
        <Typography sx={sectionTitleStyle}>{t('titles.other_advanced')}</Typography>
        <Grid container spacing={2}>
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
                  checked={formik.values.attributes?.allowSpontaneousScopes || false}
                  onChange={(e) =>
                    handleAttributeChange(
                      'allowSpontaneousScopes',
                      t('fields.allow_spontaneous_scopes'),
                      e.target.checked,
                    )
                  }
                  disabled={viewOnly}
                  sx={switchStyle}
                />
              }
              label={t('fields.allow_spontaneous_scopes')}
            />
          </Grid>

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

          <Grid item xs={12}>
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
                  <Chip {...getTagProps({ index })} key={index} label={option} size="small" />
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
                  <Chip {...getTagProps({ index })} key={index} label={option} size="small" />
                ))
              }
            />
          </Grid>

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
                  <Chip {...getTagProps({ index })} key={index} label={option} size="small" />
                ))
              }
            />
          </Grid>
        </Grid>
      </Box>
    </Box>
  )
}

export default AdvancedTab
