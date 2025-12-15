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
import { formatDateTime } from '../helper/utils'

const SystemInfoSection: React.FC<SectionProps> = ({
  formik,
  viewOnly = false,
  setModifiedFields,
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

  const fieldStyle = useMemo(
    () => ({
      '& .MuiOutlinedInput-root': {
        backgroundColor: themeColors?.lightBackground || '#f5f5f5',
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
    }),
    [themeColors, selectedTheme],
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

  return (
    <Box>
      <Box sx={sectionStyle}>
        <Typography sx={sectionTitleStyle}>{t('titles.system_information')}</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              size="small"
              label={t('fields.dn')}
              name="dn"
              value={formik.values.dn || ''}
              disabled
              sx={fieldStyle}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              size="small"
              label={t('fields.base_dn')}
              name="baseDn"
              value={formik.values.baseDn || ''}
              disabled
              sx={fieldStyle}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              size="small"
              label={t('fields.client_id_issued_at')}
              name="clientIdIssuedAt"
              value={formatDateTime(formik.values.clientIdIssuedAt, '-')}
              disabled
              sx={fieldStyle}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              size="small"
              label={t('fields.client_secret_expires_at')}
              name="clientSecretExpiresAt"
              value={formatDateTime(formik.values.clientSecretExpiresAt, '-')}
              disabled
              sx={fieldStyle}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              size="small"
              label={t('fields.last_access_time')}
              name="lastAccessTime"
              value={formatDateTime(formik.values.lastAccessTime, '-')}
              disabled
              sx={fieldStyle}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              size="small"
              label={t('fields.last_logon_time')}
              name="lastLogonTime"
              value={formatDateTime(formik.values.lastLogonTime, '-')}
              disabled
              sx={fieldStyle}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              size="small"
              label={t('fields.registration_access_token')}
              name="registrationAccessToken"
              type="password"
              value={formik.values.registrationAccessToken || ''}
              disabled
              sx={fieldStyle}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControlLabel
              control={
                <Switch checked={formik.values.deletable || false} disabled sx={switchStyle} />
              }
              label={t('fields.deletable')}
            />
          </Grid>
        </Grid>
      </Box>

      <Box sx={sectionStyle}>
        <Typography sx={sectionTitleStyle}>{t('titles.organization_settings')}</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              size="small"
              type="number"
              label={t('fields.ttl')}
              name="ttl"
              value={formik.values.ttl || ''}
              onChange={(e) =>
                handleFieldChange(
                  'ttl',
                  t('fields.ttl'),
                  e.target.value ? parseInt(e.target.value, 10) : null,
                )
              }
              disabled={viewOnly}
              sx={{
                '& .MuiOutlinedInput-root': {
                  'backgroundColor': viewOnly ? themeColors?.lightBackground : 'white',
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: themeColors?.background,
                  },
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: themeColors?.background,
                },
              }}
              InputProps={{ inputProps: { min: 0 } }}
            />
          </Grid>

          <Grid item xs={12}>
            <Autocomplete
              multiple
              freeSolo
              options={[]}
              value={formik.values.groups || []}
              onChange={(_, newValue) => handleFieldChange('groups', t('fields.groups'), newValue)}
              disabled={viewOnly}
              renderInput={(params) => (
                <TextField
                  {...params}
                  size="small"
                  label={t('fields.groups')}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      'backgroundColor': viewOnly ? themeColors?.lightBackground : 'white',
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: themeColors?.background,
                      },
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: themeColors?.background,
                    },
                  }}
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

export default SystemInfoSection
