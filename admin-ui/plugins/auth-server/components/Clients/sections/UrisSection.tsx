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

const UrisSection: React.FC<SectionProps> = ({ formik, viewOnly = false, setModifiedFields }) => {
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

  const chipStyle = useMemo(
    () => ({
      'm': 0.5,
      'backgroundColor': themeColors?.background,
      'color': 'white',
      '& .MuiChip-deleteIcon': {
        color: 'rgba(255, 255, 255, 0.7)',
      },
    }),
    [themeColors],
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

  const renderUriList = useCallback(
    (label: string, fieldName: string, value: string[] | undefined, isReadOnly = viewOnly) => {
      if (isReadOnly) {
        return (
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {label}
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {(value || []).map((uri, index) => (
                <Chip key={index} label={uri} sx={chipStyle} size="small" />
              ))}
              {(!value || value.length === 0) && (
                <Typography color="text.secondary" variant="body2">
                  -
                </Typography>
              )}
            </Box>
          </Box>
        )
      }

      return (
        <Autocomplete
          multiple
          freeSolo
          options={[]}
          value={value || []}
          onChange={(_, newValue) => handleFieldChange(fieldName, label, newValue)}
          renderInput={(params) => (
            <TextField {...params} size="small" label={label} sx={fieldStyle} />
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
      )
    },
    [viewOnly, handleFieldChange, fieldStyle, chipStyle],
  )

  return (
    <Box>
      <Box sx={sectionStyle}>
        <Typography sx={sectionTitleStyle}>{t('titles.redirect_uris')}</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            {renderUriList(t('fields.redirect_uris'), 'redirectUris', formik.values.redirectUris)}
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              size="small"
              label={t('fields.redirect_uris_regex')}
              name="attributes.redirectUrisRegex"
              value={formik.values.attributes?.redirectUrisRegex || ''}
              onChange={(e) =>
                handleAttributeChange(
                  'redirectUrisRegex',
                  t('fields.redirect_uris_regex'),
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
              label={t('fields.sector_identifier_uri')}
              name="sectorIdentifierUri"
              value={formik.values.sectorIdentifierUri || ''}
              onChange={(e) =>
                handleFieldChange(
                  'sectorIdentifierUri',
                  t('fields.sector_identifier_uri'),
                  e.target.value,
                )
              }
              disabled={viewOnly}
              sx={fieldStyle}
            />
          </Grid>
        </Grid>
      </Box>

      <Box sx={sectionStyle}>
        <Typography sx={sectionTitleStyle}>{t('titles.logout_uris')}</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            {renderUriList(
              t('fields.post_logout_redirect_uris'),
              'postLogoutRedirectUris',
              formik.values.postLogoutRedirectUris,
            )}
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              size="small"
              label={t('fields.front_channel_logout_uri')}
              name="frontChannelLogoutUri"
              value={formik.values.frontChannelLogoutUri || ''}
              onChange={(e) =>
                handleFieldChange(
                  'frontChannelLogoutUri',
                  t('fields.front_channel_logout_uri'),
                  e.target.value,
                )
              }
              disabled={viewOnly}
              sx={fieldStyle}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={formik.values.frontChannelLogoutSessionRequired || false}
                  onChange={(e) =>
                    handleFieldChange(
                      'frontChannelLogoutSessionRequired',
                      t('fields.front_channel_logout_session_required'),
                      e.target.checked,
                    )
                  }
                  disabled={viewOnly}
                  sx={switchStyle}
                />
              }
              label={t('fields.front_channel_logout_session_required')}
            />
          </Grid>

          <Grid item xs={12}>
            {renderUriList(
              t('fields.backchannel_logout_uris'),
              'attributes.backchannelLogoutUri',
              formik.values.attributes?.backchannelLogoutUri,
            )}
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={formik.values.attributes?.backchannelLogoutSessionRequired || false}
                  onChange={(e) =>
                    handleAttributeChange(
                      'backchannelLogoutSessionRequired',
                      t('fields.backchannel_logout_session_required'),
                      e.target.checked,
                    )
                  }
                  disabled={viewOnly}
                  sx={switchStyle}
                />
              }
              label={t('fields.backchannel_logout_session_required')}
            />
          </Grid>
        </Grid>
      </Box>

      <Box sx={sectionStyle}>
        <Typography sx={sectionTitleStyle}>{t('titles.other_uris')}</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              size="small"
              label={t('fields.initiate_login_uri')}
              name="initiateLoginUri"
              value={formik.values.initiateLoginUri || ''}
              onChange={(e) =>
                handleFieldChange(
                  'initiateLoginUri',
                  t('fields.initiate_login_uri'),
                  e.target.value,
                )
              }
              disabled={viewOnly}
              sx={fieldStyle}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              size="small"
              label={t('fields.client_uri')}
              name="clientUri"
              value={formik.values.clientUri || ''}
              onChange={(e) =>
                handleFieldChange('clientUri', t('fields.client_uri'), e.target.value)
              }
              disabled={viewOnly}
              sx={fieldStyle}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              size="small"
              label={t('fields.logo_uri')}
              name="logoUri"
              value={formik.values.logoUri || ''}
              onChange={(e) => handleFieldChange('logoUri', t('fields.logo_uri'), e.target.value)}
              disabled={viewOnly}
              sx={fieldStyle}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              size="small"
              label={t('fields.policy_uri')}
              name="policyUri"
              value={formik.values.policyUri || ''}
              onChange={(e) =>
                handleFieldChange('policyUri', t('fields.policy_uri'), e.target.value)
              }
              disabled={viewOnly}
              sx={fieldStyle}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              size="small"
              label={t('fields.tos_uri')}
              name="tosUri"
              value={formik.values.tosUri || ''}
              onChange={(e) => handleFieldChange('tosUri', t('fields.tos_uri'), e.target.value)}
              disabled={viewOnly}
              sx={fieldStyle}
            />
          </Grid>

          <Grid item xs={12}>
            {renderUriList(t('fields.request_uris'), 'requestUris', formik.values.requestUris)}
          </Grid>

          <Grid item xs={12}>
            {renderUriList(
              t('fields.authorized_origins'),
              'authorizedOrigins',
              formik.values.authorizedOrigins,
            )}
          </Grid>

          <Grid item xs={12}>
            {renderUriList(
              t('fields.claim_redirect_uris'),
              'claimRedirectUris',
              formik.values.claimRedirectUris,
            )}
          </Grid>
        </Grid>
      </Box>

      <Box sx={sectionStyle}>
        <Typography sx={sectionTitleStyle}>{t('titles.software_info')}</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              size="small"
              label={t('fields.software_id')}
              name="softwareId"
              value={formik.values.softwareId || ''}
              onChange={(e) =>
                handleFieldChange('softwareId', t('fields.software_id'), e.target.value)
              }
              disabled={viewOnly}
              sx={fieldStyle}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              size="small"
              label={t('fields.software_version')}
              name="softwareVersion"
              value={formik.values.softwareVersion || ''}
              onChange={(e) =>
                handleFieldChange('softwareVersion', t('fields.software_version'), e.target.value)
              }
              disabled={viewOnly}
              sx={fieldStyle}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              size="small"
              label={t('fields.software_statement')}
              name="softwareStatement"
              value={formik.values.softwareStatement || ''}
              onChange={(e) =>
                handleFieldChange(
                  'softwareStatement',
                  t('fields.software_statement'),
                  e.target.value,
                )
              }
              disabled={viewOnly}
              multiline
              rows={3}
              sx={fieldStyle}
            />
          </Grid>
        </Grid>
      </Box>
    </Box>
  )
}

export default UrisSection
