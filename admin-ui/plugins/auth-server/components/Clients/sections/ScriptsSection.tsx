import React, { useCallback, useContext, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Alert,
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
import { SCRIPT_TYPES } from '../helper/constants'
import { filterScriptsByType } from '../helper/utils'

const ScriptsSection: React.FC<SectionProps> = ({
  formik,
  viewOnly = false,
  setModifiedFields,
  scripts = [],
  scriptsTruncated = false,
}) => {
  const { t } = useTranslation()
  const theme = useContext(ThemeContext)
  const selectedTheme = theme?.state?.theme || 'darkBlue'
  const themeColors = useMemo(() => getThemeColor(selectedTheme), [selectedTheme])

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
      ...(selectedTheme === 'darkBlack' && {
        '& .MuiInputBase-input': {
          color: `${themeColors?.backgroundBlack} !important`,
        },
        '& .MuiInputBase-input.Mui-disabled': {
          WebkitTextFillColor: `${themeColors?.backgroundBlack} !important`,
        },
        '& label': {
          color: `${themeColors?.backgroundBlack} !important`,
        },
      }),
      '& .MuiInputLabel-root.Mui-focused': {
        color: themeColors?.background,
      },
    }),
    [viewOnly, themeColors, selectedTheme],
  )

  const sectionStyle = useMemo(
    () => ({
      mb: 3,
      p: 2,
      borderRadius: 1,
      border: `1px solid ${themeColors?.lightBackground || '#e0e0e0'}`,
    }),
    [themeColors],
  )

  const sectionTitleStyle = useMemo(
    () => ({
      mb: 2,
      fontWeight: selectedTheme === 'darkBlack' ? 700 : 600,
      color:
        selectedTheme === 'darkBlack'
          ? `${themeColors?.backgroundBlack} !important`
          : themeColors?.fontColor || '#333',
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
  const tokenExchangeScripts = useMemo(
    () => filterScriptsByType(scripts, SCRIPT_TYPES.TOKEN_EXCHANGE),
    [scripts],
  )
  const parScripts = useMemo(() => filterScriptsByType(scripts, SCRIPT_TYPES.PAR), [scripts])
  const logoutStatusJwtScripts = useMemo(
    () => filterScriptsByType(scripts, SCRIPT_TYPES.LOGOUT_STATUS_JWT),
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
            <Chip
              {...getTagProps({ index })}
              key={option.dn}
              label={option.name}
              size="small"
              sx={chipStyle}
            />
          ))
        }
      />
    ),
    [handleAttributeChange, viewOnly, fieldStyle, chipStyle],
  )

  return (
    <Box>
      {scriptsTruncated && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          {t('messages.scripts_truncated_warning')}
        </Alert>
      )}
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

          <Grid item xs={12} md={6}>
            {renderScriptSelector(
              t('fields.token_exchange_scripts'),
              'tokenExchangeScripts',
              tokenExchangeScripts,
              formik.values.attributes?.tokenExchangeScripts,
            )}
          </Grid>

          <Grid item xs={12} md={6}>
            {renderScriptSelector(
              t('fields.par_scripts'),
              'parScriptDns',
              parScripts,
              formik.values.attributes?.parScriptDns,
            )}
          </Grid>

          <Grid item xs={12} md={6}>
            {renderScriptSelector(
              t('fields.logout_status_jwt_scripts'),
              'logoutStatusJwtScriptDns',
              logoutStatusJwtScripts,
              formik.values.attributes?.logoutStatusJwtScriptDns,
            )}
          </Grid>

          <Grid item xs={12} md={6}>
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
        <Typography sx={sectionTitleStyle}>{t('titles.spontaneous_scopes')}</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
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

          <Grid item xs={12}>
            <Autocomplete
              multiple
              freeSolo
              options={[]}
              value={formik.values.attributes?.spontaneousScopes || []}
              onChange={(_, newValue) =>
                handleAttributeChange('spontaneousScopes', t('fields.spontaneous_scopes'), newValue)
              }
              disabled={viewOnly}
              renderInput={(params) => (
                <TextField
                  {...params}
                  size="small"
                  label={t('fields.spontaneous_scopes')}
                  sx={fieldStyle}
                />
              )}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    {...getTagProps({ index })}
                    key={option}
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

export default ScriptsSection
